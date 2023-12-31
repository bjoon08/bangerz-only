from helpers.account_helper import Account
from fastapi import APIRouter, Depends, Response
from typing import Union, List
from queries.posts import Error, PostIn, PostRepository, PostOut
from authenticator import authenticator

router = APIRouter()


# response model is making sure that you have the exact properties
# that you want, so if you send back a bad response and don't
# have an edge case for it, it will be mad at you
@router.post("/posts", response_model=Union[PostOut, Error])
def create_post(
    post: PostIn,
    response: Response,
    repo: PostRepository = Depends(),
    account: dict = Depends(authenticator.try_get_current_account_data),
) -> PostOut:
    if account is None:
        # display 401 unauthorized error
        response.status_code = 401
        return Error(message="Sign in to make a post")

    curr_account = Account(account)
    result = repo.create(curr_account, post)

    if result is None:
        response.status_code = 404
        result = Error(message="Could not create post")

    return result


@router.get("/posts", response_model=Union[List[PostOut], Error])
def get_all(
    response: Response,
    repo: PostRepository = Depends(),
    account: dict = Depends(authenticator.try_get_current_account_data),
):
    result = repo.get_all(account)

    if result is None:
        response.status_code = 404
        result = Error(message="Could not get list of posts")
    else:
        response.status_code = 200
        return result


@router.get("/posts/{post_id}", response_model=Union[PostOut, Error])
def get_one(
    post_id: int,
    response: Response,
    repo: PostRepository = Depends(),
    account: dict = Depends(authenticator.try_get_current_account_data),
) -> PostOut:
    result = repo.get_one(account, post_id)

    if result is None:
        response.status_code = 404
        result = Error(message="Invalid post id")

    return result


@router.put("/posts/{post_id}", response_model=Union[PostOut, Error])
def update(
    post_id: int,
    post: PostIn,
    response: Response,
    repo: PostRepository = Depends(),
    account: dict = Depends(authenticator.try_get_current_account_data),
) -> Union[PostOut, Error]:
    if account is None:
        response.status_code = 401
        return Error(message="Sign in to access")

    curr_account = Account(account)
    result = repo.update(curr_account, post_id, post)

    if result is None:
        response.status_code = 404
        result = Error(message="Could not update post")
    else:
        response.status_code = 200
        return result


@router.delete("/posts/{post_id}", response_model=Union[bool, Error])
def delete(
    post_id: int,
    response: Response,
    repo: PostRepository = Depends(),
    account: dict = Depends(authenticator.try_get_current_account_data),
) -> Union[bool, Error]:
    if account is None:
        response.status_code = 401
        return Error(message="Sign in to access")

    curr_account = Account(account)
    result = repo.delete(curr_account, post_id)

    if result is None:
        response.status_code = 404
        result = Error(message="Invalid post id")
    else:
        response.status_code = 200
        return result
