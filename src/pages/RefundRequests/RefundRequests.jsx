import React, { useEffect, useState } from "react";
import {
  Table,
  ConfirmModal,
  Tag,
  CustomTooltip,
} from "../../components/components";
import { useNavigate } from "react-router-dom";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
} from "../../components/CardLayout/CardLayout";
import { FaEye } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  getRefundFlight,
  refundRequestFlight,
} from "../../_core/features/bookingSlice";
import { IoIosAirplane } from "react-icons/io";
import dayjs from "dayjs";
import { RiRefund2Fill } from "react-icons/ri";

const RefundRequests = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [modalStatus, setModalStatus] = useState(false);
  const [refundId, setRefundId] = useState();
  const { adminData } = useSelector((state) => state.persist);
  const { refundBookings, isGetRefundsLoading, isRefundRequestLoading } =
    useSelector((state) => state.booking);

  useEffect(() => {
    if (adminData?.token) {
      dispatch(getRefundFlight(adminData?.token));
    }
  }, [adminData?.token]);

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
        <div className="flex items-center text-xl gap-x-6">
          <CustomTooltip content={"Details"}>
            <FaEye
              className="cursor-pointer text-greenColor"
              onClick={() =>
                navigate("/dashboard/booking-details", {
                  state: row,
                })
              }
            />
          </CustomTooltip>
          <CustomTooltip content={"Accept"}>
            <RiRefund2Fill
              className="cursor-pointer text-blueColor"
              onClick={() => {
                setModalStatus(true);
                setRefundId(row.id);
              }}
            />
          </CustomTooltip>
        </div>
      ),
      sortable: false,
      wrap: false,
    },
  ];

  const handleAcceptRefund = (id) => {
    dispatch(refundRequestFlight({ id, token: adminData?.token }));
  };
  return (
    <>
      <ConfirmModal
        text={"Are you really want to accepet the refund request?"}
        onConfirm={() => {
          handleAcceptRefund(refundId);
          setModalStatus(false);
        }}
        loading={isRefundRequestLoading}
        onAbort={() => setModalStatus(false)}
        status={modalStatus}
      />
      <CardLayoutContainer removeBg={true}>
        <CardLayoutHeader
          removeBorder={true}
          heading={"Refund Requests"}
          className="flex items-center justify-between"
        ></CardLayoutHeader>
        <CardLayoutBody removeBorder={true}>
          <Table
            tableData={refundBookings || []}
            columnsData={columns}
            pagination={true}
            progressPending={isGetRefundsLoading}
            paginationTotalRows={refundBookings?.length}
            paginationComponentOptions={{ noRowsPerPage: "10" }}
          />
        </CardLayoutBody>
      </CardLayoutContainer>
    </>
  );
};

export default RefundRequests;
