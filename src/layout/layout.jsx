import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebar/Sidebar";
import { useSelector } from "react-redux";

const Layout = () => {
  const [sidebarStatus, setSidebarStatus] = useState(true);
  // State to control whether the sidebar is shown (true = visible)

  const { adminData } = useSelector((state) => state.persist);
  // Retrieve adminData from Redux store's persisted state (used for auth)

  // Handler to update sidebar visibility status from child components (like Header)
  const setSidebarStatusHandler = (status) => {
    setSidebarStatus(status);
  };

  return (

    <div className="flex w-full">
      {/* Redirect to login if no token is found (user is unauthenticated) */}
      {/* This core logic remains unchanged as requested */}
      {!adminData?.token ? (
        <Navigate to="/" replace />
      ) : (
        // The new layout structure starts here
        <>
          <Header
            sidebarStatus={sidebarStatus}
            setSidebarStatusHandler={setSidebarStatusHandler}
          />
          <div className="flex h-screen w-full">
            <Sidebar status={sidebarStatus} updateStatus={setSidebarStatus} />

            {/* Main content area based on your new layout */}
            <div className="w-full lg:flex-1 lg:w-4/5  bg-background">
              {/* Scrollable container that holds both Outlet and Footer */}
              <div
                className="flex flex-col justify-between h-screen bg-globalBg overflow-y-auto w-full"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {/* Wrapper for the main page content (Outlet) */}
                <div className="flex flex-col items-center justify-start  w-full  pt-24 lg:pt-28">
                  <Outlet />
                </div>

                {/* Footer section from your original layout, now placed at the bottom
                of the scrollable container */}
                <div className="flex justify-center w-full py-2 bg-white">
                  <h2 className="mt-2 text-sm font-semibold text-center text-text">
                    © 2024 All rights reserved by Techxudo
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default Layout;
