import React, { useEffect, useState } from "react";
import {
  SecondaryButton,
  Table,
  ModalWrapper,
  Button,
  Tag,
} from "../../components/components";

import { MdAdd } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
  CardLayoutFooter,
} from "../../components/CardLayout/CardLayout";
import { FaEye } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getTickets } from "../../_core/features/ticketSlice";
import dayjs from "dayjs";

const Tickets = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const [ticket, setTicket] = useState(null);
  const { userData } = useSelector((state) => state.auth);
  const { tickets, isLoadingTickets } = useSelector((state) => state.ticket);

  const navigationHandler = () => {
    navigate("/dashboard/create-ticket");
  };

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
      name: "TITLE",
      selector: (row) => row.title,
      sortable: false,
      minwidth: "150px",
      center: true,
    },
    {
      name: "DESCRIPTION",
      selector: (row) => row.description,
      sortable: false,
      minwidth: "150px",
      center: true,
    },
    {
      name: "STATUS",
      selector: (row) => <Tag value={row.status} />,
      sortable: false,
      minwidth: "150px",
      center: true,
    },
    {
      name: "",
      selector: (row) => (
        <div className="flex items-center gap-x-4">
          <span
            className="text-xl cursor-pointer"
            onClick={() => handleView(row)}
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
    dispatch(getTickets(userData?.token));
  }, []);

  return (
    <>
      <CardLayoutContainer removeBg={true}>
        <CardLayoutHeader
          removeBorder={true}
          heading={"Tickets"}
          className="flex items-center justify-between"
        />
        <CardLayoutBody removeBorder={true}>
          <Table
            pagination={true}
            columnsData={columns}
            tableData={tickets || []}
            progressPending={isLoadingTickets}
            paginationTotalRows={tickets.length}
            paginationComponentOptions={{ noRowsPerPage: "10" }}
          />
        </CardLayoutBody>
        <CardLayoutFooter></CardLayoutFooter>
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

export default Tickets;
