import { useEffect, useState } from "react";
import Tag from "../../components/Tag/Tag";
import Table from "../../components/Table/Table";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import CustomTooltip from "../../components/CustomTooltip/CustomTooltip";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
} from "../../components/CardLayout/CardLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  refundRequestFlight,
  refundRequestTicket,
} from "../../_core/features/bookingSlice";
import { IoIosAirplane } from "react-icons/io";
import dayjs from "dayjs";
import { RiRefund2Fill } from "react-icons/ri";
import useLogout from "../../hooks/useLogout";

const RefundRequests = () => {
  const dispatch = useDispatch();
  const logoutHandler = useLogout();
  const [modalStatus, setModalStatus] = useState(false);
  const [refundId, setRefundId] = useState();
  const { adminData } = useSelector((state) => state.persist);
  const { refundBookings, isGetRefundsLoading, isRefundRequestLoading } =
    useSelector((state) => state.booking);

  useEffect(() => {
    if (adminData?.token) {
      dispatch(refundRequestTicket({ token: adminData.token, logoutHandler }));
    }
  }, [adminData?.token]);
  const columns = [
    {
      name: "ROUTE",
      selector: (row) => (
        <span className="flex items-center gap-2 text-sm lg:justify-center text-text">
          {row.booking.origin}
          <div className="flex items-center justify-center gap-1">
            <span className="h-0.5 w-3 bg-primary"></span>
            <IoIosAirplane className="text-lg text-primary" />
            <span className="h-0.5 w-3 bg-primary"></span>
          </div>
          {row.booking.destination}
        </span>
      ),
      sortable: false,
      wrap: true,
      grow: 4,
    },
    {
      name: "PNR",
      selector: (row) => row.booking.booking_reference_id,
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
      name: "PENALTY",
      selector: (row) => Math.round(row.total_fare).toLocaleString(),
      sortable: false,
      grow: 2,
    },
    {
      name: "STATUS",
      selector: (row) => <Tag value={row.status} />,
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
