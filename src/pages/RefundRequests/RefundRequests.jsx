import React, { useEffect, useState } from "react";
import {
  Table,
  SecondaryButton,
  ConfirmModal,
  Dropdown,
} from "../../components/components";
import { getFlightBookings } from "../../utils/api_handler";

import { useNavigate } from "react-router-dom";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
  CardLayoutFooter,
} from "../../components/CardLayout/CardLayout";
import toast from "react-hot-toast";

import { FaEye } from "react-icons/fa";

const RefundRequests = () => {
  const navigate = useNavigate();

  const [bookingsData, setBookingsData] = useState([]);
  const [modalStatus, setModalStatus] = useState(false);

  const navigationHandler = () => {
    navigate("/dashboard/search-flights");
  };

  const columnsData = [
    { columnName: "No.", fieldName: "no.", type: "no." },
    { columnName: "Origin", fieldName: "origin", type: "text" },
    { columnName: "Destination", fieldName: "destination", type: "text" },
    { columnName: "Total Fare", fieldName: "total_fare", type: "text" },
    { columnName: "Currency", fieldName: "currency", type: "text" },
    { columnName: "Status", fieldName: "booking_status", type: "status" },
    { columnName: "Created At", fieldName: "created_at", type: "text" },
    { columnName: "Actions", fieldName: "actions", type: "actions" },
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
      handler: (index) => {
        if (activeIndex === index) {
          setActiveIndex(null);
        } else setActiveIndex(index);
      },
      handler: (index, item) => {
        navigate("/dashboard/booking-details", {
          state: item.booking_reference_id,
        });
      },
    },
  ];

  const gettingFlightBookings = async () => {
    const response = await getFlightBookings();
    console.log("get filght bookings", response);
    if (response.status) {
      console.log(response.data);
      const data = response.data;
      setBookingsData(
        data.filter(
          ({ booking_status }) => booking_status === "requested-refund"
        )
      );
    }
  };

  const abortDeleteHandler = () => {
    setModalStatus(false);
    setDeleteId(null);
  };

  useEffect(() => {
    gettingFlightBookings();
  }, []);

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
          heading={"Refund Requests"}
          className="flex justify-between items-center"
        ></CardLayoutHeader>
        <CardLayoutBody removeBorder={true}>
          <Table
            columns={columnsData}
            viewColumns={viewColumns}
            data={bookingsData}
            actions={actionsData}
          />
        </CardLayoutBody>
        <CardLayoutFooter></CardLayoutFooter>
      </CardLayoutContainer>
    </>
  );
};

export default RefundRequests;
