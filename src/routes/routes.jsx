import React, { useEffect, useRef } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { routesData } from "../data/routesData";
import toast from "react-hot-toast";

const AppRoutes = () => {
  const navigate = useNavigate();
  const auth = localStorage.getItem("auth_token");
  const { adminData } = useSelector((state) => state.auth);

  const isInitialRender = useRef(true);

  useEffect(() => {
    if (!auth) {
      if (!isInitialRender.current) {
        navigate("/", { replace: true });
        toast.success("Logged out successfully");
      } else {
        isInitialRender.current = false;
      }
    }
  }, [auth]);

  return (
    <Routes>
      {routesData.map((route, index) => {
        if (route.children) {
          return (
            <Route key={index} path={route.path} element={route.element}>
              {route.children.map((child, childIndex) => (
                <Route
                  key={childIndex}
                  index={child.index}
                  path={child.path}
                  element={
                    child.protected && !adminData?.token ? (
                      <Navigate to="/" replace />
                    ) : (
                      child.element
                    )
                  }
                />
              ))}
            </Route>
          );
        }

        return (
          <Route
            key={index}
            path={route.path}
            element={
              route.protected && !adminData?.token ? (
                <Navigate to="/" replace />
              ) : (
                route.element
              )
            }
          />
        );
      })}
    </Routes>
  );
};

export default AppRoutes;
