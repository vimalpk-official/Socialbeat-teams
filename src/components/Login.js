import "./Login.css";
import React, { useState, useContext } from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../AppContext";

function Login() {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const { setEmail } = useContext(AppContext);

  const { email } = useContext(AppContext);

  console.log("received" + email);

  const handleSubmit = (e) => {
    e.preventDefault();
    const regex = /^[a-zA-Z0-9._%+-]+@socialbeat\.in$/;

    if (regex.test(input)) {
      setEmail(input);
      setError(false);
      navigate("/home");
    } else {
      setError(true);
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
