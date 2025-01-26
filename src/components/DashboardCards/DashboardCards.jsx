import React, { useEffect, useState } from "react";
import {
  FaChartLine,
  FaUserAlt,
  FaTachometerAlt,
  FaClipboardList,
} from "react-icons/fa";

import video from "../../assets/videos/video.mp4";

const DashboardCards = () => {

  return (
    <>
      <div className="w-full p-5">
        <h2 className="text-3xl font-semibold text-text mb-7">Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-3 rounded-xl shadow-sm border-t-4 border-blue-500 hover:shadow-md transition-all duration-300">
            <div className="flex items-center space-x-4">
              <FaChartLine className="text-3xl text-blue-500" />
              <div>
                <h3 className="text-md font-semibold text-gray-700">
                  Total Sales
                </h3>
                <p className="text-2xl font-bold text-gray-900 mt-2">$12,345</p>
                <div className="mt-2 text-sm text-gray-600">
                  <p>Since last month</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-3 rounded-xl shadow-sm border-t-4 border-blue-500 hover:shadow-md transition-all duration-300">
            <div className="flex items-center space-x-4">
              <FaUserAlt className="text-3xl text-blue-500" />
              <div>
                <h3 className="textmdlg font-semibold text-gray-700">
                  Total Users
                </h3>
                <p className="text-2xl font-bold text-gray-900 mt-2">2,345</p>
                <div className="mt-2 text-sm text-gray-600">
                  <p>Active users</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-3 rounded-xl shadow-sm border-t-4 border-blue-500 hover:shadow-md transition-all duration-300">
            <div className="flex items-center space-x-4">
              <FaTachometerAlt className="text-3xl text-blue-500" />
              <div>
                <h3 className="text-lg mdt-semibold text-gray-700">
                  Performance
                </h3>
                <p className="text-2xl font-bold text-gray-900 mt-2">85%</p>
                <div className="mt-2 text-sm text-gray-600">
                  <p>Overall performance</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-3 rounded-xl shadow-sm border-t-4 border-blue-500 hover:shadow-md transition-all duration-300">
            <div className="flex items-center space-x-4">
              <FaClipboardList className="text-3xl text-blue-500" />
              <div>
                <h3 className="text-lg mdt-semibold text-gray-700">Tasks</h3>
                <p className="text-2xl font-bold text-gray-900 mt-2">15</p>
                <div className="mt-2 text-sm text-gray-600">
                  <p>Pending tasks</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardCards;
