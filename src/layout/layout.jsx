import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar, Header } from '../components/components';

const Layout = () => {

    const [sidebarStatus, setSidebarStatus] = useState(true);

    const setSidebarStatusHandler = (status) => {
        setSidebarStatus(status);
    };

    return (
        <div className="flex ">
            <Sidebar status={sidebarStatus} />
            <Header sidebarStatus={sidebarStatus} setSidebarStatusHandler={setSidebarStatusHandler} />
            <div className="flex-1 relative flex flex-col min-h-screen  pt-16 pb-10">
                    <div className="flex   justify-center w-full p-5">
                        <Outlet />
                    </div>
                <div className="absolute bottom-0  flex justify-center w-full  py-2 bg-white">
                    <h2 className="mt-2 font-semibold text-center text-text text-sm">© 2024 All rights reserved by SKYIGHT AIR & BOOKING SYSTEM</h2>
                </div>
            </div>
        </div>
    );
};

export default Layout;
