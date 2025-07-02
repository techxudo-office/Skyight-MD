import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Tag from "../../components/Tag/Tag";
import Table from "../../components/Table/Table";
import DashboardCards from "../../components/DashboardCards/DashboardCards";
import DashboardComissions from "../../components/DashboardComissions/DashboardComissions";
import { getLatestBooking } from "../../_core/features/bookingSlice";
import { IoIosAirplane } from "react-icons/io";
import dayjs from "dayjs";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useLogout from "../../hooks/useLogout";

const DashboardHome = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logoutHandler = useLogout();
  const { adminData } = useSelector((state) => state.persist);
  const { latestBookings, isLoadingLatestBookings } = useSelector(
    (state) => state.booking
  );

  useEffect(() => {
    if (!adminData.token) return;
    dispatch(getLatestBooking({ token: adminData.token, logoutHandler }));
  }, [dispatch]);

  const columns = [
    {
      name: "ROUTE",
      selector: (row) => (
        <span className="flex items-center gap-2 text-sm w-52 lg:justify-center text-text">
          {row.origin}
          <div className="flex items-center justify-center gap-1">
            <span className="h-0.5 w-3 bg-primary"></span>
            <IoIosAirplane className="text-lg text-primary" />
            <span className="h-0.5 w-3 bg-primary"></span>
          </div>
          {row.destination}
        </span>
      ),
      sortable: false,
      wrap: true,
      grow: 4,
    },
    {
      name: "PNR",
      selector: (row) => row.booking_reference_id,
      sortable: false,
      minwidth: "150px",
      grow: 2,
    },
    {
      name: "TOTAL FARE",
      selector: (row) => row.total_fare,
      sortable: false,
      grow: 2,
    },
    {
      name: "STATUS",
      selector: (row) => <Tag value={row.booking_status} />,
      sortable: false,
      wrap: true,
      grow: 4,
    },
    {
      name: "CREATED AT",
      selector: (row) => dayjs(row.created_at).format("MMM-DD-YYYY"),
      sortable: false,
      grow: 2,
    },
    {
      name: "",
      selector: (row) => (
        <span
          className="text-lg cursor-pointer"
          onClick={() => {
            navigate("/dashboard/booking-details", {
              state: row,
            });
          }}
        >
          <FaEye title="View" className="text-green-500 " />
        </span>
      ),
      sortable: false,
    },
  ];

  const DataArray = [
    {
      title: "Iran Airtour",
      tableData: latestBookings?.booked && latestBookings?.booked[0],
      link: "/dashboard/transactions",
    },
    {
      title: "Recent Bookings",
      tableData: latestBookings?.booked && latestBookings?.booked[0],
      link: "/dashboard/flight-bookings",
    },
    {
      title: "Refund Requests",
      tableData: latestBookings?.booked && latestBookings?.refundedBookings[0],
      link: "/dashboard/refund-requests",
    },
    {
      title: "Cancelled Orders",
      tableData: latestBookings?.booked && latestBookings?.booked[0],
      link: "/dashboard/cancel-requests",
    },
  ];

  return (
    <div className="pb-10 space-y-10 bg-background">
      <h2 className="text-3xl font-semibold text-text mb-7">Dashboard</h2>
      <DashboardComissions />
      <DashboardCards />
      {DataArray.map((section, index) => (
        <div key={index} className="w-full">
          <h2 className="flex items-center gap-3 mb-5 text-xl font-semibold">
            {section.title}{" "}
            {section.title === "Iran Airtour" && (
              <img
                className="p-2 rounded-md bg-primary w-36"
                src="https://en.iranairtour.ir/Content/Images/logo/Brand-icon.png"
              />
            )}
          </h2>
          <Table
            columnsData={columns}
            tableData={section?.tableData || []}
            progressPending={isLoadingLatestBookings}
            paginationTotalRows={section?.tableData?.length}
            paginationComponentOptions={{ noRowsPerPage: "10" }}
          />
          <div className="mt-4 text-right">
            <button
              onClick={() => navigate(section.link)}
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              Read More →
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardHome;
