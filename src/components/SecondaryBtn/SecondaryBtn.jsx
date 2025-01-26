import React from 'react';

const SecondaryButton = ({ text, onClick, type = 'button', className = '', styles, disabled }) => {
    return (
        <>
            <button
                type={type}
                onClick={onClick}
                disabled={disabled}
                className={`w-full py-3 px-6 bg-blue-100 hover:text-black text-primary font-semibold rounded-full transition duration-300 ease-in-out transform focus:outline-none ${className}`}
                style={styles}
            >
                {text}
            </button >
        </>
    );
};

export default SecondaryButton;
