import React, { useEffect } from "react";
import { Table, Tag } from "../../components/components";
import { useNavigate } from "react-router-dom";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
  CardLayoutFooter,
} from "../../components/CardLayout/CardLayout";
import { FaEye } from "react-icons/fa";
import { IoIosAirplane } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { getFlightBookings } from "../../_core/features/bookingSlice";
import dayjs from "dayjs";

const FlightBookings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { adminData } = useSelector((state) => state.auth);
  const { flightBookings, isLoadingFlightBookings } = useSelector(
    (state) => state.booking
  );
  const columns = [
    {
      name: "ROUTE",
      selector: (row) => (
        <span className="flex w-52 items-center lg:justify-center  gap-2 text-sm text-text">
          {row.origin}
          <div className="flex justify-center items-center gap-1">
            <span className="h-0.5 w-3 bg-primary"></span>
            <IoIosAirplane className="text-lg text-primary" />
            <span className="h-0.5 w-3 bg-primary"></span>
          </div>
          {row.destination}
        </span>
      ),
      sortable: false,
      center: true,
      wrap: true,
      grow: 4,
    },
    {
      name: "PNR",
      selector: (row) => row.booking_reference_id,
      sortable: false,
      minwidth: "150px",
      center: true,
      grow: 2,
    },
    {
      name: "TOTAL FARE",
      selector: (row) => row.total_fare,
      sortable: false,
      center: true,
      grow: 2,
    },
    {
      name: "STATUS",
      selector: (row) => <Tag value={row.booking_status} />,
      sortable: false,
      center: true,
      wrap: true,
      grow: 4,
    },
    {
      name: "CREATED AT",
      selector: (row) => dayjs(row.created_at).format("MMM-DD-YYYY"),
      sortable: false,
      center: true,
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
          }}>
          <FaEye title="View" className="text-green-500 " />
        </span>
      ),
      sortable: false,
      center: true,
    },
  ];

  useEffect(() => {
    dispatch(getFlightBookings(adminData?.token));
  }, []);

  return (
    <CardLayoutContainer removeBg={true}>
      <CardLayoutHeader
        removeBorder={true}
        heading={"Flight Bookings"}
        className="flex justify-between items-center"></CardLayoutHeader>
      <CardLayoutBody removeBorder={true}>
        <Table
          pagination={true}
          columnsData={columns}
          tableData={flightBookings || []}
          progressPending={isLoadingFlightBookings}
          paginationTotalRows={flightBookings.length}
          paginationComponentOptions={{ noRowsPerPage: "10" }}
        />
      </CardLayoutBody>
      <CardLayoutFooter></CardLayoutFooter>
    </CardLayoutContainer>
  );
};

export default FlightBookings;
