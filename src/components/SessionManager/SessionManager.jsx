import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import ModalWrapper from "../ModalWrapper/ModalWrapper";
import { useNavigate } from "react-router-dom";

export default function SessionManager() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const warnTimer = useRef(null);
  const logoutTimer = useRef(null);
  const [warnModal, setWarnModal] = useState(false);
  const { adminData } = useSelector((state) => state.persist);

  useEffect(() => {
    // clear any existing timers
    clearTimeout(warnTimer.current);
    clearTimeout(logoutTimer.current);

    if (!adminData?.token) {
      setWarnModal(false);
      return;
    }

    // decode expiry (in seconds)
    const { exp } = jwtDecode(adminData?.token);
    const expireMs = exp * 1000 - Date.now();
    if (expireMs <= 0) {
      dispatch({ type: "user/logout" });
      navigate("/");
      toast.error("Session expired");
      return;
    }

    // schedule the warning 1 minute before
    warnTimer.current = setTimeout(() => {
      setWarnModal(true);
    }, expireMs - 60 * 1000);

    // schedule actual logout
    logoutTimer.current = setTimeout(() => {
      dispatch({ type: "user/logout" });
      navigate("/");
      toast.error("Session expired, Please login again");
    }, expireMs);

    // cleanup on unmount or token change
    return () => {
      clearTimeout(warnTimer.current);
      clearTimeout(logoutTimer.current);
    };
  }, [adminData?.token, dispatch]);

  return (
    <ModalWrapper
      isOpen={warnModal}
      onRequestClose={() => setWarnModal(false)}
      contentLabel="Session Expiring Soon"
      header="Session Expiring Soon"
    >
      <div className="text-center">
        <p className="mb-6 text-gray-600">
          Your session will expire in one minute. Please save your work.
        </p>
        <button
          onClick={() => {
            setWarnModal(false);
            // Optionally refresh token here if you have a refresh endpoint:
            // dispatch(refreshToken());
          }}
          className="px-6 py-2 font-semibold text-white capitalize transition-colors bg-blue-500 rounded-lg hover:bg-blue-600"
        >
          Continue Session
        </button>
      </div>
    </ModalWrapper>
  );
}
