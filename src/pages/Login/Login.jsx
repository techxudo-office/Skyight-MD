import "./Login.css";
import  LoginForm  from "../../components/LoginForm/LoginForm";

const Login = () => {
  return (
    <>
      <div className="flex items-center justify-center w-full h-screen login-page bg-slate-100">
        <LoginForm />
      </div>
    </>
  );
};

export default Login;
