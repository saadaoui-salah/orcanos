"use client";
import React, { useState } from "react";
import { submitForm } from "./actions";
import { CSVUploader } from "./ProccessResults";
const LoginForm = ({
  setLoginForm,
  loginForm,
  handleTogglePasswordDisplaying,
  passwordVisible,
  handleSubmit,
}) => (
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

      <form onSubmit={handleSubmit}>
        <div className="text-center mb-4">
          <div className="text-[#330000]">Login to account: orcanosdemo</div>
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
              type={"password"}
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
                  passwordVisible ? "mdi-eye-off-outline" : "mdi-eye-outline"
                }`}
                id="eye-toggle"
              ></i>
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="w-2/6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition block mx-auto"
        >
          Login
        </button>
        <div className="text-[#563A1D] text-sm mt-8 text-center hover:underline">
          Need Help? Let’s Chat
        </div>
      </form>
    </div>
  </div>
);

const Home = () => {
  const [page, setPage] = useState(
    typeof localStorage !== "undefined" && localStorage.getItem("auth")
      ? "csv"
      : "login"
  );
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loginForm, setLoginForm] = useState({});

  const handleTogglePasswordDisplaying = () => {
    setPasswordVisible(!passwordVisible);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const result = await submitForm(formData);
    if (result.apiResponse.IsSuccess) {
      const auth = `${loginForm.username}:${loginForm.password}`;
      localStorage.setItem("auth", `Bearer ${btoa(auth)}`);
      setPage("csv");
    }
  }

  return (
    <>
      {page === "login" ? (
        <LoginForm
          handleSubmit={handleSubmit}
          setLoginForm={setLoginForm}
          loginForm={loginForm}
          handleTogglePasswordDisplaying={handleTogglePasswordDisplaying}
          passwordVisible={passwordVisible}
        />
      ) : (
        <CSVUploader />
      )}
    </>
  );
};

export default Home;
