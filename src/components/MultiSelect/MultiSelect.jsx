import  { useState, useRef, useEffect } from "react";
import { FaCaretDown, FaTimes } from "react-icons/fa";
import { Spinner } from "../components";

const MultiSelect = ({
    id,
    label,
    disabled,
    options,
    value = [],
    placeholder,
    onChange,
    className,
    optionIcons,
    selectIcon,
    isSelected,
    onClick,
    onMouseEnter,
    isLoading = false,
    maxHeight = "h-16",
}) => {
    const selectRef = useRef(null);
    const [selectStatus, setSelectStatus] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
        setSelectStatus(isSelected);
    }, [isSelected]);

    const selectHandler = () => {
        if (disabled) return;
        setSelectStatus((prev) => !prev);
        if (!selectStatus && onClick) onClick();
    };

    const searchHandler = (e) => {
        setSearchValue(e.target.value);
    };

    const selectOptionHandler = (option) => {
        const isSelected = value.some(item => item.value === option.value);
        let newValue;

        if (isSelected) {
            newValue = value.filter(item => item.value !== option.value);
        } else {
            newValue = [...value, option];
        }

        onChange(newValue);
    };

    const removeOption = (optionValue, e) => {
        e.stopPropagation();
        const newValue = value.filter(item => item.value !== optionValue);
        onChange(newValue);
    };

    const filteredOptions = options?.filter((option) =>
        option?.label?.toLowerCase().includes(searchValue.toLowerCase())
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
                className={`relative max-${maxHeight} min-h-14  rounded-md border border-gray flex items-center justify-between ${disabled && "bg-slate-100 "
                    }`}>
                <label
                    htmlFor={id}
                    className={`text-sm z-10 bg-white mb-2 absolute -top-3 left-3 px-1 roounded-md text-text`}>
                    {label}
                </label>
                <div
                    className="flex items-center justify-between w-full bg-transparent text-text cursor-pointer h-[90%] overflow-hidden  "
                    onClick={selectHandler}>
                    <div className={`flex items-center gap-3 text-text overflow-y-auto my-2 px-2 max-${maxHeight}`}>
                        <span className="text-primary">{selectIcon}</span>
                        {value.length > 0 ? (
                            <div className="flex flex-wrap gap-1 overflow-hidden">
                                {value.map((item) => (
                                    <span
                                        key={item.value}
                                        className="flex  gap-2 bg-slate-100 rounded-md px-2 py-1 text-xs"
                                    >
                                        <FaTimes
                                            className="text-slate-500 mt-[2px] hover:text-slate-700 cursor-pointer"
                                            onClick={(e) => removeOption(item.value, e)}
                                        />
                                        <span className="w-[90%]"> 
                                        {item.label}

                                        </span>
                                        
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <span className="text-slate-400">{placeholder}</span>
                        )}
                    </div>
                    <FaCaretDown
                        className={`text-text transform transition-transform ${selectStatus ? "rotate-180" : ""
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
                            <ul className="overflow-y-auto max-h-40">
                                {filteredOptions.map((option, index) => {
                                    const isSelected = value.some(item => item.value === option.value);
                                    return (
                                        <li
                                            key={index}
                                            className={`p-3 flex items-center justify-between text-sm hover:bg-slate-100 cursor-pointer ${isSelected ? "text-primary font-medium" : "text-slate-500"
                                                }`}
                                            onClick={() => selectOptionHandler(option)}
                                        >
                                            <div className="flex items-center gap-3">
                                                {optionIcons && <span>{optionIcons}</span>}
                                                {option.label}
                                            </div>
                                            {isSelected && (
                                                <span className="text-primary">✓</span>
                                            )}
                                        </li>
                                    );
                                })}
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

export default MultiSelect;