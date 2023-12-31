import { useState } from "react";
import useToken from "@galvanize-inc/jwtdown-for-react";
import { useNavigate } from "react-router-dom";

import "./signup.css"

const SignupForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [first_name, setFirst] = useState("");
  const [last_name, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const { register } = useToken();
  const navigate = useNavigate();

  const handleRegistration = async (e) => {
    e.preventDefault();
    // File Upload
    let uploadedFile;
    if (profileImg) {
      const formData = new FormData();
      formData.append("file", profileImg);
      formData.append("file_type", "image");
      const response = await fetch(
        `${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/files`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      uploadedFile = data.id;
    }

    // After the image reference ID is obtained, the image reference ID is assigned to the profile_img for the account.
    const accountData = {
      username: username,
      password: password,
      first_name: first_name,
      last_name: last_name,
      email: email,
      profile_img: uploadedFile,
    };

    try {
      await register(
        accountData,
        `${process.env.REACT_APP_SAMPLE_SERVICE_API_HOST}/accounts`
      );
      navigate("/profile");
    } catch (error) {
      console.error("Error during registration", error);
    }
  };

  const onFileChange = (e) => {
    setProfileImg(e.target.files[0]);
  };

  return (
    <div className="signup-body">
      <div className="signup-body2">
        <div className="mx-auto flex h-full w-2/3 flex-col justify-center text-black xl:w-1/2">
          <div>
            <p className="signup-body-text">Sign Up</p>
            <p className="signup-body-text2">Please fill in the information below</p>
          </div>
          <div className="mt-10">
            <form onSubmit={(e) => handleRegistration(e)}>
              <div>
                <label
                  className="username"
                  htmlFor="username"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  className="user-input"
                  placeholder="Enter your username..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="mt-4">
                <label
                  className="password"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="pass-input"
                  placeholder="Enter your password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="mt-4">
                <label className="firstname" htmlFor="first">
                  First Name
                </label>
                <input
                  type="text"
                  id="first"
                  className="first-input"
                  placeholder="Enter your first name..."
                  value={first_name}
                  onChange={(e) => setFirst(e.target.value)}
                />
              </div>
              <div className="mt-4">
                <label className="lastname" htmlFor="last">
                  Last Name
                </label>
                <input
                  type="text"
                  id="last"
                  className="last-input"
                  placeholder="Enter your last name..."
                  value={last_name}
                  onChange={(e) => setLast(e.target.value)}
                />
              </div>
              <div className="mt-4">
                <label className="email" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="email-input"
                  placeholder="Enter your email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mt-4">
                <label className="image-upload" htmlFor="image">
                  Profile Image
                </label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={onFileChange}
                  className="image-input"
                />
              </div>
              <div className="signup-button2">
                <button
                  className="signup-button2-1"
                  type="submit"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="h-screen w-1/2 bg-blue-600">
        <img
          src="https://cdn.discordapp.com/attachments/1064028865741197413/1110695341222801469/tort_None_cbb19bf3-9a72-4f5b-b236-a1d2f94b1d34.png"
          className="h-full w-full object-cover"
          alt=""
        />
      </div>
    </div>
  );
};

export default SignupForm;
