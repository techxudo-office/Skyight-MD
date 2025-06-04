import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

// Custom hook to handle user logout functionality
const useLogout = () => {
  const dispatch = useDispatch(); // Redux dispatch to trigger actions
  const navigate = useNavigate(); // React Router's navigation function

  // Function to perform logout:
  // - Dispatches logout action to Redux store (clears user state)
  // - Shows an error toast notifying the user that the session expired
  // - Redirects user to the login page
  const logoutHandler = () => {
    dispatch({ type: "user/logout" });
    toast.error("Session Expired");
    navigate("/login");
  };

  return logoutHandler; // Return logout function for use in components
};

export default useLogout;
