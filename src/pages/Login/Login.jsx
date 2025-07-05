import "./Login.css";
import LoginForm from "../../components/LoginForm/LoginForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Login = () => {
  const navigate = useNavigate();
  const { adminData } = useSelector((state) => state.persist);

  useEffect(() => {
    if (adminData?.token) {
      navigate("/dashboard"); // Redirect to dashboard if user is already logged in
    }
  }, [adminData, navigate]);
  return (
    <>
      {!adminData?.token && (
        <div className="flex items-center justify-center w-full h-screen login-page bg-slate-100">
          <LoginForm />
        </div>
      )}
    </>
  );
};

export default Login;
