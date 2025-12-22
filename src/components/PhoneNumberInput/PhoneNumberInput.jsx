import { useRef, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./PhoneNumberInput.css";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { MdEdit } from "react-icons/md";

const PhoneNumberInput = ({
  id,
  name,
  label,
  value = "",
  profile,
  onChange,
  disabled,
  className,
  isSelected,
  onEditClick,
  placeholder,
  autoComplete,
  setEditingField,
  roundedFull = false
}) => {
  const inputRef = useRef();

  useEffect(() => {
    if (isSelected) {
      inputRef.current.focus();
    }
  }, [isSelected]);

  const handlePhoneChange = (value) => {
    const phoneNumber = parsePhoneNumberFromString(`+${value}`);

    const parsedData = phoneNumber
      ? {
        country_code: phoneNumber.countryCallingCode,
        area_code: phoneNumber.nationalNumber?.slice(0, 3) || "", // First 3 digits as area code
        number: phoneNumber.nationalNumber?.slice(3) || "", // Remaining digits as number
      }
      : { country_code: "", area_code: "", number: "" };

    if (onChange) onChange(parsedData);
  };

  return (
    <div className={`flex flex-col w-full ${className}`}>
      <div
        className={`relative flex items-center py-1 ${roundedFull ? "rounded-full" : "rounded-md"} border border-gray text-text ${disabled ? "bg-slate-100" : "bg-white"
          }`}
      >
        {label && (
          <label
            htmlFor={id}
            className="absolute px-1 mb-2 text-base font-medium bg-white rounded-md -top-3 left-3 text-text"
          >
            {label}
          </label>
        )}
        <PhoneInput
          ref={inputRef}
          country={"pk"} // Default country
          value={value}
          onChange={handlePhoneChange}
          inputProps={{
            id,
            name,
            disabled,
            placeholder,
            autoComplete,
            onBlur: () => setEditingField?.(null),
            className:
              "w-full px-3 pt-3 bg-transparent outline-none text-base pl-10",
          }}
          inputClass={`w-full px-3 !bg-white outline-none ${roundedFull ? "rounded-full" : "rounded-md"}`}
          containerClass={`w-full h-12 ${roundedFull ? "rounded-full" : "rounded-md"}`}
          buttonClass="!border-none !bg-transparent"
          dropdownClass="!border-none"
        />
        {disabled && profile && (
          <span
            className="absolute text-xl cursor-pointer right-3 text-primary"
            onClick={onEditClick}
          >
            <MdEdit className="text-xl text-black" />
          </span>
        )}
      </div>
    </div>
  );
};

export default PhoneNumberInput;
