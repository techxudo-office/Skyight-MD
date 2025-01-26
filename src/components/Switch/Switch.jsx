import React from 'react';

const Switch = ({ switchStatus }) => {

    return (
        <>
            <div className={`cursor-pointer relative w-14 h-7 rounded-full p-1 ${switchStatus ? 'bg-secondary' : 'bg-slate-200'}`}>
                <div className={`absolute ${switchStatus ? 'bg-white left-8' : 'bg-slate-400 left-1'} transition-all h-5 w-5 rounded-full`}></div>
            </div>
        </>
    );
};

export default Switch;
