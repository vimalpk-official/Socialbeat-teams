import "./Login.css";
import React, { useState, useContext } from "react";
import { Button } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import axios from "axios";

function Login() {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [userNotFound, setUserNotFound] = useState(false);

  const navigate = useNavigate();
  const { setEmail } = useContext(AppContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    setUserNotFound(false);

    const emailRegex = /^[a-zA-Z0-9._%+-]+@socialbeat\.in$/;

    if (!emailRegex.test(input)) {
      setError(true);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:7000/login/validation",
        {
          email: input,
        }
      );

      console.log("Response from backend:", response.data);

      if (response.data.status === "success") {
        setEmail(input);
        navigate("/home");
      } else {
        setUserNotFound(true);
      }
    } catch (err) {
      console.error("Backend error:", err);
      setUserNotFound(true);
    }
  };

  return (
    <div className="login-body">
      <div className="grid grid-cols-12">
        <div className="col-span-4 lg:col-start-5 !mt-20 p-4 bg-white rounded-lg shadow-md">
          <form onSubmit={handleSubmit}>
            <img
              src="https://www.socialbeat.in/wp-content/themes/socialbeat/assets/images/sb-logos/sb_cheil_2025_logos.png"
              alt="Logo"
              className="w-40 object-contain mx-auto"
            />
            <h2 className="text-xl my-4 font-semibold text-start !my-4">
              Team Dashboard Login
            </h2>

            <input
              type="email"
              placeholder="Enter your SocialBeat email"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === " ") e.preventDefault();
              }}
              onPaste={(e) => {
                e.preventDefault();
                const pastedText = e.clipboardData.getData("text");
                const cleanedText = pastedText.replace(/\s/g, "");
                setInput(cleanedText);
              }}
              className="block border border-gray-300 rounded px-4 py-2 w-full !mb-2"
            />

            {error && (
              <p className="text-red-500 mb-2 text-sm">
                Only @socialbeat.in email ID will be valid to login
              </p>
            )}

            {userNotFound && (
              <p className="text-red-500 text-sm flex items-center gap-1 !mb-2">
                <CloseCircleOutlined className="text-red-600 text-base" />
                User does not exist
              </p>
            )}

            <Button type="primary" ghost htmlType="submit" className="w-full">
              Login
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
