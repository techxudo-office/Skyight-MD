import React from "react";
import {
  FaChartLine,
  FaUserAlt,
  FaTachometerAlt,
  FaClipboardList,
} from "react-icons/fa";

const cardData = [
  {
    title: "Total Bookings",
    value: "1,234",
    description: "Since last month",
    icon: <FaClipboardList className="text-3xl text-primary" />,
  },
  {
    title: "Total Refunds",
    value: "432",
    description: "Processed refunds",
    icon: <FaChartLine className="text-3xl text-primary" />,
  },
  {
    title: "Revenue",
    value: "$25,678",
    description: "Gross revenue",
    icon: <FaTachometerAlt className="text-3xl text-primary" />,
  },
  {
    title: "P / L",
    value: "$8,345",
    description: "Profit / Loss",
    icon: <FaChartLine className="text-3xl text-primary" />,
  },
  {
    title: "Registered Users",
    value: "3,210",
    description: "Active users",
    icon: <FaUserAlt className="text-3xl text-primary" />,
  },
];

const DashboardCards = () => {
  return (
    <div className="w-full p-5">
      <h2 className="text-3xl font-semibold text-text mb-7">Dashboard</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-5">
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
                  {card.value}
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
