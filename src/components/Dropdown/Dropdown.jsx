import React, { useEffect, useRef } from "react";

const Dropdown = ({ status, changeStatus, options, className }) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        changeStatus(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {status && (
        <div
          ref={dropdownRef}
          className={`absolute inline-block text-left ${className}`}
        >
          <div className="absolute right-[-40px] z-10 w-40 rounded-xl bg-white shadow-lg">
            <ul>
              {options &&
                options.map((option, index) => {
                  return (
                    <li
                      key={index}
                      onClick={option.handler && option.handler}
                      className="flex items-center rounded-xl transition-all px-4 py-2 text-sm text-gray-700 cursor-pointer text-slate-500 hover:bg-slate-100 hover:text-primary"
                    >
                      {option && <span className="me-3">{option.icon}</span>}
                      <span>{option.name}</span>
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Dropdown;
