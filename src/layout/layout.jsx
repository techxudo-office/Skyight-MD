import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Sidebar, Header } from "../components/components";
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
    <div className="flex ">
      {/* Redirect to login if no token is found (user is unauthenticated) */}
      {!adminData?.token ? (
        <Navigate to="/" replace />
      ) : (
        <>
          {/* Sidebar component, controlled by sidebarStatus state */}
          <Sidebar status={sidebarStatus} updateStatus={setSidebarStatus} />

          {/* Header component with ability to toggle sidebar visibility */}
          <Header
            sidebarStatus={sidebarStatus}
            setSidebarStatusHandler={setSidebarStatusHandler}
          />

          {/* Main content area, with padding and layout styling */}
          <div className="relative flex flex-col flex-1 min-h-screen pt-16 lg:pb-10">
            {/* Outlet renders nested child routes inside this layout */}
            <div className="flex justify-center w-full min-h-screen p-5 bg-background">
              <Outlet />
            </div>

            {/* Footer section fixed at bottom with copyright info */}
            <div className="absolute bottom-0 flex justify-center w-full py-2 bg-white">
              <h2 className="mt-2 text-sm font-semibold text-center text-text">
                © 2025 All rights reserved by Techxudo
              </h2>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default Layout;
