import React from "react";

const ForgotUsernameForm = ({ onBack }) => {
  return (
    <div>
      <h2 className="text-center text-lg font-bold text-[#330000] mb-4">
        Forgot Username
      </h2>
      <form action="/orcanosdemo/web/Account/ForgotUsername" method="post">
        <div className="mb-4">
          <label htmlFor="email" className="block text-[#563A1D] font-bold">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="Email"
            placeholder="Please type your Email"
            required
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#d08b3b]"
          />
        </div>
        <div className="flex gap-3 justify-center">
  <button
    type="button"
    onClick={onBack}
    className="w-32 py-2 px-4 rounded-lg border border-blue-600 text-blue-600 bg-white hover:bg-blue-100 text-center"
  >
    Back
  </button>

  <button
    type="submit"
    className="w-32 py-2 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-center"
  >
    Send
  </button>
</div>

      </form>
    </div>
  );
};

export default ForgotUsernameForm;
