import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import { FaCircleUser } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "../components";

const Header = ({ sidebarStatus, setSidebarStatusHandler }) => {
  const navigate = useNavigate();

  const [dropdownStatus, setDropDownStatus] = useState(false);

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
      name: "Setting",
      icon: <IoIosSettings />,
      handler: () => {
        navigationHandler("/setting");
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
      <div className="flex items-center justify-between p-3 bg-white shadow-sm">
        <HiOutlineMenuAlt1
          className={`text-3xl cursor-pointer hover:text-text ${
            sidebarStatus ? "text-slate-400" : "text-primary"
          }`}
          onClick={sidebarHandler}
        />
        <div className="px-3">
          <FaCircleUser
            onClick={dropdownHandler}
            className="text-4xl transition-all cursor-pointer text-slate-300 hover:text-slate-400"
          />
          <Dropdown
            status={dropdownStatus}
            changeStatus={setDropDownStatus}
            options={dropdownOptions}
          />
        </div>
      </div>
    </>
  );
};

export default Header;
