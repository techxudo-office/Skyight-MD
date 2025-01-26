import React from 'react';

const Container = ({ children, className }) => {
    return (
        <>
            <div className={`min-h-[100vh] w-screen ${className}`}>
                {children}
            </div>
        </>
    );
};

export default Container;
