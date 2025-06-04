import React from "react";
import { MdCancel } from "react-icons/md";

export default function Modal({
  imgsrc,
  Message,
  title,
  onBtnClick,
  btnText,
  active,
  toggle,
  onClose, // Handle closing from parent
}) {
  if (!active) return null; // Hide modal when inactive

  return (
    <div className="fixed inset-0 flex items-center justify-center max-md:px-5 bg-black backdrop-blur-sm z-[999] bg-opacity-50">
      {/* Close Button */}
      {toggle && (
        <MdCancel
          className="absolute text-2xl bg-white rounded-full cursor-pointer top-10 right-4 md:right-10 text-redColor"
          onClick={onClose} // Use prop-based closing
        />
      )}

      <div className="w-full max-w-md py-5 bg-blue-100 border-2 shadow-xl rounded-2xl border-primary">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src={imgsrc} alt="logo" className="w-20" />
        </div>

        {/* Message */}
        <h2 className="py-3 mb-2 text-xl font-semibold text-center text-white bg-primary">
          {title}!
        </h2>
        <p className="p-4 mb-3 font-semibold text-center text-gray-600 md:mb-6 md:p-7 md:px-16">
          {Message}
        </p>

        {/* Button */}
        <div className="flex justify-center">
          <button
            onClick={onBtnClick}
            className="px-6 py-2 font-semibold text-white capitalize transition-colors bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            {btnText}
          </button>
        </div>
      </div>
    </div>
  );
}
