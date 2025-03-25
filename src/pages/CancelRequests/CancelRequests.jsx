import React, { useEffect, useState } from "react";
import {
  Table,
  SecondaryButton,
  ConfirmModal,
  Dropdown,
  Tag,
} from "../../components/components";
import { getFlightBookings } from "../../_core/features/bookingSlice";
import { useNavigate } from "react-router-dom";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
  CardLayoutFooter,
} from "../../components/CardLayout/CardLayout";
import toast from "react-hot-toast";

import { FaEye } from "react-icons/fa";
import { IoIosAirplane } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";

const CancelRequests = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [bookingsData, setBookingsData] = useState([]);
  const [modalStatus, setModalStatus] = useState(false);

  const navigationHandler = () => {
    navigate("/dashboard/search-flights");
  };
  const { userData } = useSelector((state) => state.auth);
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

  const viewColumns = [
    { columnName: "Ref Id", fieldName: "booking_reference_id", type: "text" },
    { columnName: "Updated At", fieldName: "updated_at", type: "text" },
    {
      columnName: "Transaction Identifier",
      fieldName: "transaction_identifier",
      type: "text",
    },
    {
      columnName: "Ticketing Time Limit",
      fieldName: "ticketing_time_limit",
      type: "text",
    },
    { columnName: "Booking Id", fieldName: "id", type: "id" },
    { columnName: "Rate", fieldName: "rate", type: "text" },
    { columnName: "Percentage", fieldName: "persantage", type: "text" },
    { columnName: "Cancel At", fieldName: "canceled_at", type: "text" },
  ];

  const actionsData = [
    {
      name: "View",
      icon: <FaEye title="View" className="text-green-500" />,
      // handler: (index) => {
      //   if (activeIndex === index) {
      //     setActiveIndex(null);
      //   } else setActiveIndex(index);
      // },
      handler: (index, item) => {
        navigate("/dashboard/booking-details", {
          state: item.booking_reference_id,
        });
      },
    },
  ];

  // const gettingFlightBookings = async () => {
  //   const response = await getFlightBookings();
  //   if (response.status) {
  //     console.log(response.data);
  //     const data = response.data;
  //     setBookingsData(
  //       data.filter(
  //         ({ booking_status }) => booking_status === "requested-cancellation"
  //       )
  //     );
  //   }
  // };

  const abortDeleteHandler = () => {
    setModalStatus(false);
    setDeleteId(null);
  };

  useEffect(() => {
    dispatch(getFlightBookings(userData?.token));
  }, []);
  const canceledBooking = flightBookings.filter((item) => item.booking_status === "requested-cancellation")
  return (
    <>
      <ConfirmModal
        status={modalStatus}
        abortDelete={abortDeleteHandler}
      // deleteHandler={cancelFlightBookingHandler}
      />
      <CardLayoutContainer removeBg={true}>
        <CardLayoutHeader
          removeBorder={true}
          heading={"Cancel Requests"}
          className="flex justify-between items-center"
        ></CardLayoutHeader>
        <CardLayoutBody removeBorder={true}>
          <Table
            pagination={true}
            columnsData={columns}
            tableData={canceledBooking || []}
            progressPending={isLoadingFlightBookings}
            paginationTotalRows={canceledBooking.length}
            paginationComponentOptions={{ noRowsPerPage: "10" }}
          />
        </CardLayoutBody>
        <CardLayoutFooter></CardLayoutFooter>
      </CardLayoutContainer>
    </>
  );
};

export default CancelRequests;
