import React from "react";
import "./Switch.css";

const Switch = ({ setToggle, profileData,label,disabled=false }) => {
  return (
    <div className="flex gap-3 items-center ">
      <p className="text-lg capitalize">{label}</p>
      <label className="switch">
        <input
          type="checkbox"
          className="checkbox"
          disabled={disabled}
          onChange={(e) =>
            setToggle({ ...profileData, is_active: e.target.checked })
          }
        />
        <div className="slider"></div>
      </label>
    </div>

  );
};

export default Switch;
