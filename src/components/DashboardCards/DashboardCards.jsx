import  { useEffect } from "react";
import Loader  from "../Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardAnalytics } from "../../_core/features/adminSlice";
import { FaUserAlt, FaTachometerAlt, FaClipboardList } from "react-icons/fa";

const DashboardCards = () => {
  const dispatch = useDispatch();
  const { adminData } = useSelector((state) => state.persist);
  const { dashboard, isLoadingDashboard } = useSelector((state) => state.admin);

  useEffect(() => {
    if (!adminData?.token) return;
    dispatch(getDashboardAnalytics(adminData?.token));
  }, [adminData?.token]);

  const cardData = [
    {
      title: "Revenue",
      value: dashboard?.totalRevenue,
      description: "Gross revenue",
      icon: <FaTachometerAlt className="text-3xl text-primary" />,
    },
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
    <div className="w-full ">
      {isLoadingDashboard ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cardData.map((card, index) => (
            <div
              key={index}
              className="flex items-start p-5 transition duration-300 bg-white shadow-inner rounded-xl hover:shadow-lg "
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
