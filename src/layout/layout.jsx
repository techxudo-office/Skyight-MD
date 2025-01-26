import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar, Header } from '../components/components';

const Layout = () => {

    const [sidebarStatus, setSidebarStatus] = useState(true);

    const setSidebarStatusHandler = (status) => {
        setSidebarStatus(status);
    };

    return (
        <div className=" flex h-screen">
            <Sidebar status={sidebarStatus} />
            <div className="flex-1">
                <Header sidebarStatus={sidebarStatus} setSidebarStatusHandler={setSidebarStatusHandler} />
                <div className="flex flex-col justify-between items-center h-[88%] bg-slate-100 overflow-scroll"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    <div className="w-full flex justify-center items-center p-5">
                        <Outlet />
                    </div>
                    <div className="flex bg-white p-3 pb-0 w-full justify-center items-center">
                        <h2 className="text-text text-md font-semibold mt-2 text-center">© 2024 All rights reserved by SKYIGHT AIR & BOOKING SYSTEM</h2>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Layout;
