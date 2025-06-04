import { useEffect, useRef } from "react";

const Dropdown = ({ status, changeStatus, options, className }) => {
  const dropdownRef = useRef(null); // Reference to the dropdown element to detect clicks outside

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close dropdown if user clicks outside of the dropdown element
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        changeStatus(false);
      }
    };

    // Add event listener when the component mounts
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up event listener on unmount to avoid memory leaks
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
                      onClick={option.handler && option.handler} // Trigger the associated handler if provided
                      className="flex items-center px-4 py-2 text-sm text-gray-700 transition-all cursor-pointer rounded-xl text-slate-500 hover:bg-slate-100 hover:text-primary"
                    >
                      {option && <span className="me-3">{option.icon}</span>}{" "}
                      {/* Show icon if present */}
                      <span>{option.name}</span> {/* Show option name */}
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
