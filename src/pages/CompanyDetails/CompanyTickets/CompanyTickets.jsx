import React, { useEffect, useState } from "react";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
} from "../../../components/CardLayout/CardLayout";
import dayjs from "dayjs";
import { FaEye } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCompanyTickets } from "../../../_core/features/companySlice";
import {
  Table,
  ModalWrapper,
  Button,
  Tag,
  Searchbar,
} from "../../../components/components";

const CompanyTickets = () => {
  const dispatch = useDispatch();
  const { companyId } = useParams();
  const [modal, setModal] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [filteredTickets, setFilteredTickets] = useState([])
  const { adminData } = useSelector((state) => state.persist);
  const { companyTickets, isLoadingCompanyTickets } = useSelector(
    (state) => state.company
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
      name: "TITLE",
      selector: (row) => row.title,
      sortable: false,

    },
    {
      name: "DESCRIPTION",
      selector: (row) => row.description,
      sortable: false,

    },
    {
      name: "Date",
      selector: (row) => dayjs(row.created_at).format("DD-MMM-YYYY"),
      sortable: false,

      grow: 2,
    },
    {
      name: "STATUS",
      selector: (row) => <Tag value={row.status} />,
      sortable: false,

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

    },
  ];

  useEffect(() => {
    if (adminData?.token) {
      dispatch(getCompanyTickets({ token: adminData?.token, id: companyId }));
    }
  }, []);

  return (
    <>
      <CardLayoutContainer removeBg={true}>
        <CardLayoutHeader
          removeBorder={true}
          heading={"Company Tickets"}
          className="flex items-center justify-between"
        />
        <CardLayoutBody removeBorder={true}>
          <Searchbar data={companyTickets} onFilteredData={setFilteredTickets} searchFields={["title", "status", "created_at"]} />
          <Table
            pagination={true}
            columnsData={columns}
            tableData={filteredTickets || []}
            progressPending={isLoadingCompanyTickets}
            paginationTotalRows={filteredTickets?.length}
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

export default CompanyTickets;
