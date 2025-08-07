import "./Login.css";
import LoginForm from "../../components/LoginForm/LoginForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import bgImage from "../../assets/images/bg.png"

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
        <div className="flex items-center justify-center bg-cover w-full h-screen animated-page max-md:px-4 bg-slate-100"
        // style={{ backgroundImage: `url(${bgImage})` }}
        >
          <div className="absolute md:bg-black/10 bg-black/20 inset-0 z-10"></div>
          <LoginForm />
        </div>
      )}
    </>
  );
};

export default Login;
