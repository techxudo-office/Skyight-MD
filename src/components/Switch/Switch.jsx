import React from "react";
import "./Switch.css";

const Switch = ({ setToggle, label, disabled = false }) => {
  return (
    <div className="flex items-center gap-3 ">
      <p className="text-xl font-semibold capitalize">{label}</p>
      <label className="switch">
        <input
          type="checkbox"
          className="checkbox"
          disabled={disabled}
          onChange={(e) => setToggle(e.target.checked)}
        />
        <div className="slider"></div>
      </label>
    </div>
  );
};

export default Switch;
