import { useEffect, useState } from "react";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
} from "../../../components/CardLayout/CardLayout";
import dayjs from "dayjs";
import { FaEye } from "react-icons/fa";
import { IoIosAirplane } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Tag from "../../../components/Tag/Tag";
import Table from "../../../components/Table/Table";
import Searchbar from "../../../components/Searchbar/Searchbar";
import { getCompanyBookings } from "../../../_core/features/bookingSlice";

const CompanyCancelledRequests = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { companyId } = useParams();
  const [filteredData, setFilteredData] = useState([]);
  const [cancelledRequests, setCancelledRequests] = useState([]);
  const { adminData } = useSelector((state) => state.persist);
  const { companyBookings, isLoadingCompanyBookings } = useSelector(
    (state) => state.booking
  );

  useEffect(() => {
    // On mount, fetch company bookings only if admin token is present.
    if (adminData?.token) {
      dispatch(getCompanyBookings({ token: adminData?.token, id: companyId }));
    }
  }, []);

  useEffect(() => {
    // Whenever company bookings are updated, filter only the cancelled ones.
    const refunded = companyBookings.filter(
      (booking) => booking.booking_status === "cancelled"
    );
    setCancelledRequests(refunded);
  }, [companyBookings]);

  const columns = [
    {
      name: "ROUTE",
      selector: (row) => (
        <span className="flex items-center gap-2 text-sm w-52 lg:justify-center text-text">
          {row.origin}
          <div className="flex items-center justify-center gap-1">
            {/* Visually represents flight route between origin and destination */}
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
      grow: 2,
    },
    {
      name: "TOTAL FARE",
      selector: (row) => Math.round(row.total_fare).toLocaleString(),
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
        <div className="flex items-center gap-x-4">
          <span
            className="text-xl cursor-pointer"
            onClick={() =>
              // Navigates to a detailed view of the cancelled booking, passing full booking data via location state
              navigate(
                `/dashboard/company/details/cancelled/booking-details/${companyId}`,
                {
                  state: row,
                }
              )
            }
          >
            <FaEye title="View" className="text-green-500" />
          </span>
        </div>
      ),
      sortable: false,
    },
  ];

  return (
    <CardLayoutContainer removeBg={true}>
      <CardLayoutHeader
        removeBorder={true}
        heading={"Company Cancelled Requests"}
        className="flex items-center justify-between"
      />
      <CardLayoutBody removeBorder={true}>
        {/* Handles client-side filtering based on PNR and status fields */}
        <Searchbar
          onFilteredData={setFilteredData}
          data={cancelledRequests}
          searchFields={["booking_reference_id", "booking_status"]}
        />
        <Table
          pagination={true}
          columnsData={columns}
          tableData={filteredData || []}
          progressPending={isLoadingCompanyBookings}
          paginationTotalRows={filteredData?.length}
          paginationComponentOptions={{ noRowsPerPage: "10" }}
        />
      </CardLayoutBody>
    </CardLayoutContainer>
  );
};

export default CompanyCancelledRequests;
