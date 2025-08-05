import React, { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardAnalytics } from "../../_core/features/adminSlice";
import { FaUserAlt, FaTachometerAlt, FaClipboardList } from "react-icons/fa";
import dayjs from "dayjs";
import * as Select from "@radix-ui/react-select";

const FILTER_OPTIONS = [
  { label: "All time", value: "all-time" },
  { label: "Past Day", value: "day" },
  { label: "Past Week", value: "week" },
  { label: "Past Month", value: "month" },
  { label: "Past Year", value: "year" },
];

const computeDates = (filter) => {
  if (filter === "all-time") {
    return {
      fromDate: "",
      toDate: "",
    };
  }

  const toDate = dayjs();
  let fromDate;

  switch (filter) {
    case "day":
      fromDate = toDate.subtract(1, "day");
      break;
    case "week":
      fromDate = toDate.subtract(1, "week");
      break;
    case "month":
      fromDate = toDate.subtract(1, "month");
      break;
    case "year":
      fromDate = toDate.subtract(1, "year");
      break;
    default:
      fromDate = toDate;
  }

  return {
    fromDate: fromDate.format("YYYY-MM-DD"),
    toDate: toDate.format("YYYY-MM-DD"),
  };
};

const DashboardCards = () => {
  const dispatch = useDispatch();
  const { adminData } = useSelector((state) => state.persist);
  const { dashboard, isLoadingDashboard } = useSelector((state) => state.admin);
  const [filter, setFilter] = useState("all-time");

  useEffect(() => {
    if (!adminData?.token) return;
    const { fromDate, toDate } = computeDates(filter);
    dispatch(
      getDashboardAnalytics({ token: adminData.token, fromDate, toDate })
    );
  }, [adminData?.token, filter]);

  const cardData = [
    {
      title: "Revenue",
      value: dashboard?.totalRevenue,
      description: "Gross revenue",
      icon: <FaTachometerAlt className="text-3xl text-primary" />,
    },
    {
      title: "Total Bookings",
      value: dashboard?.totalConfirmedBooking,
      description: "Since last month",
      icon: <FaClipboardList className="text-3xl text-primary" />,
    },
    {
      title: "Total Tickets",
      value: dashboard?.totalBookedBooking,
      description: "Since last month",
      icon: <FaClipboardList className="text-3xl text-primary" />,
    },
    {
      title: "Total Refunds",
      value: dashboard?.totalRefundedBooking,
      description: "Processed refunds",
      icon: <FaClipboardList className="text-3xl text-primary" />,
    },
    {
      title: "Registered Users",
      value: dashboard?.totalCompany,
      description: "Active users",
      icon: <FaUserAlt className="text-3xl text-primary" />,
    },
  ];

  return (
    <div className="w-full">
      <div className="flex justify-end mb-4">
        <Select.Root value={filter} onValueChange={setFilter}>
          <Select.Trigger
            className="inline-flex items-center justify-between gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-lg shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Filter"
          >
            <Select.Value placeholder="Select filter" />
            <Select.Icon className="text-gray-500">&#x25BC;</Select.Icon>
            {/* ▼ */}
          </Select.Trigger>

          <Select.Content
            className="z-50 overflow-hidden bg-white border rounded-lg shadow-lg animate-slide-down"
            position="popper"
          >
            <Select.Viewport className="p-1">
              {FILTER_OPTIONS.map((opt) => (
                <Select.Item
                  key={opt.value}
                  value={opt.value}
                  className="px-4 py-2 text-sm text-gray-700 rounded-md cursor-pointer select-none hover:bg-blue-100 focus:bg-blue-100 radix-disabled:opacity-50"
                >
                  <Select.ItemText>{opt.label}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Root>
      </div>

      {isLoadingDashboard ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cardData.map((card, index) => (
            <div
              key={index}
              className="flex items-start p-5 transition duration-300 bg-white shadow-inner rounded-xl hover:shadow-lg"
            >
              <div className="mr-4">{card.icon}</div>
              <div>
                <h3 className="text-sm font-semibold text-gray-600">
                  {card.title}
                </h3>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {card?.value
                    ? Number(String(card.value).slice(0, 7)).toLocaleString()
                    : 0}
                </p>
                <p className="mt-1 text-sm text-gray-500">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardCards;
