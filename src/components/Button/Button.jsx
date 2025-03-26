import React from 'react';
import { Spinner } from '../components';

const Button = ({ text, onClick, type = 'button', className = '', styles, disabled, id, textColorHover, icon, loading }) => {

    return (
        <>
            <button
                type={type}
                onClick={onClick}
                disabled={disabled}
                className={`group ${disabled ? 'cursor-not-allowed text-text bg-lightgray border-gray border-2' : 'bg-primary text-white hover:bg-secondary'}  w-fit py-2 px-4    font-semibold rounded-md transition duration-300 ease-in-out transform focus:outline-none ${className} `}
                style={styles}
                id={id}
            >
                {loading ? <Spinner /> :
                    <div className='flex items-center justify-center gap-1 '>
                        <span className={`${disabled ? "text-text" : "text-white"} text-xl pb-[2px] `}>{icon}</span>
                        <span className={` hover:${textColorHover} max-md:text-sm`}>{text}</span>

                    </div>
                }
            </button >
        </>
    );
};

export default Button;