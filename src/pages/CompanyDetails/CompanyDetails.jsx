import { useEffect, useState } from "react";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
} from "../../components/CardLayout/CardLayout";
import {
  FaEye,
  FaUserAlt,
  FaClipboardList,
  FaTicketAlt,
  FaExchangeAlt,
  FaUndoAlt,
  FaTimesCircle,
} from "react-icons/fa";
import * as Select from "@radix-ui/react-select";
import Loader from "../../components/Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { computeDates, FILTER_OPTIONS } from "../../utils/helper";
import {
  getCompanyAnalytics,
  getCompanyRevenue,
} from "../../_core/features/companySlice";

const CompanyDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { companyId } = useParams();
  const [filter, setFilter] = useState("all-time");
  const { adminData } = useSelector((state) => state.persist);
  const { companyRevenue, companyAnalytics, isLoadingCompanyRevenue } =
    useSelector((state) => state.company);

  useEffect(() => {
    if (!adminData?.token) return;
    const { fromDate, toDate } = computeDates(filter);
    dispatch(
      getCompanyAnalytics({
        token: adminData.token,
        companyId,
        fromDate,
        toDate,
      })
    );
    dispatch(getCompanyRevenue({ token: adminData?.token, id: companyId }));
  }, [adminData?.token, filter, companyId, dispatch]);

  // Define different subsections within the company dashboard (each has an icon component)
  const companySections = [
    {
      title: "Users",
      path: "users",
      value: companyAnalytics?.totalUser ?? 0,
      icon: FaUserAlt,
    },
    {
      title: "Bookings",
      path: "bookings",
      value: companyAnalytics?.totalBooking ?? 0,
      icon: FaClipboardList,
    },
    {
      title: "Tickets",
      path: "tickets",
      value: companyAnalytics?.totalBookedBookingTickets ?? 0,
      icon: FaTicketAlt,
    },
    {
      title: "Transactions",
      path: "transactions",
      value: companyAnalytics?.totalTransaction ?? 0,
      icon: FaExchangeAlt,
    },
    {
      title: "Refunded",
      path: "refunded",
      value: companyAnalytics?.totalRefundedTickets ?? 0,
      icon: FaUndoAlt,
    },
    {
      title: "Cancelled",
      path: "cancelled",
      value: companyAnalytics?.totalCancelledTickets ?? 0,
      icon: FaTimesCircle,
    },
  ];

  return (
    <CardLayoutContainer removeBg={true}>
      <CardLayoutHeader
        removeBorder={true}
        heading={"Company Details"}
        className="flex items-center justify-between"
      />
      <CardLayoutBody removeBorder={true}>
        <div className="flex justify-end mb-4">
          <Select.Root value={filter} onValueChange={setFilter}>
            <Select.Trigger
              className="inline-flex items-center justify-between gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-lg shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Filter"
            >
              <Select.Value placeholder="Select filter" />
              <Select.Icon className="text-gray-500">&#x25BC;</Select.Icon>
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

        <div className="grid grid-cols-1 gap-6 py-3 md:grid-cols-2 lg:grid-cols-2">
          {isLoadingCompanyRevenue ? (
            <Loader />
          ) : (
            <div className="p-3 transition-all duration-300 bg-white border-t-4 shadow-md border-primary rounded-xl hover:shadow-lg">
              <div className="flex items-center space-x-4">
                <FaClipboardList className="text-3xl text-primary" />
                <div>
                  <h3 className="text-lg font-medium text-gray-700">
                    Revenue Generated
                  </h3>
                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    {Math.round(
                      companyAnalytics?.totalTransaction ?? 0
                    ).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {companySections.map((section) => {
            const Icon = section.icon || FaClipboardList;
            const displayValue = section.value;

            const handleNavigate = () =>
              navigate(
                `/dashboard/company/details/${section.path}/${companyId}`
              );

            return (
              <div
                key={section.path}
                role="button"
                tabIndex={0}
                onClick={handleNavigate}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleNavigate();
                }}
                className="relative flex items-center justify-between p-5 transition-transform bg-white shadow-md cursor-pointer rounded-xl transform-gpu hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                aria-label={`Open ${section.title}`}
              >
                {/* left content */}
                <div className="flex items-center gap-4">
                  {/* Icon container: subtle primary background & primary-colored icon */}
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg shadow-md bg-primary/10">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>

                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-700 truncate">
                      {section.title}
                    </div>
                    <div className="mt-1 text-lg font-bold text-gray-900">
                      {typeof displayValue === "number"
                        ? Math.round(displayValue).toLocaleString()
                        : displayValue || "—"}
                    </div>
                  </div>
                </div>

                {/* right icon */}
                <div className="flex items-center gap-3">
                  <FaEye className="w-5 h-5 text-gray-400" />
                </div>

                {/* left accent stripe — primary colored */}
                <span
                  aria-hidden
                  className="absolute top-0 bottom-0 left-0 w-1 rounded-l-xl bg-primary"
                />
              </div>
            );
          })}
        </div>
      </CardLayoutBody>
    </CardLayoutContainer>
  );
};

export default CompanyDetails;
