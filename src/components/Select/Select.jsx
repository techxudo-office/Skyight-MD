import React, { useState, useRef, useEffect } from "react";
// import { FaChevronDown } from "react-icons/fa";
import { FaCaretDown } from "react-icons/fa";
import { Spinner } from "../components";

const Select = ({
  id,
  key,
  label,
  disabled,
  options,
  value,
  placeholder,
  onChange,
  className,
  optionIcons,
  selectIcon,
  isSelected,
  onClick,
  onMouseEnter,
  isLoading = false,
  height = "h-14",
}) => {
  const selectRef = useRef(null);
  const [selectStatus, setSelectStatus] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  useEffect(() => {
    setSelectStatus(isSelected);
  }, [isSelected]);

  const selectHandler = () => {
    if (disabled) {
      return;
    } else {
      setSelectStatus((prev) => !prev);

      if (!selectStatus && onClick) {
        onClick();
      }
    }
  };

  const searchHandler = (e) => {
    setSearchValue(e.target.value);
  };

  const selectOptionHandler = (option) => {
    onChange(option);
    setSearchValue("");
    setSelectStatus(false);
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setSelectStatus(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`flex flex-col ${className ? className : "w-full"}`}
      ref={selectRef}>
      <div
        onMouseEnter={onMouseEnter}
        className={`relative ${height} rounded-md border border-gray flex items-center justify-between px-2 ${
          disabled && "bg-slate-100"
        }`}>
        <label
          htmlFor={id}
          className={` text-md bg-white font-medium  mb-2 absolute -top-3 left-3  px-1 roounded-md text-text`}>
          {label}
        </label>
        <div
          className="flex items-center justify-between w-full px-3 py-5 bg-transparent text-text"
          onClick={selectHandler}>
          <span className="flex items-center gap-3 text-text">
            <span className="text-primary">{selectIcon}</span>
            {(value && value) || placeholder}
          </span>
          <FaCaretDown
            className={`text-text transform transition-transform ${
              selectStatus ? "rotate-180" : ""
            }`}
          />
        </div>

        {selectStatus && (
          <div className="absolute top-full left-0 z-10 w-full bg-white shadow-md border-[1px] border-gray mt-2 rounded-md">
            <div className="p-2">
              <input
                type="text"
                className="w-full p-2 text-sm border rounded-md border-slate-200 focus:outline-none focus:ring focus:ring-primary focus:border-primary"
                placeholder="Search..."
                value={searchValue}
                onChange={searchHandler}
              />
            </div>

            {isLoading ? (
              <Spinner className={"text-primary my-2"} />
            ) : (
              <ul className="overflow-y-auto max-h-40 ">
                {filteredOptions.map((option, index) => (
                  <li
                    key={index}
                    className={`p-3 flex items-center justify-start gap-3 text-sm  hover:bg-slate-100 ${
                      value?.value === option.value
                        ? "text-primary font-medium"
                        : "text-slate-500"
                    }`}
                    onClick={() => selectOptionHandler(option)}>
                    {optionIcons && <span>{optionIcons}</span>}
                    {option.label}
                  </li>
                ))}
                {filteredOptions.length === 0 && (
                  <li className="p-3 text-sm text-text-500">
                    No options found
                  </li>
                )}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Select;
