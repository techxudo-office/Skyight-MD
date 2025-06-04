import { useEffect, useRef, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

const Input = ({
  id,
  edit,
  type,
  name,
  label,
  value,
  profile,
  onChange,
  disabled,
  className,
  isSelected,
  onEditClick,
  placeholder,
  autoComplete,
  setEditingField,
  inputClass,
}) => {
  const inputRef = useRef();
  const eyeIconRef = useRef(null); // Used to detect blur exceptions (e.g., when clicking the eye icon)
  const [showPassword, setShowPassword] = useState(false);

  // Toggles password visibility between "password" and "text"
  const showPasswordHandler = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    // Automatically focus and show picker if the field is selected and it's a date input
    if (isSelected) {
      inputRef.current.focus();
      if (type === "date" || type === "datetime-local") {
        inputRef.current.showPicker();
      }
    }
  }, [isSelected]);

  return (
    <div className={`flex flex-col w-full ${className}`}>
      <div
        className={`relative flex items-center rounded-lg border border-gray text-text ${
          disabled ? "bg-slate-100" : "bg-white"
        }`}
      >
        <label
          htmlFor={id}
          className="absolute px-1 mb-2 text-sm bg-white rounded-md -top-3 left-3 text-text"
        >
          {label}
        </label>

        <input
          ref={inputRef}
          className={`w-full px-3 py-3 bg-transparent outline-none ${inputClass}`}
          id={id}
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          } // Conditionally switch between "text" and "password" for password fields
          disabled={disabled}
          name={name}
          value={value ?? ""}
          placeholder={placeholder}
          onChange={onChange}
          autoComplete={autoComplete}
          required
          onBlur={(e) => {
            // Close editing if clicked outside input (excluding eye icon)
            if (setEditingField && e.relatedTarget !== eyeIconRef.current) {
              setEditingField(null); // Tell parent that this input is no longer being edited
              setShowPassword(false); // Reset password visibility when leaving the field
            }
          }}
        />

        {/* Show edit icon only if field is disabled AND meant to be editable (like in profile forms) */}
        {disabled && profile && edit && (
          <span
            className="absolute text-xl cursor-pointer right-3 text-primary"
            onClick={onEditClick}
          >
            <MdEdit className="text-xl text-black" />
          </span>
        )}

        {/* Show eye toggle only for password fields that are not disabled */}
        {type === "password" && !disabled && (
          <span
            ref={eyeIconRef}
            className="absolute cursor-pointer right-3 eye-icon"
            onMouseDown={(e) => e.preventDefault()} // Prevent focus loss when clicking the icon
            onClick={showPasswordHandler}
          >
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </span>
        )}
      </div>
    </div>
  );
};

export default Input;
