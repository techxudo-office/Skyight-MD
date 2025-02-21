import React, { useEffect, useState } from "react";
import {
  FaChartLine,
  FaUserAlt,
  FaTachometerAlt,
  FaClipboardList,
} from "react-icons/fa";

const DashboardCards = () => {

  return (
    <>
      <div className="w-full p-5">
        <h2 className="text-3xl font-semibold text-text mb-7">Dashboard</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="p-3 transition-all duration-300 bg-white border-t-4 border-blue-500 shadow-sm rounded-xl hover:shadow-md">
            <div className="flex items-center space-x-4">
              <FaChartLine className="text-3xl text-blue-500" />
              <div>
                <h3 className="font-semibold text-gray-700 text-md">
                  Total Sales
                </h3>
                <p className="mt-2 text-2xl font-bold text-gray-900">$12,345</p>
                <div className="mt-2 text-sm text-gray-600">
                  <p>Since last month</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 transition-all duration-300 bg-white border-t-4 border-blue-500 shadow-sm rounded-xl hover:shadow-md">
            <div className="flex items-center space-x-4">
              <FaUserAlt className="text-3xl text-blue-500" />
              <div>
                <h3 className="font-semibold text-gray-700 textmdlg">
                  Total Users
                </h3>
                <p className="mt-2 text-2xl font-bold text-gray-900">2,345</p>
                <div className="mt-2 text-sm text-gray-600">
                  <p>Active users</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 transition-all duration-300 bg-white border-t-4 border-blue-500 shadow-sm rounded-xl hover:shadow-md">
            <div className="flex items-center space-x-4">
              <FaTachometerAlt className="text-3xl text-blue-500" />
              <div>
                <h3 className="text-lg text-gray-700 mdt-semibold">
                  Performance
                </h3>
                <p className="mt-2 text-2xl font-bold text-gray-900">85%</p>
                <div className="mt-2 text-sm text-gray-600">
                  <p>Overall performance</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 transition-all duration-300 bg-white border-t-4 border-blue-500 shadow-sm rounded-xl hover:shadow-md">
            <div className="flex items-center space-x-4">
              <FaClipboardList className="text-3xl text-blue-500" />
              <div>
                <h3 className="text-lg text-gray-700 mdt-semibold">Tasks</h3>
                <p className="mt-2 text-2xl font-bold text-gray-900">15</p>
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
