import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Sidebar, Header } from "../components/components";
import { useSelector } from "react-redux";

const Layout = () => {
  const [sidebarStatus, setSidebarStatus] = useState(true);
  const { adminData } = useSelector((state) => state.persist);

  const setSidebarStatusHandler = (status) => {
    setSidebarStatus(status);
  };

  return (
    <div className="flex ">
      {!adminData?.token ? (
        <Navigate to="/" replace />
      ) : (
        <>
          <Sidebar status={sidebarStatus} updateStatus={setSidebarStatus} />
          <Header
            sidebarStatus={sidebarStatus}
            setSidebarStatusHandler={setSidebarStatusHandler}
          />
          <div className="relative flex flex-col flex-1 min-h-screen pt-16 lg:pb-10">
            <div className="flex justify-center w-full min-h-screen p-5 bg-background">
              <Outlet />
            </div>
            <div className="absolute bottom-0 flex justify-center w-full py-2 bg-white">
              <h2 className="mt-2 text-sm font-semibold text-center text-text">
                © 2025 All rights reserved by SKYIGHT AIR & BOOKING SYSTEM
              </h2>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default Layout;
