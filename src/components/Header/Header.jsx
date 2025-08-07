import { useEffect, useRef, useState } from "react";
import { FiLogOut } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import Dropdown from "../Dropdown/Dropdown";
import CustomTooltip from "../CustomTooltip/CustomTooltip";
import CreditsDropdown from "../CreditsDropdown/CreditsDropdown";
import { HiOutlineRefresh } from "react-icons/hi";
import { GiHamburgerMenu } from "react-icons/gi";
import { SlSettings } from "react-icons/sl";
import { MdNotificationsNone } from "react-icons/md";
import { motion } from "framer-motion";
import { getCredits } from "../../_core/features/bookingSlice";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import NotificationDrop from "./NotificationDrop/NotificationDrop";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import Profileimage from "../ProfileImage/Profileimage";

const Header = ({ sidebarStatus, setSidebarStatusHandler }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  // Dropdown states
  const [dropdownStatus, setDropDownStatus] = useState(false);
  const [CreditsDropdownOpen, setCreditsDropdownOpen] = useState(false);
  const [isNotiHovered, setIsNotiHovered] = useState(false);

  // Whether to show credit amount or animated dots
  const [showCredits, setShowCredits] = useState(false);

  const { adminData } = useSelector((state) => state.persist);
  const { credits, isLoadingCredits } = useSelector((state) => state.booking);

  // Refs to detect clicks outside dropdowns (if needed later)
  const profileDropdownRef = useRef(null);
  const creditsDropdownRef = useRef(null);

  // Options for profile dropdown (Settings and Logout)
  const dropdownOptions = [
    {
      name: "Setting",
      icon: <SlSettings />,
      handler: () => {
        navigationHandler("/settings");
      },
    },
    {
      name: "Logout",
      icon: <FiLogOut />,
      handler: () => {
        logoutHandler();
      },
    },
  ];

  // Fetch latest credits from server
  const refreshCredits = () => {
    dispatch(getCredits(adminData?.token));
  };

  // Toggle the profile dropdown open/close
  const dropdownHandler = () => {
    setDropDownStatus(!dropdownStatus);
  };

  // Handle logout: clear store and show toast
  const logoutHandler = () => {
    dispatch({ type: "user/logout" });
    toast.success("Logout successfully");
    dropdownHandler(); // Close dropdown after action
  };

  // Navigate to given path, ensuring dropdown closes first
  const navigationHandler = (path) => {
    dropdownHandler();
    navigate(`/dashboard${path}`);
  };

  // Toggle sidebar open/close
  const sidebarHandler = () => {
    if ((sidebarStatus && window.innerWidth < 1024)) {
      return
    } else {

      setSidebarStatusHandler(!sidebarStatus);
    }

  };

  useEffect(() => {
    // Close notification hover preview if we're on the notifications page
    if (location.pathname === "/dashboard/notifications") {
      setIsNotiHovered(false);
    }
  }, [location.pathname]);

  return (
    <>
      <nav className="w-full fixed z-[999] bg-white shadow-md border-b-[1px] border-grayBg px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between ">
            {/* Sidebar toggle button */}
            <div className="flex items-end gap-3">
              <CustomTooltip content={"Open / close"}>
                <button
                  className="text-gray-700 transition hover:text-gray-900"
                  onClick={sidebarHandler}
                >
                  <GiHamburgerMenu size={22} />
                </button>
              </CustomTooltip>
            </div>

            {/* Right-side header icons */}
            <div className="flex items-center sm:gap-3">
              {/* Notification icon (hidden on /notifications page) */}
              {location.pathname !== "/dashboard/notifications" && (
                <div
                  className="relative"
                  onMouseEnter={() => setIsNotiHovered(true)} // Show dropdown on hover
                  onMouseLeave={() => setIsNotiHovered(false)} // Hide dropdown when not hovered
                >
                  <CustomTooltip content={"Notifications"}>
                    <div
                      className="max-md:hidden px-7"
                      onClick={() => navigate("/dashboard/notifications")}
                    >
                      <MdNotificationsNone className="text-2xl cursor-pointer text-text" />
                    </div>
                  </CustomTooltip>

                  {/* Animated dropdown appearing below the icon */}
                  {isNotiHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="absolute top-10 right-0 w-[300px] h-fit bg-neutral-100 shadow-lg rounded-lg p-2 z-50"
                    >
                      <NotificationDrop />
                    </motion.div>
                  )}
                </div>
              )}

              {/* Credits display and toggle logic */}
              <div className="relative">
                <CustomTooltip content={CreditsDropdownOpen ? null : "credits"}>
                  <button
                    ref={creditsDropdownRef}
                    className={`w-full text-sm md:text-base relative flex items-center justify-center gap-1 md:gap-2 cursor-pointer p-1 px-2 md:py-2 md:px-4 border-primary border-[1px] bg-background hover:text-secondary text-primary font-semibold rounded-xl transition duration-300 ease-in-out transform focus:outline-none`}
                  >
                    {showCredits && (
                      // Show refresh icon if credits are visible
                      <HiOutlineRefresh
                        onClick={refreshCredits}
                        className={`${isLoadingCredits && "animate-spin"
                          } max-sm:hidden`}
                      />
                    )}

                    {/* Conditional rendering: If showCredits is true, display numeric or loading text; else show dots */}
                    {showCredits ? (
                      isLoadingCredits ? (
                        <span className="flex items-center gap-2">
                          <span>Refreshing...</span>
                        </span>
                      ) : credits ? (
                        <span>
                          PKR {Number(credits?.Balence || 0).toLocaleString()}
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <span>No Credits</span>
                        </span>
                      )
                    ) : (
                      // Display six dots to indicate hidden credit amount
                      <p className="flex items-center text-xs">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <GoDotFill key={i} />
                        ))}
                      </p>
                    )}

                    {/* Icon to show or hide credits */}
                    {showCredits ? (
                      <CustomTooltip content={"Hide Credits"}>
                        <FaEye onClick={() => setShowCredits(false)} />
                      </CustomTooltip>
                    ) : (
                      <CustomTooltip content={"Show Credits"}>
                        <FaEyeSlash
                          onClick={() => {
                            refreshCredits(); // Refresh before showing
                            setShowCredits(true);
                          }}
                        />
                      </CustomTooltip>
                    )}

                    {/* Placeholder for CreditsDropdown if needed in future */}
                    <div className="absolute right-0 top-14">
                      {CreditsDropdownOpen && (
                        <CreditsDropdown
                          credits={credits}
                          onClose={() => setCreditsDropdownOpen(false)}
                        />
                      )}
                    </div>
                  </button>
                </CustomTooltip>
              </div>

              {/* Profile image and dropdown */}
              <CustomTooltip content={dropdownStatus ? null : "profile"}>
                <div className="px-3">
                  <div
                    ref={profileDropdownRef}
                    onClick={dropdownHandler} // Toggle profile dropdown
                    className="relative w-16 h-16 overflow-hidden rounded-full cursor-pointer group"
                  >
                    <Profileimage />
                  </div>
                  <Dropdown
                    status={dropdownStatus} // Controls visibility
                    changeStatus={setDropDownStatus} // Updates parent state to close
                    options={dropdownOptions} // Options (Settings, Logout)
                    className={"max-md:hidden"}
                  />
                </div>
              </CustomTooltip>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
