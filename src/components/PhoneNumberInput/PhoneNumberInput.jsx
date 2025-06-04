import { useRef, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
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
}) => {
  const inputRef = useRef();

  useEffect(() => {
    // Auto-focus the input when the component is marked as selected (e.g. for editing)
    if (isSelected) {
      inputRef.current.focus();
    }
  }, [isSelected]);

  const handlePhoneChange = (value) => {
    // Parse the raw phone number string using libphonenumber-js
    const phoneNumber = parsePhoneNumberFromString(`+${value}`);

    // Split the parsed phone number into structured data
    const parsedData = phoneNumber
      ? {
          country_code: phoneNumber.countryCallingCode, // Extract country code (e.g. "1" for USA)
          area_code: phoneNumber.nationalNumber?.slice(0, 3) || "", // First 3 digits as area code
          number: phoneNumber.nationalNumber?.slice(3) || "", // Remaining digits as the phone number
        }
      : { country_code: "", area_code: "", number: "" }; // Fallback to empty fields if parsing fails

    if (onChange) onChange(parsedData); // Trigger parent change handler with structured phone data
  };

  return (
    <div className={`flex flex-col w-full ${className}`}>
      <div
        className={`relative flex items-center rounded-lg border border-gray text-text ${
          disabled ? "bg-slate-100" : "bg-white"
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
          country={"ir"} // Set default country (Iran) for phone input formatting
          value={value}
          onChange={handlePhoneChange}
          inputProps={{
            id,
            name,
            disabled,
            placeholder,
            autoComplete,
            // Reset editing field state when input loses focus
            onBlur: () => setEditingField?.(null),
            className:
              "w-full px-3 pt-3 bg-transparent outline-none text-base pl-10",
          }}
          inputClass="w-full px-3 bg-transparent outline-none"
          containerClass="w-full h-12"
        />

        {/* If input is disabled and being displayed in a profile context, show edit icon */}
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
