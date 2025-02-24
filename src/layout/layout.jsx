import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar, Header } from '../components/components';

const Layout = () => {

    const [sidebarStatus, setSidebarStatus] = useState(true);

    const setSidebarStatusHandler = (status) => {
        setSidebarStatus(status);
    };

    return (
        <div className="flex h-screen ">
            <Sidebar status={sidebarStatus} />
                <Header sidebarStatus={sidebarStatus} setSidebarStatusHandler={setSidebarStatusHandler} />
            <div className="flex-1 mt-16">
                <div className="flex flex-col justify-between items-center h-[88%] bg-slate-100 overflow-scroll"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    <div className="flex items-center justify-center w-full p-5">
                        <Outlet />
                    </div>
                    <div className="flex items-center justify-center w-full p-3 pb-0 bg-white">
                        <h2 className="mt-2 font-semibold text-center text-text text-md">© 2024 All rights reserved by SKYIGHT AIR & BOOKING SYSTEM</h2>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Layout;
