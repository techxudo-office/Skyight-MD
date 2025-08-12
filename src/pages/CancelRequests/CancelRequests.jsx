import { useEffect, useState } from "react";
import Tag from "../../components/Tag/Tag";
import Table from "../../components/Table/Table";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import CustomTooltip from "../../components/CustomTooltip/CustomTooltip";
import {
  cancelRequestFlight,
  getFlightBookings,
} from "../../_core/features/bookingSlice";
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
import dayjs from "dayjs";
import { MdCancelScheduleSend } from "react-icons/md";
import useLogout from "../../hooks/useLogout";

const CancelRequests = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logoutHandler = useLogout();
  const [modalStatus, setModalStatus] = useState(false);
  const [cancelId, setCancelId] = useState();
  const { adminData } = useSelector((state) => state.persist);
  const { flightBookings, isLoadingFlightBookings, isCancelRequestLoading } =
    useSelector((state) => state.booking);

  const canceledBooking = flightBookings.filter(
    (item) => item.booking_status === "requested-cancellation"
  );

  const handleCancelRequest = (id) => {
    dispatch(cancelRequestFlight({ id, token: adminData?.token }));
  };

  useEffect(() => {
    if (adminData?.token) {
      dispatch(getFlightBookings({ token: adminData.token, logoutHandler }));
    }
  }, []);

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
      selector: (row) => Math.round(row.total_fare).toLocaleString(),
      sortable: false,
      grow: 2,
    },
    {
      name: "STATUS",
      selector: (row) => <Tag value={row.booking_status} />,
      sortable: false,
      wrap: true,
      width: "170px",

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
              className="cursor-pointer t text-greenColor"
              onClick={() =>
                navigate("/dashboard/booking-details", {
                  state: row,
                })
              }
            />
          </CustomTooltip>
          <CustomTooltip content={"Accept"}>
            <MdCancelScheduleSend
              className="cursor-pointer text-redColor"
              onClick={() => {
                setModalStatus(true);
                setCancelId(row.id);
              }}
            />
          </CustomTooltip>
        </div>
      ),
      sortable: false,
    },
  ];

  return (
    <>
      <ConfirmModal
        text={"Are you want to accept this cancellation request?"}
        status={modalStatus}
        onConfirm={() => {
          handleCancelRequest(cancelId);
          setModalStatus(false);
        }}
        loading={isCancelRequestLoading}
        onAbort={() => setModalStatus(false)}
      />
      <CardLayoutContainer removeBg={true}>
        <CardLayoutHeader
          removeBorder={true}
          heading={"Cancel Requests"}
          className="flex items-center justify-between"
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
