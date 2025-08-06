import { useState, useEffect, useRef } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate, useLocation } from "react-router-dom";
import {
  CardLayoutContainer,
  CardLayoutHeader,
} from "../CardLayout/CardLayout";
import { useAdminSidebarLinks } from "../../data/sidebarData";
import { useSelector } from "react-redux";
import Profileimage from "../ProfileImage/Profileimage";

const Sidebar = ({ status, updateStatus }) => {
  const sidebarRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState(null); // Index of currently expanded parent menu
  const [mobileView, setMobileView] = useState(window.innerWidth < 1024);
  const { adminData } = useSelector((state) => state.persist);
  const sidebarLinks = useAdminSidebarLinks(); // Array of link objects, each may have `sublinks`

  useEffect(() => {
    if (!status) {
      // If sidebar is closed, collapse any open submenu
      setActiveMenu(null);
    }
    if (activeMenu != null || status) {
      // If any menu is open OR sidebar is open, ensure `status` remains true
      updateStatus(true);
    }
  }, [activeMenu, status]);

  const menuItemHandler = (index, link) => {
    if (link.sublinks && link.sublinks.length > 0) {
      // If this parent link has sublinks, toggle it open/closed
      setActiveMenu((prevIndex) => (prevIndex === index ? null : index));
    } else if (link.path) {
      // If no sublinks, simply navigate to the path
      navigate(link.path);
      if (mobileView) updateStatus(false); // In mobile view, collapse sidebar after navigation
    }
  };

  useEffect(() => {
    // On URL change, auto-expand the menu containing the current route
    let matchedMenu = null;
    let matchedSubmenu = null;

    sidebarLinks.forEach((link, index) => {
      if (`/dashboard/${link.path}` === location.pathname) {
        matchedMenu = index; // Exact match on top-level link
      } else if (link.sublinks) {
        const sublinkIndex = link.sublinks.findIndex(
          (sublink) => `/dashboard/${sublink.path}` === location.pathname
        );
        if (sublinkIndex !== -1) {
          matchedMenu = index; // Parent index for the active sublink
          matchedSubmenu = sublinkIndex;
        }
      }
    });
    setActiveMenu(matchedMenu); // Expand only the menu containing current route
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        // If viewport is small, switch to mobile mode
        setMobileView(true);
        updateStatus(false); // Collapse sidebar by default in mobile
      } else {
        // Desktop mode
        setMobileView(false);
        updateStatus(true); // Always show sidebar on desktop
      }
    };

    handleResize(); // Initialize on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateStatus]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Creates a temporary URL for preview, but currently unused
      const imageUrl = URL.createObjectURL(file);
    }
  };

  // Returns true if any sublink’s path matches the current URL
  const hasActiveSublink = (link) => {
    return link.sublinks?.some(
      (sublink) => `/dashboard/${sublink.path}` === location.pathname
    );
  };

  // Determines whether the parent menu should be expanded
  const shouldExpandMenu = (index, link) => {
    if (activeMenu === index) return true; // Manually opened by click
    // Could also auto-open if a sublink is active; commented out because handled in useEffect
    // return hasActiveSublink(link) && activeMenu !== null;
  };

  return (
    <div
      ref={sidebarRef}
      // className={`fixed lg:sticky h-screen top-0 bottom-0 z-20 bg-white shadow-md ${mobileView
      //     ? status
      //       ? "w-64 h-screen" // Mobile: expanded width when `status` is true
      //       : "w-0 overflow-hidden" // Mobile: hidden when `status` is false
      //     : status
      //       ? "w-64" // Desktop: expanded width
      //       : "w-20" // Desktop: collapsed width
      //   } flex flex-col justify-between transition-all duration-300 overflow-y-auto`}
      className={`transition-all ${mobileView ? "fixed" : "relative"
        }  z-[990]  bg-white shadow-md  ${!mobileView
          ? status
            ? "w-1/5"
            : "w-24 items-center "
          : status
            ? "w-60 translate-x-0 shadow-md fixed left-0 top-0 h-screen "
            : " -translate-x-full fixed"
        } flex flex-col justify-between transition-all duration-300 overflow-y-auto overflow-x-visible`}
    >
      <div className="pt-16">
        {/* Profile Section */}
        <CardLayoutContainer className="relative w-full shadow-none">
          <CardLayoutHeader
            className={`flex flex-col items-center justify-center`}
            removeBorder={true}
          >
            <div
              className={`relative ${status ? "max-w-20 h-20" : "max-w-14 h-14"
                } overflow-hidden rounded-full cursor-pointer group`}
            >
              <Profileimage />
            </div>
            {status && (
              <>
                {/* Only show name and role when sidebar is expanded */}
                <h3 className="mt-2 font-semibold text-center text-text">
                  {`${adminData?.admin?.full_name}`}
                </h3>
                <h3 className="text-center text-text">
                  {`${adminData?.admin?.role?.role}`}
                </h3>
              </>
            )}
          </CardLayoutHeader>
        </CardLayoutContainer>

        {/* Navigation Links */}
        <ul className="px-2 py-4 space-y-1">
          {sidebarLinks.map((link, linkIndex) => (
            <div key={linkIndex} className="w-full">
              {/* Main Link (parent) */}
              <li
                onClick={() => menuItemHandler(linkIndex, link)}
                className={`flex items-center rounded-lg p-3 cursor-pointer transition-colors ${
                  // Highlight if exactly on this link’s route or any of its sublink routes
                  location.pathname === `/dashboard/${link.path}` ||
                    hasActiveSublink(link)
                    ? "bg-background"
                    : "hover:bg-gray-100 text-gray-700"
                  }`}
              >
                <span className={`flex items-center ${!status && "justify-center"} flex-1 gap-3`}>
                  <span className="text-xl">{link.icon}</span>
                  {status && <span>{link.title}</span>}
                </span>
                {link.sublinks && status && (
                  <IoIosArrowForward
                    className={`text-lg transition-transform duration-200 ${shouldExpandMenu(linkIndex, link)
                      ? "rotate-90" // Rotate arrow when expanded
                      : "rotate-0" // Default arrow orientation
                      }`}
                  />
                )}
              </li>

              {/* Sublinks (only rendered if this link has sublinks) */}
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
                          if (mobileView) updateStatus(false); // Collapse on mobile
                        }}
                        className={`flex items-center rounded-lg p-3 cursor-pointer transition-colors ${
                          // Highlight active sublink
                          location.pathname === `/dashboard/${sublink.path}`
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
