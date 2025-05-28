import  { useEffect, useState } from "react";
import {
  ExcelExportButton,
  Searchbar,
  Table,
  Tag,
} from "../../components/components";
import { useNavigate } from "react-router-dom";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
} from "../../components/CardLayout/CardLayout";
import { FaEye } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getFlightBookings } from "../../_core/features/bookingSlice";
import { IoIosAirplane } from "react-icons/io";
import dayjs from "dayjs";
import useLogout from "../../hooks/useLogout";

const FlightBookings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logoutHandler = useLogout();
  const { adminData } = useSelector((state) => state.persist);
  const { flightBookings, isLoadingFlightBookings } = useSelector(
    (state) => state.booking
  );
  const [filteredData, setFilteredData] = useState(flightBookings);

  useEffect(() => {
    dispatch(getFlightBookings({ token: adminData.token, logoutHandler }));
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

  return (
    <>
      <CardLayoutContainer removeBg={true}>
        <CardLayoutHeader
          removeBorder={true}
          heading={"Flight Bookings"}
          className="flex items-center justify-between"
        ></CardLayoutHeader>
        <CardLayoutBody removeBorder={true}>
          <ExcelExportButton
            data={filteredData || []}
            fileName="FlightBookings"
          />
          {flightBookings && (
            <Searchbar onFilteredData={setFilteredData} data={flightBookings} />
          )}
          <Table
            pagination={true}
            columnsData={columns}
            tableData={filteredData || []}
            progressPending={isLoadingFlightBookings}
            paginationTotalRows={filteredData.length}
            paginationComponentOptions={{ noRowsPerPage: "10" }}
          />
        </CardLayoutBody>
      </CardLayoutContainer>
    </>
  );
};

export default FlightBookings;
