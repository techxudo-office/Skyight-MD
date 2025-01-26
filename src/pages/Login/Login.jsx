import React from "react";
import "./Login.css";
import { LoginForm } from "../../components/components";

const Login = () => {
  return (
    <>
      <div className="login-page w-full flex items-center justify-center h-screen bg-slate-100">
        <LoginForm />
      </div>
    </>
  );
};

export default Login;
