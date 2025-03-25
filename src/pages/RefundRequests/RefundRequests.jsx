import React, { useEffect, useState } from "react";
import {
  Table,
  SecondaryButton,
  ConfirmModal,
  Dropdown,
  Tag,
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
import MainTable from "../../components/MainTable/MainTable";

import { FaEye, FaMoneyBillWave } from "react-icons/fa";
import axios from "axios";
import { baseUrl, getToken } from "../../utils/api_handler";
import { useDispatch, useSelector } from "react-redux";
import { getRefundFlight } from "../../_core/features/bookingSlice";
import { IoIosAirplane } from "react-icons/io";
import dayjs from "dayjs";

const RefundRequests = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [bookingsData, setBookingsData] = useState([]);
  const [modalStatus, setModalStatus] = useState(false);

  const [data, setData] = useState([]);
  const { userData } = useSelector((state) => state.auth);
  const { getRefundBooking, isGetRefundsLoading } = useSelector((state) => state.booking)

  useEffect(() => {
    dispatch(getRefundFlight(userData?.token))
  }, [])

  const navigationHandler = () => {
    navigate("/dashboard/search-flights");
  };

  // const columns = [
  //   { columnName: "No.", fieldName: "no.", type: "no." },
  //   { columnName: "Origin", fieldName: "origin", type: "text" },
  //   { columnName: "Destination", fieldName: "destination", type: "text" },
  //   { columnName: "Total Fare", fieldName: "total_fare", type: "text" },
  //   { columnName: "Currency", fieldName: "currency", type: "text" },
  //   { columnName: "Status", fieldName: "booking_status", type: "status" },
  //   { columnName: "Created At", fieldName: "created_at", type: "text" },
  //   { columnName: "Actions", fieldName: "actions", type: "actions" },
  // ];

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



  const actionsData = [
    {
      name: "View",
      icon: <FaEye title="View" className="text-green-500" />,
      handler: (index, item) => {
        navigate("/dashboard/booking-details", {
          state: item.booking_reference_id,
        });
      },
    },
    {
      name: "Refund",
      icon: <FaMoneyBillWave title="Request Refund" className="text-red-500" />,
      handler: async (index, item) => {
        try {
          const response = await axios.post(
            `http://localhost:3004/api/booking-refund`,
            {
              // ticket_number: String(item.ticket_number),
              ticket_number: String(item.ticket_number),
              coupon_number: String(item.coupon_number),
              zero_penalty: true
            },
            {
              headers: {
                Authorization: getToken(),
                "Content-Type": "application/json",
              },
            }
          );
          if (response.status === 200) {
            console.log(`Sucess`, response)
            toast.success("Refund request submitted successfully!");
          } else {
            toast.error("Failed to submit refund request.");
          }
        } catch (error) {
          toast.error("Error processing refund request.");
          console.error("Refund API Error:", error);
        }
      },
    },
  ];
  console.log(typeof String(null))


  const abortDeleteHandler = () => {
    setModalStatus(false);
    setDeleteId(null);
  };


  console.log("get refund booking", getRefundBooking)
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
          className="flex items-center justify-between"
        ></CardLayoutHeader>
        <CardLayoutBody removeBorder={true}>

          <Table
            tableData={getRefundBooking || []}
            columnsData={columns}
            pagination={true}
            progressPending={isGetRefundsLoading}
            paginationTotalRows={getRefundBooking?.length}
            paginationComponentOptions={{ noRowsPerPage: "10" }}

          // viewColumns={viewColumns}
          // data={data||[]}
          // actions={actionsData}
          />
        </CardLayoutBody>
        <CardLayoutFooter></CardLayoutFooter>
      </CardLayoutContainer>
      {/* <MainTable columns={columns} data={data} />; */}
    </>
  );
};

export default RefundRequests;
