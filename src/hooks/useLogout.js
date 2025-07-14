import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

// Custom hook to handle user logout functionality
const useLogout = () => {
  const dispatch = useDispatch(); // Redux dispatch to trigger actions
  const navigate = useNavigate(); // React Router's navigation function

  // Function to perform logout:
  // - Dispatches logout action to Redux store (clears user state)
  // - Shows an error toast notifying the user that the session expired
  // - Redirects user to the login page
  const logoutHandler = () => {
    console.log("Logging out..."); // Log to console for debugging
    dispatch({ type: "user/logout" });
    toast.error("Session Expired");
    navigate("/");
  };

  return logoutHandler; // Return logout function for use in components
};

export default useLogout;
