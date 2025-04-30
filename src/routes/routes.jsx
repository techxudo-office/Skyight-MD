import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { routesData } from "../data/routesData";
import toast from "react-hot-toast";

const AppRoutes = () => {
  const navigate = useNavigate();
  const { adminData } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!adminData?.token) {
      toast.success("Logged out successfully");
      navigate("/", { replace: true });
    }
  }, []);

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
                  element={child.element}
                />
              ))}
            </Route>
          );
        }

        return (
          <Route
            key={index}
            path={route.path}
            element={route.element}
          />
        );
      })}
    </Routes>
  );
};

export default AppRoutes;
