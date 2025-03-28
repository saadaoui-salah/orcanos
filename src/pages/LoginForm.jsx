import React, { useState } from "react";
import ForgotPasswordForm from "./ForgotPasswordForm"; // تأكد من أن الملف موجود
import { login } from "../api/login";

const LoginForm = () => {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loginForm, setLoginForm] = useState({});

  const handleTogglePasswordDisplaying = () => {
    setPasswordVisible(!passwordVisible);
  };

  const submit = (e) => {
    e.preventDefault();
    login(loginForm);
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/images/OrcanosBG.png')" }}
    >
      <div className="p-8 bg-white shadow-md rounded-lg w-[500px] mx-auto">
        <div className="text-center mb-4">
          <img
            src="/images/login-page-logo.svg"
            alt="ORCANOS Logo"
            className="mx-auto mb-4"
          />
        </div>

        {!showForgotPassword ? (
          <form>
            <div className="text-center mb-4">
              <div className="text-[#330000]">
                Login to account: orcanosdemo
              </div>
            </div>
            <div className="mb-4 relative">
              <label
                htmlFor="username"
                className="block text-[#563A1D] font-medium"
              >
                Email / Username
              </label>
              <div className="flex items-center border rounded-lg p-2 focus-within:ring-1 focus-within:ring-[#d08b3b]">
                <i className="mdi mdi-account-outline text-[#563A1D] font-bold text-lg mr-2"></i>
                <input
                  type="text"
                  id="username"
                  name="Username"
                  value={loginForm?.username}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, username: e.target.value })
                  }
                  placeholder="Please type your Email / Username"
                  className="w-full focus:outline-none"
                />
              </div>
            </div>

            <div className="mb-4 relative">
              <label
                htmlFor="password"
                className="block text-[#563A1D] font-medium"
              >
                Password
              </label>
              <div className="flex items-center border rounded-lg p-2 focus-within:ring-1 focus-within:ring-[#d08b3b] relative">
                <i className="mdi mdi-lock-outline text-[#563A1D] font-bold text-lg mr-2"></i>
                <input
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  name="Password"
                  value={loginForm?.password}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, password: e.target.value })
                  }
                  placeholder="Please type your Password"
                  className="w-full focus:outline-none"
                />
                <span
                  className="kabab-login-form__input-icon cursor-pointer ml-2"
                  onClick={handleTogglePasswordDisplaying}
                >
                  <i
                    className={`icon mdi ${
                      passwordVisible
                        ? "mdi-eye-off-outline"
                        : "mdi-eye-outline"
                    }`}
                    id="eye-toggle"
                  ></i>
                </span>
              </div>
            </div>

            <div className="text-right mb-4">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-[#563A1D] hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              onClick={submit}
              className="w-2/6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition block mx-auto"
            >
              Login
            </button>
            <div className="text-[#563A1D] text-sm mt-8 text-center hover:underline">
              Need Help? Let’s Chat
            </div>
          </form>
        ) : (
          <ForgotPasswordForm onBack={() => setShowForgotPassword(false)} />
        )}
      </div>
    </div>
  );
};

export default LoginForm;
