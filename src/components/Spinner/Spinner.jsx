import React from "react";

const Spinner = ({ className }) => {
  return (
    <>
      <div className="flex items-center justify-center space-x-2">
        <div className="relative">
          <div
            className={`w-7 h-7 border-t-4 ${
              className ? className : "border-white"
            } border-solid rounded-full animate-spin`}
          ></div>
          <div className="absolute inset-0 flex justify-center items-center">
            <div
              className={`w-4 h-4 ${
                className ? className : "bg-white"
              } rounded-full animate-ping`}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Spinner;
