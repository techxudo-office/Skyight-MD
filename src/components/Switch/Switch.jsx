import React from "react";
import "./Switch.css";

const Switch = ({ setToggle, profileData }) => {
  return (
    <label className="switch">
      <input
        type="checkbox"
        className="checkbox"
        onChange={(e) =>
          setToggle({ ...profileData, is_active: e.target.checked })
        }
      />
      <div className="slider"></div>
    </label>
  );
};

export default Switch;
