import React, { useState, useEffect } from "react";
import { RiDashboardFill } from "react-icons/ri";
import { FaDotCircle } from "react-icons/fa";

import { useNavigate, useLocation } from "react-router-dom";
import { sidebarLinks } from "../../data/sidebarData";

const Sidebar = ({ status }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [itemIndex, setItemIndex] = useState(0);

  const navigationHandler = (path) => {
    navigate(`/dashboard${path}`);
  };

  useEffect(() => {
    const currentPath = location.pathname.replace("/dashboard", "") || "/";
    const activeIndex = sidebarLinks.findIndex(
      (link) => link.path === currentPath
    );
    setItemIndex(activeIndex);
  }, [location.pathname]);

  return (
    <div
      className={`shadow-md transition-all ${
        status ? "w-64" : "w-0"
      } flex flex-col justify-between bg-primary`}
    >
      <div>
        <div className="p-5 flex items-center justify-start">
          <h3 className="text-2xl font-semibold flex items-center gap-3 text-white">
            <RiDashboardFill />
            Skyight
          </h3>
        </div>
        <div className="p-5 px-3 flex items-center justify-center">
          <ul className="w-full flex flex-col items-start justify-center">
            {sidebarLinks.map((link, index) => (
              <li
                key={index}
                onClick={() => navigationHandler(link.path)}
                className={`mb-3 w-full flex items-center justify-start gap-2 p-2 cursor-pointer transition-all hover:bg-secondary ${
                  itemIndex === index
                    ? "text-white bg-secondary"
                    : " text-white"
                } rounded-full px-3 text-md font-semibold flex justify-between items-center`}
              >
                <span className="flex items-center gap-3">
                  {link.icon}
                  {link.title}
                </span>
                <span>
                  <FaDotCircle
                    className={`text-xs transition-all ${
                      itemIndex === index ? "text-slate-300" : "text-white"
                    }`}
                  />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
