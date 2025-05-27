import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch({ type: "user/logout" });
    localStorage.removeItem("auth_token");
    toast.success("Logout successfully");
    navigate("/login");
  };

  return logoutHandler;
};

export default useLogout;
