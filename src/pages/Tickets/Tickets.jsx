import React, { useEffect, useState } from "react";
import {
  Table,
  SecondaryButton,
  ConfirmModal,
} from "../../components/components";
import { getTickets,deleteTicket  } from "../../utils/api_handler";
import { MdEditSquare } from "react-icons/md";
import { MdAutoDelete } from "react-icons/md";

import { useNavigate } from "react-router-dom";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
  CardLayoutFooter,
} from "../../components/CardLayout/CardLayout";
import toast from "react-hot-toast";

const Tickets = () => {
  const navigate = useNavigate();

  const navigationHandler = () => {
    navigate("/dashboard/create-ticket");
  };

  const [ticketsData, setTicketsData] = useState([]);
  const [modalStatus, setModalStatus] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const columnsData = [
    { columnName: "No.", fieldName: "no.", type: "no." },
    { columnName: "ID", fieldName: "id", type: "id" },
    { columnName: "Title", fieldName: "title", type: "text" },
    { columnName: "Description", fieldName: "description", type: "text" },
    { columnName: "Status", fieldName: "status", type: "status" },
    { columnName: "Actions", fieldName: "actions", type: "actions" },
  ];

  const actionsData = [
    {
      name: "Edit",
      icon: <MdEditSquare title="Edit" className="text-blue-500" />,
      handler: (index, item) => {
        navigate("/dashboard/update-ticket", { state: item });
      },
    },
    {
      name: "Delete",
      icon: <MdAutoDelete title="Delete" className="text-red-500" />,
      handler: (_, item) => {
        setModalStatus(true);
        setDeleteId(item.id);
      },
    },
  ];

  const gettingTickets = async () => {
    const response = await getTickets();
    if (response.status) {
      setTicketsData(response.data);
    }
  };

  const deleteTicketHandler = async () => {
    if (!deleteId) {
      toast.error("Failed to delete this record");
      setModalStatus(false);
    } else {
      const response = await deleteTicket(deleteId);
      if (response.status) {
        setTicketsData(ticketsData.filter(({ id }) => id !== deleteId));
        setModalStatus(false);
        setDeleteId(null);
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    }
  };

  const abortDeleteHandler = () => {
    setModalStatus(false);
    setDeleteId(null);
  };

  useEffect(() => {
    gettingTickets();
  }, []);

  return (
    <>
      <ConfirmModal
        status={modalStatus}
        abortDelete={abortDeleteHandler}
        deleteHandler={deleteTicketHandler}
      />
      <CardLayoutContainer removeBg={true}>
        <CardLayoutHeader
          removeBorder={true}
          heading={"Tickets"}
          className="flex justify-between items-center"
        >
          <div className="relative">
            <SecondaryButton
              text={"Create New Ticket"}
              onClick={navigationHandler}
            />
          </div>
        </CardLayoutHeader>
        <CardLayoutBody removeBorder={true}>
          <Table
            columns={columnsData}
            data={ticketsData}
            actions={actionsData}
          />
        </CardLayoutBody>
        <CardLayoutFooter></CardLayoutFooter>
      </CardLayoutContainer>
    </>
  );
};

export default Tickets;
