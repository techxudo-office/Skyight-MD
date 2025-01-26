import React from 'react';

const Form = ({ children, heading, text }) => {
    return (
        <>
            <div className="w-full max-w-[470px] max-w-lg bg-white shadow-lg rounded-lg p-8 space-y-6">
                <h2 className="text-4xl font-bold text-center text-gray-800">
                    {heading}
                </h2>
                <p className="text-sm text-center text-gray">
                    {text}
                </p>
                <div className="space-y-4">
                    {children}
                </div>
            </div>
        </>
    );
};

export default Form;