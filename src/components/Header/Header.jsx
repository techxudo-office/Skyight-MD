import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { HiOutlineSpeakerphone } from "react-icons/hi";
import { FaUser, FaUserCircle } from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { CreditsDropdown, CustomTooltip, Dropdown } from "../components";
import { HiOutlineRefresh } from "react-icons/hi";
// import { skyightLogo } from "../../assets/Index";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoHome } from "react-icons/io5";
import { SlSettings } from "react-icons/sl";
import {
  MdNotificationsNone,
  MdArrowDropDown,
  MdSettings,
} from "react-icons/md";
import { motion } from "framer-motion";
import Notifications from "../Notifications/Notifications";
import Announcement from "../Announcement/Announcement";

const Header = ({ sidebarStatus, setSidebarStatusHandler }) => {
  const navigate = useNavigate();
  const [dropdownStatus, setDropDownStatus] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [credits, setCredits] = useState("");
  const [CreditsDropdownOpen, setCreditsDropdownOpen] = useState(false);
  const [isAnnHovered, setIsAnnHovered] = useState(false);
  const [isNotiHovered, setIsNotiHovered] = useState(false);

  const dropdownHandler = () => {
    setDropDownStatus(!dropdownStatus);
  };

  const dropdownOptions = [
    {
      name: "Profile",
      icon: <FaUser />,
      handler: () => {
        navigationHandler("/profile");
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
  
  const logoutHandler = () => {
    dropdownHandler();
    localStorage.removeItem("auth_token");
    toast.success("Logout Successfully");
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  const navigationHandler = (path) => {
    dropdownHandler();
    navigate(`/dashboard${path}`);
  };

  const sidebarHandler = () => {
    setSidebarStatusHandler(!sidebarStatus);
  };

  return (
    <>
      <Toaster />
      <nav className="w-full fixed z-[999] bg-white shadow-md border-b-[1px] border-grayBg ">
        <div className="px-2 mx-auto">
          <div className="flex items-center justify-between p-2 sm:p-4">
            {" "}
            <div className="flex items-end gap-3">
              <CustomTooltip content={"Open / close"}>
                <button
                  className="text-gray-700 transition hover:text-gray-900"
                  onClick={sidebarHandler}
                >
                  <GiHamburgerMenu size={22} />{" "}
                </button>
              </CustomTooltip>

              <div className="flex items-center ">
                {/* <img
                  src={skyightLogo}
                  className="w-16 translate-x-3 md:w-24"
                  alt=""
                /> */}
              </div>
            </div>
            <div className="flex items-center sm:gap-3">
              {/* <div
                className="relative py-2"
                onMouseEnter={() => setIsAnnHovered(true)}
                onMouseLeave={() => setIsAnnHovered(false)}
              >
                {" "}
                <CustomTooltip content={"Announcement"}>
                  <div className="max-md:hidden">
                    <HiOutlineSpeakerphone className="text-2xl cursor-pointer text-text" />
                  </div>
                </CustomTooltip>
                {isAnnHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="absolute top-10 right-0 w-[300px] bg-white shadow-lg rounded-lg p-3 z-50"
                  >
                    <Announcement />
                  </motion.div>
                )}
              </div> */}
              <div
                className="relative py-2"
                onMouseEnter={() => setIsNotiHovered(true)}
                onMouseLeave={() => setIsNotiHovered(false)}
              >
                <CustomTooltip content={"Notifications"}>
                  <div className="max-md:hidden">
                    <MdNotificationsNone className="text-2xl cursor-pointer text-text" />
                  </div>
                </CustomTooltip>

                {isNotiHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="absolute top-10 right-0 w-[500px] bg-white shadow-lg rounded-lg p-3 z-50"
                  >
                    <Notifications />
                  </motion.div>
                )}
              </div>
              <CustomTooltip content={"Settings"}>
                <div className="max-md:hidden">
                  <MdSettings className="text-2xl cursor-pointer text-text" />{" "}
                </div>
              </CustomTooltip>
              <div className="relative">
                <CustomTooltip content={"credits"}>
                  <button
                    className={`w-full text-sm md:text-base relative flex items-center justify-center gap-1 md:gap-2 cursor-pointer p-1 px-2 md:py-2 md:px-4 border-primary border-[1px]  bg-blue-100 hover:text-secondary  text-primary font-semibold rounded-xl transition duration-300 ease-in-out transform focus:outline-none`}
                    // onClick={() => {
                    //   setIsActive(!isActive);
                    // }}
                  >
                    {credits ? (
                      <span
                        onClick={refreshCredits}
                        className="flex items-center gap-2"
                      >
                        <HiOutlineRefresh className="max-sm:hidden" />
                        <span>PKR {credits?.toLocaleString("en-US")}</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <HiOutlineRefresh
                          className={`transition-all max-sm:hidden ${
                            !credits ? "rotate-180" : "rotate-0"
                          }`}
                        />
                        <span>Refreshing...</span>
                      </span>
                    )}

                    <MdArrowDropDown
                      className={`text-xl ${
                        CreditsDropdownOpen ? "rotate-180" : ""
                      } transition-all duration-300`}
                      onClick={() => setCreditsDropdownOpen((prev) => !prev)}
                    />
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
              <CustomTooltip content={"profile"}>
                <div className="px-3">
                  {/* <FaUserCircle
                    onClick={dropdownHandler}
                    className="text-4xl transition-all cursor-pointer text-primary hover:text-secondary"
                  /> */}
                  <FaUserCircle
                    onClick={dropdownHandler}
                    className="text-4xl transition-all cursor-pointer text-text"
                  />
                  <Dropdown
                    status={dropdownStatus}
                    changeStatus={setDropDownStatus}
                    options={dropdownOptions}
                    className={"max-md:hidden"}
                  />
                  {/* <Dropdown
                    status={dropdownStatus}
                    changeStatus={setDropDownStatus}
                    options={mobileDropdownOptions}
                    className={"md:hidden"}
                  /> */}
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
