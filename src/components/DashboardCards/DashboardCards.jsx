import React, { useEffect } from "react";
import {
  FaChartLine,
  FaUserAlt,
  FaTachometerAlt,
  FaClipboardList,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardAnalytics } from "../../_core/features/adminSlice";

const DashboardCards = () => {
  const dispatch = useDispatch();
  const { adminData } = useSelector((state) => state.auth);
  const { dashboard, isLoadingDashboard } = useSelector((state) => state.admin);

  useEffect(() => {
    if (!adminData.token) return;
    dispatch(getDashboardAnalytics(adminData.token));
  }, [dispatch]);

  const cardData = [
    {
      title: "Total Bookings",
      value: dashboard?.totalBookedBooking,
      description: "Since last month",
      icon: <FaClipboardList className="text-3xl text-primary" />,
    },
    {
      title: "Total Refunds",
      value: dashboard?.totalRefundedBooking,
      description: "Processed refunds",
      icon: <FaChartLine className="text-3xl text-primary" />,
    },
    {
      title: "Registered Users",
      value: dashboard?.totalCompany,
      description: "Active users",
      icon: <FaUserAlt className="text-3xl text-primary" />,
    },
    {
      title: "Revenue",
      value: dashboard?.totalRevenue,
      description: "Gross revenue",
      icon: <FaTachometerAlt className="text-3xl text-primary" />,
    },
    {
      title: "P / L",
      value: dashboard?.totalRevenue,
      description: "Profit / Loss",
      icon: <FaChartLine className="text-3xl text-primary" />,
    },
  ];
  return (
    <div className="w-full p-5">
      <h2 className="text-3xl font-semibold text-text mb-7">Dashboard</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cardData.map((card, index) => (
          <div
            key={index}
            className="p-3 transition-all duration-300 bg-white border-t-4 shadow-sm border-primary rounded-xl hover:shadow-md"
          >
            <div className="flex items-center space-x-4">
              {card.icon}
              <div>
                <h3 className="font-semibold text-gray-700 text-md">
                  {card.title}
                </h3>
                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {card.value.toLocaleString()}
                </p>
                <div className="mt-2 text-sm text-gray-600">
                  <p>{card.description}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardCards;
