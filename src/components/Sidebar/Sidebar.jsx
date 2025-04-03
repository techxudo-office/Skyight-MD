// import React, { useState, useEffect } from "react";
// import { RiDashboardFill } from "react-icons/ri";
// import { FaDotCircle } from "react-icons/fa";

// import { useNavigate, useLocation } from "react-router-dom";
// import { sidebarLinks } from "../../data/sidebarData";

// const Sidebar = ({ status }) => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [itemIndex, setItemIndex] = useState(0);

//   const navigationHandler = (path) => {
//     navigate(`/dashboard${path}`);
//   };

//   useEffect(() => {
//     const currentPath = location.pathname.replace("/dashboard", "") || "/";
//     const activeIndex = sidebarLinks.findIndex(
//       (link) => link.path === currentPath
//     );
//     setItemIndex(activeIndex);
//   }, [location.pathname]);

//   return (
//     <div
//       className={`shadow-md transition-all ${status ? "w-64" : "w-0"
//         } flex flex-col justify-between z-[999] bg-primary h-screen fixed xl:sticky top-0 overflow-y-auto `}>
//       <div>
//         <div className="flex items-center justify-start p-5">
//           <h3 className="flex items-center gap-3 text-2xl font-semibold text-white">
//             <RiDashboardFill />
//             Skyight
//           </h3>
//         </div>
//         <div className="flex items-center justify-center p-5 px-3">
//           <ul className="flex flex-col items-start justify-center w-full">
//             {sidebarLinks.map((link, index) => (
//               <li
//                 key={index}
//                 onClick={() => navigationHandler(link.path)}
//                 className={`mb-3 w-full flex items-center justify-start gap-2 p-2 cursor-pointer transition-all hover:bg-secondary ${itemIndex === index
//                   ? "text-white bg-secondary"
//                   : " text-white"
//                   } rounded-full px-3 text-md font-semibold flex justify-between items-center`}>
//                 <span className="flex items-center gap-3">
//                   {link.icon}
//                   {link.title}
//                 </span>
//                 <span>
//                   <FaDotCircle
//                     className={`text-xs transition-all ${itemIndex === index ? "text-slate-300" : "text-white"
//                       }`}
//                   />
//                 </span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;


import React, { useState, useEffect, useRef } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate, useLocation } from "react-router-dom";
import {
  CardLayoutContainer,
  CardLayoutHeader,
} from "../CardLayout/CardLayout";
import { MdEdit } from "react-icons/md";
import { useSidebarLinks } from "../../data/sidebarData";
// import { Backbutton } from "../components";
import { useSelector } from "react-redux";

const Sidebar = ({ status, updateStatus }) => {
  const sidebarRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarLinks = useSidebarLinks();
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileView, setMobileView] = useState(false);
  const { userData } = useSelector((state) => state.auth);

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
      setActiveMenu((prevIndex) => (prevIndex === index ? null : index));
    } else if (link.path) {
      navigate(link.path);
    }
  };

  useEffect(() => {
    let matchedMenu = null;
    let matchedSubmenu = null;

    sidebarLinks.forEach((link, index) => {
      if (link.path === location.pathname) {
        matchedMenu = index;
      } else if (link.sublinks) {
        const sublinkIndex = link.sublinks.findIndex(
          (sublink) => sublink.path === location.pathname
        );
        if (sublinkIndex !== -1) {
          matchedMenu = index;
          matchedSubmenu = sublinkIndex;
        }
      }
    });
    setActiveMenu(matchedMenu);
    if (mobileView) {
      updateStatus(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        updateStatus(false);
        setMobileView(true);
      } else {
        updateStatus(true);
        setMobileView(false);
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

  return (
    <div
      id="sidebar-container"
      ref={sidebarRef}
      className={`transition-all z-20  bg-white    shadow-md ${
        !mobileView
          ? status
            ? "w-1/5 pt-20 "
            : "w-28  items-center pt-20"
          : status
          ? "w-60 shadow-md fixed left-0 h-screen pt-20"
          : "w-0 p-0"
      } flex flex-col justify-between  transition-all duration-300 overflow-y-auto overflow-x-visible`}
    >
      <div>
        <CardLayoutContainer className="relative w-full shadow-none">
          {/* <Backbutton
            className={"absolute z-[99] right-0 top-0"}
            status={status}
          /> */}
          <CardLayoutHeader
            className="flex flex-col flex-wrap items-center justify-start py-3 gap-x-5"
            removeBorder={true}
          >
            <div
              className={`relative ${
                !mobileView ? (status ? "w-24 h-24" : "w-16 h-16") : "w-20 h-20"
              } overflow-hidden rounded-full cursor-pointer group`}
            >
              <img
                src={profileImage}
                alt="profile-img"
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
                accept="image/png, image/jpeg, image/jpg"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageChange}
              />
            </div>
            <div>
              <h3
                className={`font-semibold text-text ${
                  !mobileView ? (status ? "text-lg" : "text-sm") : ""
                }`}
              >
                {`${userData?.user?.first_name} ${userData?.user?.last_name}`}
              </h3>
            </div>
          </CardLayoutHeader>
        </CardLayoutContainer>
        <div className="px-3">
          <ul className="flex flex-col items-center ">
            {sidebarLinks.map((link, linkIndex) => (
              <div
                key={linkIndex}
                className={`flex flex-col    ${
                  status ? "w-full" : "items-center"
                }`}
              >
                <li
                  onClick={() => menuItemHandler(linkIndex, link)}
                  className={`mb-2 flex items-center  gap-4 ${
                    status ? "px-4" : ""
                  }  py-4 cursor-pointer transition-all hover:text-primary hover:bg-background text-text rounded-full   text-base `}
                >
                  {link.sublinks && status && (
                    <IoIosArrowForward
                      className={`text-xl transition-transform duration-300 ${
                        activeMenu === linkIndex ? "-rotate-90" : "rotate-90"
                      }`}
                    />
                  )}
                  <span
                    className={`flex ${
                      status ? "flex-row" : "flex-col"
                    } font-semibold  items-center gap-3`}
                  >
                    {link.title == "Dashboard" && status ? (
                      <span className="text-2xl">{link.icon}</span>
                    ) : (
                      ""
                    )}
                    <span className={`${status ? "hidden" : "text-3xl"}`}>
                      {link.icon}
                    </span>
                    <span className={`${status ? "text-base" : "text-sm"}`}>
                      {link.title}
                    </span>
                  </span>
                </li>

                {link.sublinks &&
                  link.sublinks.map((sublink, sublinkIndex) => (
                    <li
                      key={sublinkIndex}
                      onClick={() => navigate(sublink.path)}
                      className={`  w-full flex items-center gap-4 ${
                        status ? "px-3" : ""
                      } cursor-pointer transition-all  ${
                        activeMenu === linkIndex && link.sublinks
                          ? "h-auto py-4 "
                          : "h-0 overflow-hidden "
                      } text-text rounded-full text-base  transition-all duration-300 hover:text-primary`}
                    >
                      <span className="text-3xl">{sublink.icon}</span>
                      {sublink.title}
                    </li>
                  ))}
              </div>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
