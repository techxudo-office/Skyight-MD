import React, { useEffect, useRef, useState } from "react";
import { HiOutlineSpeakerphone } from "react-icons/hi";
import { FiLogOut } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { CreditsDropdown, CustomTooltip, Dropdown } from "../components";
import { HiOutlineRefresh } from "react-icons/hi";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoHome } from "react-icons/io5";
import { SlSettings } from "react-icons/sl";
import { MdNotificationsNone, MdArrowDropDown } from "react-icons/md";
import { motion } from "framer-motion";
import Notifications from "../Notifications/Notifications";
import { getCredits } from "../../_core/features/bookingSlice";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import NotificationDrop from "./NotificationDrop/NotificationDrop";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";

const Header = ({ sidebarStatus, setSidebarStatusHandler }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [dropdownStatus, setDropDownStatus] = useState(false);
  const [CreditsDropdownOpen, setCreditsDropdownOpen] = useState(false);
  const [isNotiHovered, setIsNotiHovered] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const { adminData } = useSelector((state) => state.persist);
  const { credits, isLoadingCredits } = useSelector((state) => state.booking);
  const [profileImage, setProfileImage] = useState(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjUuYcnZ-xqlGZiDZvuUy_iLx3Nj6LSaZSzQ&s"
  );


  const profileDropdownRef = useRef(null);
  const creditsDropdownRef = useRef(null);

  // Click outside handler
  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
  //       setDropDownStatus(false);
  //     }
  //     if (creditsDropdownRef.current && !creditsDropdownRef.current.contains(event.target)) {
  //       setCreditsDropdownOpen(false);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

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

  const mobileDropdownOptions = [
    {
      name: "Home",
      icon: <IoHome />,
      handler: () => {
        navigationHandler("/");
      },
    },
    {
      name: "Notification",
      icon: <MdNotificationsNone />,
      handler: () => {
        navigationHandler("/dashboard/notifications");
      },
    },
    {
      name: "Announcement",
      icon: <HiOutlineSpeakerphone />,
      handler: () => {
        navigationHandler("/dashboard/announcement");
      },
    },
    {
      name: "Setting",
      icon: <SlSettings />,
    },
    {
      name: "Logout",
      icon: <FiLogOut />,
      handler: () => {
        logoutHandler();
      },
    },
  ];

  const refreshCredits = () => {
    dispatch(getCredits(adminData?.token));
  };


  const dropdownHandler = () => {
    setDropDownStatus(!dropdownStatus);
  };

  const logoutHandler = () => {
    dispatch({ type: "user/logout" });
    localStorage.removeItem("auth_token");
    toast.success("Logout successfully")
    dropdownHandler();
  };

  const navigationHandler = (path) => {
    dropdownHandler();
    navigate(`/dashboard${path}`);
  };

  const sidebarHandler = () => {
    setSidebarStatusHandler(!sidebarStatus);
  };
  useEffect(() => {
    if (location.pathname === "/dashboard/notifications") {
      setIsNotiHovered(false);
    }
  }, [location.pathname]);

  return (
    <>

      <nav className="w-full fixed z-[999] bg-white shadow-md border-b-[1px] border-grayBg ">
        <div className="px-2 mx-auto">
          <div className="flex items-center justify-between p-2 sm:p-4">
            <div className="flex items-end gap-3">
              <CustomTooltip content={"Open / close"}>
                <button
                  className="text-gray-700 transition hover:text-gray-900"
                  onClick={sidebarHandler}
                >
                  <GiHamburgerMenu size={22} />
                </button>
              </CustomTooltip>
              <div className="flex items-center "></div>
            </div>
            <div className="flex items-center sm:gap-3">
              {location.pathname !== "/dashboard/notifications" && (
                <div
                  className="relative py-2"
                  onMouseEnter={() => setIsNotiHovered(true)}
                  onMouseLeave={() => setIsNotiHovered(false)}
                >
                  <CustomTooltip content={"Notifications"}>
                    <div
                      className="max-md:hidden px-7"
                      onClick={() => navigate("/dashboard/notifications")}
                    >
                      <MdNotificationsNone className="text-2xl cursor-pointer text-text" />
                    </div>
                  </CustomTooltip>

                  {isNotiHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="absolute top-10 right-0 w-[300px] h-fit  bg-neutral-100 shadow-lg rounded-lg p-2 z-50"
                    >
                      <NotificationDrop />
                    </motion.div>
                  )}
                </div>
              )}
              <div className="relative">
                <CustomTooltip content={CreditsDropdownOpen ? null : "credits"}>
                  <button
                    ref={creditsDropdownRef}
                    className={`w-full text-sm md:text-base relative flex items-center justify-center gap-1 md:gap-2 cursor-pointer p-1 px-2 md:py-2 md:px-4 border-primary border-[1px]  bg-background hover:text-secondary  text-primary font-semibold rounded-xl transition duration-300 ease-in-out transform focus:outline-none`}
                  >
                    {showCredits && <HiOutlineRefresh onClick={refreshCredits} className={`${isLoadingCredits && "animate-spin"} max-sm:hidden`} />}
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
                      )) : (
                      <p className="text-xs flex items-center"><GoDotFill /><GoDotFill /><GoDotFill /><GoDotFill /><GoDotFill /><GoDotFill /></p>
                    )
                    }
                    {showCredits ?
                      <CustomTooltip content={"Hide Credits"}>
                        <FaEye onClick={() => setShowCredits(false)} />
                      </CustomTooltip> :
                      <CustomTooltip content={"Show Credits"}>
                        <FaEyeSlash onClick={() => {
                          refreshCredits();
                          setShowCredits(true)
                        }} />
                      </CustomTooltip>
                    }
                    {/* <MdArrowDropDown
                      className={`text-xl ${CreditsDropdownOpen ? "rotate-180" : ""
                        } transition-all duration-300`}
                      onClick={() => setCreditsDropdownOpen((prev) => !prev)}
                    /> */}
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
              <CustomTooltip content={dropdownStatus ? null : "profile"}>
                <div className="px-3">
                  <div
                    ref={profileDropdownRef}
                    onClick={dropdownHandler}
                    className="relative w-16 h-16 overflow-hidden rounded-full cursor-pointer group"
                  >
                    <img
                      src={profileImage}
                      alt="profile-img"
                      className="object-cover w-full h-full rounded-full"
                    />
                  </div>
                  <Dropdown
                    status={dropdownStatus}
                    changeStatus={setDropDownStatus}
                    options={dropdownOptions}
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
