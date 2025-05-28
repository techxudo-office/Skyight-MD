import  { useEffect, useRef, useState } from "react";

const Teaxtarea = ({
    id,
    label,
    typeOf,
    name,
    value,
    placeholder,
    onChange,
    autoComplete,
    className,
    disabled,
    isSelected,
    onKeyPressHandler,
}) => {
    const inputRef = useRef();

    useEffect(() => {
        if (isSelected) {
            inputRef.current.focus();
        }
    }, [isSelected]);

    return (
        <>
            <div className={`flex flex-col ${className} `}>
                <div
                    className={`rounded-lg relative flex items-center justify-between ${disabled ? "bg-slate-100" : "bg-white"
                        }  `}
                >
                    <label
                        htmlFor={id}
                        className="absolute px-1 mb-2 text-base font-medium bg-white rounded-md -top-3 left-3 text-gray"
                    >
                        {label}
                    </label>
                    <textarea
                        ref={inputRef}
                        className={`flex flex-1 bg-transparent p-3 outline-none border-gray border rounded-md  cursor-default text-text h-fit `}
                        id={id}
                        name={name}
                        value={value}
                        placeholder={placeholder}
                        onChange={onChange}
                        onKeyDown={onKeyPressHandler}
                        autoComplete={autoComplete}
                    />
                </div>
            </div>
        </>
    );
};

export default Teaxtarea;