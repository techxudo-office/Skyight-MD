import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { routesData } from "../data/routesData";
import toast from "react-hot-toast";

const AppRoutes = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = localStorage.getItem("auth_token");
  const { adminData } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!auth) {
      toast.success("Logout Successfully");
      navigate("/", { replace: true });
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
      {/* <Route path="/dashboard/user/:companyId" element={<CompanyUsers />} /> */}
    </Routes>
  );
};

export default AppRoutes;
