import { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import * as Select from "@radix-ui/react-select";
import { useDispatch, useSelector } from "react-redux";
import { computeDates, FILTER_OPTIONS } from "../../utils/helper";
import { getDashboardAnalytics } from "../../_core/features/adminSlice";
import { FaUserAlt, FaClipboardList, FaMoneyBillWave, FaWallet, FaPercentage } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const DashboardCards = () => {
  const navigate = useNavigate();
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
      title: "Total Revenue",
      path: "/dashboard",
      value: dashboard?.totalCredits,
      description: "Total credits issued",
      icon: <FaMoneyBillWave className="text-3xl text-primary" />,
    },
    {
      title: "Remaining Credits",
      path: "/dashboard",
      value: dashboard?.remainingCredits,
      description: "Remaining credits",
      icon: <FaWallet className="text-3xl text-primary" />,
    },
    {
      title: "Booking Commission",
      path: "/dashboard",
      value: dashboard?.booking_revenue,
      description: "Booking commission",
      icon: <FaPercentage className="text-3xl text-primary" />,
    },
    {
      title: "Total Bookings",
      path: "/dashboard/flight-bookings",
      value: dashboard?.totalConfirmedBooking,
      description: "Since last month",
      icon: <FaClipboardList className="text-3xl text-primary" />,
    },
    {
      title: "Total Tickets",
      path: "/dashboard/tickets",
      value: dashboard?.totalBookedBooking,
      description: "Since last month",
      icon: <FaClipboardList className="text-3xl text-primary" />,
    },
    {
      title: "Total Refunds",
      path: "/dashboard/refund-requests",
      value: dashboard?.totalRefundedBooking,
      description: "Processed refunds",
      icon: <FaClipboardList className="text-3xl text-primary" />,
    },
    {
      title: "Registered Users",
      path: "/dashboard/companies",
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
              onClick={() => navigate(card.path)}
              className="flex items-start p-5 transition duration-300 bg-white shadow-inner cursor-pointer rounded-xl hover:shadow-lg"
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
