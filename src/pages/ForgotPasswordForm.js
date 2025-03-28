import React, { useState } from "react";
import ForgotUsernameForm from "./ForgotUsernameForm";

const ForgotPasswordForm = ({ onBack }) => {
  const [showForgotUsername, setShowForgotUsername] = useState(false);

  if (showForgotUsername) {
    return <ForgotUsernameForm onBack={() => setShowForgotUsername(false)} />;
  }

  return (
    <div>
      <h2 className="text-center text-lg font-bold text-[#330000] mb-4">
        Forgot Password
      </h2>
      
      {/* ✅ إدخال البريد الإلكتروني */}
      <label htmlFor="kabab-username" className="block text-[#563A1D] font-medium">Email </label>
        <div className="flex flex-col">
        <input
        type="email"
        placeholder="Enter your email"
        className="w-full p-2 border rounded-lg mb-4 focus:outline-none focus:ring-1 focus:ring-[#d08b3b]"
      />
          <span className="text-red-500 text-sm mt-1 hidden" data-valmsg-for="Username" data-valmsg-replace="true"></span>
        </div>

      {/* ✅ إدخال اسم المستخدم */}
      <div id="username" className="mb-4">
        <label htmlFor="kabab-username" className="block text-[#563A1D] font-medium">Or Username</label>
        <div className="flex flex-col">
          <input
            autoComplete="off"
            id="kabab-username"
            name="Username"
            placeholder="Please type your Username"
            tabIndex="1"
            type="text"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#d08b3b]"
          />
          <span className="text-red-500 text-sm mt-1 hidden" data-valmsg-for="Username" data-valmsg-replace="true"></span>
        </div>
      </div>
 {/* ✅ رابط "Forgot your username?" */}
 <div className=" text-right mb-4 mt-4">
        <a
          href="#"
          onClick={() => setShowForgotUsername(true)}
          className="text-[#563A1D] hover:underline"
        >
          Forgot your username?
        </a>
      </div>
      <div className="flex gap-3 justify-center">
  <button
    type="button"
    onClick={onBack}
    className="w-32 py-2 px-4 rounded-lg border border-blue-600 text-blue-600 bg-white hover:bg-blue-100 text-center"
  >
    Cancel
  </button>

  <button
    type="submit"
    className="w-32 py-2 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-center"
  >
    Send       
  </button>
</div>



     
    </div>
  );
};

export default ForgotPasswordForm;
