import React, { useEffect, useState } from "react";
import {
  Table,
  ModalWrapper,
  Button,
  Tag,
  CustomTooltip,
  ConfirmModal,
  Searchbar,
} from "../../components/components";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
  CardLayoutFooter,
} from "../../components/CardLayout/CardLayout";
import { FaEye } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getTickets } from "../../_core/features/ticketSlice";
import { MdEditSquare } from "react-icons/md";
import dayjs from "dayjs";
import EditTicketModal from "./EditTicketModal/EditTicketModal";

const Tickets = () => {
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [ticketData, setTicketData] = useState(null);
  const { adminData } = useSelector((state) => state.auth);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { tickets, isLoadingTickets } = useSelector((state) => state.ticket);
  const [filteredData, setFilteredData] = useState(tickets)

  const handleView = (row) => {
    setTicket(row);
    setModal(true);
  };

  const closeModal = () => {
    setTicket(false);
    setModal(false);
  };

  useEffect(() => {
    if (adminData?.token) {
      dispatch(getTickets(adminData?.token));
    }
  }, [adminData?.token]);

  const columns = [
    {
      name: "COMPANY",
      selector: (row) => row?.user.company.name,
      sortable: false,

    },
    {
      name: "TICKET ID",
      selector: (row) => row?.id,
      sortable: false,

    },
    {
      name: "CREATED BY",
      selector: (row) => `${row?.user.first_name} ${row?.user.last_name}`,
      sortable: false,

    },
    {
      name: "TITLE",
      selector: (row) => row?.title,
      sortable: false,

    },
    {
      name: "DESCRIPTION",
      selector: (row) => row?.description,
      sortable: false,

    },
    {
      name: "STATUS",
      selector: (row) => <Tag value={row?.status} />,
      sortable: false,

    },
    {
      name: "",
      selector: (row) => (
        <div className="flex items-center gap-x-4">
          <CustomTooltip content={"Details"}>
            <FaEye
              className="text-lg cursor-pointer text-greenColor"
              onClick={() => handleView(row)}
            />
          </CustomTooltip>
          {row?.status !== "closed" && row?.status !== "rejected" && (
            <CustomTooltip content={"Edit"}>
              <MdEditSquare
                onClick={() => {
                  setTicketData(row);
                  setIsEditModalOpen(true);
                }}
                title="Edit"
                className="text-lg text-blue-500 cursor-pointer"
              />
            </CustomTooltip>
          )}
        </div>
      ),
      sortable: false,

    },
  ];

  return (
    <>
      {isEditModalOpen && (
        <EditTicketModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          data={ticketData}
        />
      )}
      <CardLayoutContainer removeBg={true}>
        <CardLayoutHeader
          removeBorder={true}
          heading={"Tickets"}
          className="flex items-center justify-between"
        />
        <CardLayoutBody removeBorder={true}>
          {tickets && <Searchbar onFilteredData={setFilteredData} data={tickets} />}
          <Table
            pagination={true}
            columnsData={columns}
            tableData={filteredData || []}
            progressPending={isLoadingTickets}
            paginationTotalRows={filteredData.length}
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
