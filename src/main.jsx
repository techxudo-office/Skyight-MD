import React, { useEffect } from "react";
import AppRoutes from "./routes/routes";
import { useNavigate } from "react-router-dom";

const Main = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem("auth_token");
    if (auth) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  }, []);

  return (
    <>
        <AppRoutes />
    </>
  );
};

export default Main;
