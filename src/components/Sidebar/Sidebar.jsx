import React, { useState, useEffect, useRef } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate, useLocation } from "react-router-dom";
import {
  CardLayoutContainer,
  CardLayoutHeader,
} from "../CardLayout/CardLayout";
import { MdEdit } from "react-icons/md";
import { useAdminSidebarLinks } from "../../data/sidebarData";
import { useSelector } from "react-redux";

const Sidebar = ({ status, updateStatus }) => {
  const sidebarRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileView, setMobileView] = useState(false);
  const { adminData } = useSelector((state) => state.auth);
  const sidebarLinks = useAdminSidebarLinks();

  useEffect(() => {
    if (!status) {
      setActiveMenu(null);
    }
    if (activeMenu != null || status) {
      updateStatus(true);
    }
  }, [activeMenu, status]);

  const menuItemHandler = (index, link) => {
    if (link.sublinks && link.sublinks.length > 0) {
      // Toggle the menu regardless of active state
      setActiveMenu((prevIndex) => (prevIndex === index ? null : index));
    } else if (link.path) {
      navigate(link.path);
      if (mobileView) updateStatus(false);
    }
  };

  useEffect(() => {
    let matchedMenu = null;
    let matchedSubmenu = null;

    sidebarLinks.forEach((link, index) => {
      if (`/dashboard/${link.path}` === location.pathname) {
        matchedMenu = index;
      } else if (link.sublinks) {
        const sublinkIndex = link.sublinks.findIndex(
          (sublink) => `/dashboard/${sublink.path}` === location.pathname
        );
        if (sublinkIndex !== -1) {
          matchedMenu = index;
          matchedSubmenu = sublinkIndex;
        }
      }
    });
    setActiveMenu(matchedMenu);
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 780) {
        setMobileView(true);
        updateStatus(false);
      } else {
        setMobileView(false);
        updateStatus(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateStatus]);

  const [profileImage, setProfileImage] = useState(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjUuYcnZ-xqlGZiDZvuUy_iLx3Nj6LSaZSzQ&s"
  );

  const fileInputRef = useRef(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  // Check if a menu item has an active sublink
  const hasActiveSublink = (link) => {
    return link.sublinks?.some(
      (sublink) => `/dashboard/${sublink.path}` === location.pathname
    );
  };

  // Check if menu should be shown as expanded
  const shouldExpandMenu = (index, link) => {
    // Always show if manually opened
    if (activeMenu === index) return true;
    // Show if contains active sublink and not manually closed
    // return hasActiveSublink(link) && activeMenu !== null;
  };

  return (
    <div
      ref={sidebarRef}
      className={`fixed lg:sticky h-screen top-0 bottom-0 z-20 bg-white shadow-md ${mobileView
          ? status
            ? "w-64 h-screen"
            : "w-0 overflow-hidden"
          : status
            ? "w-64"
            : "w-20"
        } flex flex-col justify-between transition-all duration-300 overflow-y-auto`}
    >
      <div className="pt-20">
        {/* Profile Section */}
        <CardLayoutContainer className="relative w-full shadow-none">
          <CardLayoutHeader
            className={`flex ${status ? "flex-row" : "flex-col"
              } items-center justify-center py-4 gap-4`}
            removeBorder={true}
          >
            <div
              className={`relative ${status ? "w-20 h-20" : "w-14 h-14"
                } overflow-hidden rounded-full cursor-pointer group`}
            >
              <img
                src={profileImage}
                alt="profile"
                className="object-cover w-full h-full rounded-full"
              />
              <div
                className="absolute inset-0 flex items-center justify-center transition-opacity bg-black bg-opacity-50 opacity-0 group-hover:opacity-100"
                onClick={() => fileInputRef.current.click()}
              >
                <MdEdit className="text-xl text-white" />
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageChange}
              />
            </div>
            {status && (
              <h3 className="font-semibold text-center text-text">
                {`${adminData?.admin?.full_name}`}
              </h3>
            )}
          </CardLayoutHeader>
        </CardLayoutContainer>

        {/* Navigation Links */}
        <ul className="px-2 py-4 space-y-1">
          {sidebarLinks.map((link, linkIndex) => (
            <div key={linkIndex} className="w-full">
              {/* Main Link */}
              <li
                onClick={() => menuItemHandler(linkIndex, link)}
                className={`flex items-center rounded-lg p-3 cursor-pointer transition-colors ${location.pathname === `/dashboard/${link.path}` ||
                    hasActiveSublink(link)
                    ? "bg-background"
                    : "hover:bg-gray-100 text-gray-700"
                  }`}
              >
                <span className="flex items-center flex-1 gap-3">
                  <span className="text-xl">{link.icon}</span>
                  {status && <span>{link.title}</span>}
                </span>
                {link.sublinks && status && (
                  <IoIosArrowForward
                    className={`text-lg transition-transform duration-200 ${shouldExpandMenu(linkIndex, link)
                        ? "rotate-90"
                        : "rotate-0"
                      }`}
                  />
                )}
              </li>

              {/* Sublinks */}
              {link.sublinks && (
                <div
                  className={`overflow-hidden transition-all duration-300 ${shouldExpandMenu(linkIndex, link) ? "max-h-96" : "max-h-0"
                    }`}
                >
                  <ul className="pl-3 mt-1 space-y-1">
                    {link.sublinks.map((sublink, sublinkIndex) => (
                      <li
                        key={sublinkIndex}
                        onClick={() => {
                          navigate(`/dashboard/${sublink.path}`);
                          if (mobileView) updateStatus(false);
                        }}
                        className={`flex items-center rounded-lg p-3 cursor-pointer transition-colors ${location.pathname === `/dashboard/${sublink.path}`
                            ? "text-primary"
                            : "hover:bg-gray-100 text-gray-700"
                          }`}
                      >
                        <span className="flex items-center gap-3">
                          <span className="text-lg">{sublink.icon}</span>
                          {status && <span>{sublink.title}</span>}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
