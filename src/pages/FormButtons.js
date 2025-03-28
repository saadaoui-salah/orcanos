import React from "react";

const FormButtons = ({ onSubmit, onCancel, onTogglePassword, passwordVisible }) => {
  return (
    <div className="flex justify-between mt-4">
      <button
        type="button"
        onClick={onCancel}
        className="kabab-forgot-password-form__btn kabab-forgot-password-form__btn-outline"
      >
        Cancel
      </button>

      <button
        type="submit"
        onClick={onSubmit}
        className="kabab-forgot-password-form__btn kabab-forgot-password-form__btn--filled"
        id="kabab-btn-loading"
      >
        Send
      </button>

      <button
        type="button"
        onClick={onTogglePassword}
        className="absolute right-3 text-gray-500"
      >
        {passwordVisible ? <i className="mdi mdi-eye-off-outline"></i> : <i className="mdi mdi-eye-outline"></i>}
      </button>
    </div>
  );
};

export default FormButtons;
