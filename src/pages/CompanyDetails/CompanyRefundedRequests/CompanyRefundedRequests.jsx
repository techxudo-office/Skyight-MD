import React, { useEffect, useState } from "react";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
} from "../../../components/CardLayout/CardLayout";
import dayjs from "dayjs";
import { FaEye } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  ModalWrapper,
  Button,
  Tag,
} from "../../../components/components";
import { IoIosAirplane } from "react-icons/io";
import { getCompanyBookings } from "../../../_core/features/bookingSlice";

const CompanyRefundedRequests = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { companyId } = useParams();
  const [modal, setModal] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [refundedRequests, setRefundedRequests] = useState([]);
  const { userData } = useSelector((state) => state.auth);
  const { companyBookings, isLoadingCompanyBookings } = useSelector(
    (state) => state.booking
  );

  const handleView = (row) => {
    setTicket(row);
    setModal(true);
  };

  const closeModal = () => {
    setTicket(false);
    setModal(false);
  };

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
        <div className="flex items-center gap-x-4">
          <span
            className="text-xl cursor-pointer"
            onClick={() =>
              navigate(`/dashboard/company/details/refunded-requests/booking-details/${companyId}`, {
                state: row,
              })
            }
          >
            <FaEye title="View" className="text-green-500" />
          </span>
        </div>
      ),
      sortable: false,
      minwidth: "150px",
      center: true,
    },
  ];

  useEffect(() => {
    dispatch(
      getCompanyBookings({ token: userData?.token, id: companyId })
    ).then(() => {
      const refunded = companyBookings.filter(
        (booking) => booking.booking_status === "Refunded"
      );
      setRefundedRequests(refunded);
    });
  }, []);

  return (
    <>
      <CardLayoutContainer removeBg={true}>
        <CardLayoutHeader
          removeBorder={true}
          heading={"Company Refunded Requests"}
          className="flex items-center justify-between"
        />
        <CardLayoutBody removeBorder={true}>
          <Table
            pagination={true}
            columnsData={columns}
            tableData={refundedRequests || []}
            progressPending={isLoadingCompanyBookings}
            paginationTotalRows={refundedRequests?.length}
            paginationComponentOptions={{ noRowsPerPage: "10" }}
          />
        </CardLayoutBody>
      </CardLayoutContainer>
      <ModalWrapper
        isOpen={modal}
        onRequestClose={closeModal}
        contentLabel="Ticket Details"
      >
        {ticket && (
          <div className="max-w-md p-6 mx-auto bg-white border border-gray-300 rounded-lg shadow-lg">
            <h2 className="pb-2 mb-4 text-2xl font-bold text-center border-b">
              Ticket Details
            </h2>

            <div className="space-y-2 text-sm">
              <p>
                <strong className="text-text">Title:</strong>
                <span className="ml-2 font-medium">{ticket.title}</span>
              </p>
              <p>
                <strong className="text-text">Description:</strong>
                <span className="ml-2 font-medium">{ticket.description}</span>
              </p>
              <p className="flex items-center gap-x-4">
                <strong className="text-text">Status:</strong>
                <span className="w-24">
                  <Tag value={ticket.status} />
                </span>
              </p>
              <p>
                <strong className="text-text">Created At:</strong>
                <span className="ml-2 font-medium">
                  {dayjs(ticket.created_at).format("DD-MMM-YYYY h:mm a")}
                </span>
              </p>
            </div>

            <div className="flex justify-end mt-6">
              <Button
                onClick={closeModal}
                text="Close"
                className="px-4 py-2 text-white rounded-md hover:bg-primary bg-redColor"
              />
            </div>
          </div>
        )}
      </ModalWrapper>
    </>
  );
};

export default CompanyRefundedRequests;
