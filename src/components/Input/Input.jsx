import React, { useState } from "react";

import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";


const Input = ({ id, label, type, name, value, placeholder, onChange, autoComplete, onKeyPressHandler, className }) => {

    const [showPassword, setShowPassword] = useState(false);

    const showPasswordHandler = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
            <div className={`flex flex-col w-full ${className}`}>
                <label htmlFor={id} className="text-md font-medium text-gray-700 mb-2">
                    {label}
                </label>
                <div className="rounded-lg border border-slate-200 flex items-center justify-between pe-3 bg-slate-100">
                    <input
                        className="flex flex-1 w-full bg-transparent p-3 outline-none border-none cursor-pointer text-text"
                        id={id}
                        type={type === 'password' ? showPassword ? 'text' : 'password' : type}
                        name={name}
                        value={value}
                        placeholder={placeholder}
                        onChange={onChange}
                        onKeyPress={onKeyPressHandler}
                        autoComplete={autoComplete}
                    />
                    {
                        type === 'password' ?
                            <span className="cursor-pointer" onClick={showPasswordHandler}>{showPassword ? <FaEye /> : <FaEyeSlash />}</span>
                            :
                            ''
                    }
                </div>
            </div>
        </>
    );
};

export default Input;


