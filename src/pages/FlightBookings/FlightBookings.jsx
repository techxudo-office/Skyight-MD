import { useEffect, useState } from "react";
import Tag from "../../components/Tag/Tag";
import Table from "../../components/Table/Table";
import Searchbar from "../../components/Searchbar/Searchbar";
import ExcelExportButton from "../../components/ExcelExportButton/ExcelExportButton";
import { useNavigate, useParams } from "react-router-dom";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
} from "../../components/CardLayout/CardLayout";
import { FaEye } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  getFlightBookings,
  getCompanyBookings,
} from "../../_core/features/bookingSlice";
import { IoIosAirplane } from "react-icons/io";
import dayjs from "dayjs";
import useLogout from "../../hooks/useLogout";

const FlightBookings = ({ isCompanyDetail = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logoutHandler = useLogout();
  const { companyId } = useParams(); // used when isCompanyDetail === true

  const { adminData } = useSelector((state) => state.persist);
  const {
    flightBookings,
    companyBookings,
    isLoadingFlightBookings,
    isLoadingCompanyBookings,
  } = useSelector((state) => state.booking);

  // filteredData is the table dataset (searchbar writes to this)
  const [filteredData, setFilteredData] = useState([]);

  // Choose data source and loading source based on prop
  const bookings = isCompanyDetail ? companyBookings : flightBookings;
  const loading = isCompanyDetail
    ? isLoadingCompanyBookings
    : isLoadingFlightBookings;

  // Fetch correct bookings on mount / when dependencies change
  useEffect(() => {
    if (!adminData?.token) return;

    if (isCompanyDetail) {
      // require companyId to fetch company bookings
      if (!companyId) return;
      dispatch(
        getCompanyBookings({
          token: adminData.token,
          id: companyId,
          logoutHandler,
        })
      );
    } else {
      dispatch(getFlightBookings({ token: adminData.token, logoutHandler }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, adminData?.token, isCompanyDetail, companyId]);

  // Sync filteredData with the chosen bookings source whenever it changes
  useEffect(() => {
    setFilteredData(Array.isArray(bookings) ? bookings : []);
  }, [bookings]);

  const columns = [
    {
      name: "ROUTE",
      selector: (row) => (
        <span className="flex items-center gap-2 text-sm w-52 lg:justify-center text-text">
          {row.origin}
          <div className="flex items-center justify-center gap-1">
            <span className="h-0.5 w-3 bg-primary" />
            <IoIosAirplane className="text-lg text-primary" />
            <span className="h-0.5 w-3 bg-primary" />
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

  return (
    <CardLayoutContainer removeBg={true}>
      <CardLayoutHeader
        removeBorder={true}
        heading={isCompanyDetail ? "Company Bookings" : "Flight Bookings"}
        className="flex items-center justify-between"
      />
      <CardLayoutBody removeBorder={true}>
        <div className="flex items-center gap-3 mb-4">
          <ExcelExportButton
            data={filteredData || []}
            fileName={
              isCompanyDetail
                ? `Company_${companyId}_Bookings`
                : "FlightBookings"
            }
          />
        </div>

        {/* show searchbar only when we have data */}
        {Array.isArray(bookings) && bookings.length > 0 && (
          <Searchbar
            searchFields={[
              "booking_status",
              "booking_reference_id",
              "origin",
              "destination",
            ]}
            onFilteredData={setFilteredData}
            data={bookings}
          />
        )}

        <Table
          pagination={true}
          columnsData={columns}
          tableData={filteredData || []}
          progressPending={loading}
          paginationTotalRows={(filteredData || []).length}
          paginationComponentOptions={{ noRowsPerPage: "10" }}
        />
      </CardLayoutBody>
    </CardLayoutContainer>
  );
};

export default FlightBookings;
