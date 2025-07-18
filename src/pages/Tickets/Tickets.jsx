import { useEffect, useState } from "react";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
  CardLayoutFooter,
} from "../../components/CardLayout/CardLayout";
import Table from "../../components/Table/Table";
import ModalWrapper from "../../components/ModalWrapper/ModalWrapper";
import Button from "../../components/Button/Button";
import Tag from "../../components/Tag/Tag";
import CustomTooltip from "../../components/CustomTooltip/CustomTooltip";
import Searchbar from "../../components/Searchbar/Searchbar";
import ExcelExportButton from "../../components/ExcelExportButton/ExcelExportButton";
import { FaEye } from "react-icons/fa";
import dayjs from "dayjs";
import { MdEditSquare } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import useLogout from "../../hooks/useLogout";
import { getTickets } from "../../_core/features/ticketSlice";
import EditTicketModal from "./EditTicketModal/EditTicketModal";

const Tickets = () => {
  const dispatch = useDispatch();
  const logoutHandler = useLogout();
  const [modal, setModal] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [ticketData, setTicketData] = useState(null);
  const { adminData } = useSelector((state) => state.persist);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { tickets, isLoadingTickets } = useSelector((state) => state.ticket);
  const [filteredData, setFilteredData] = useState(tickets);

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
      dispatch(getTickets({ token: adminData.token, logoutHandler }));
    }
  }, [adminData?.token]);

  const columns = [
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
      name: "COMPANY",
      selector: (row) => row?.user?.company.name,
      sortable: false,
    },
    {
      name: "CREATED BY",
      selector: (row) => `${row?.user?.first_name} ${row?.user?.last_name}`,
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
          <div className="flex justify-end w-full ">
            <ExcelExportButton
              data={filteredData || []}
              fileName="Tickets"
              excludeKeys={["user"]}
            />
          </div>

          {tickets && (
            <Searchbar onFilteredData={setFilteredData} data={tickets} />
          )}
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
              <p>
                <strong className="text-text">Admin Response:</strong>
                <span className="ml-2 font-medium">
                  {ticket.admin_response}
                </span>
              </p>

              <p className="flex items-center gap-x-4">
                <strong className="text-text">Status:</strong>
                <span>
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
