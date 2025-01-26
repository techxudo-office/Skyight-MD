import React, { useEffect, useState } from "react";
import {
  Table,
  SecondaryButton,
  ConfirmModal,
} from "../../components/components";
import { getAdmins, deleteAdmin } from "../../utils/api_handler";
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

const Admins = () => {
  const navigate = useNavigate();

  const navigationHandler = () => {
    navigate("/dashboard/create-admin");
  };

  const [adminsData, setAdminsData] = useState([]);
  const [modalStatus, setModalStatus] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const columnsData = [
    { columnName: "No.", fieldName: "no.", type: "no." },
    // { columnName: "ID", fieldName: "id", type: "id" },
    { columnName: "Full Name", fieldName: "full_name", type: "text" },
    { columnName: "Email", fieldName: "email", type: "text" },
    { columnName: "Role", fieldName: "role", type: "text" },
    // { columnName: "Status", fieldName: "is_active", type: "status" },
    { columnName: "Actions", fieldName: "actions", type: "actions" },
  ];

  const actionsData = [
    {
      name: "Edit",
      icon: <MdEditSquare title="Edit" className="text-blue-500" />,
      handler: (index, item) => {
        navigate("/dashboard/update-admin", { state: item });
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

  const gettingAdmins = async () => {
    const response = await getAdmins();
    if (response.status) {
      setAdminsData(response.data);
    }
  };

  const deleteAdminHandler = async () => {
    if (!deleteId) {
      toast.error("Failed to delete this record");
      setModalStatus(false);
    } else {
      const response = await deleteAdmin(deleteId);
      if (response.status) {
        setAdminsData(adminsData.filter(({ id }) => id !== deleteId));
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
    gettingAdmins();
  }, []);

  return (
    <>
      <ConfirmModal
        status={modalStatus}
        abortDelete={abortDeleteHandler}
        deleteHandler={deleteAdminHandler}
      />
      <CardLayoutContainer removeBg={true}>
        <CardLayoutHeader
          removeBorder={true}
          heading={"Admins"}
          className="flex justify-between items-center"
        >
          <div className="relative">
            <SecondaryButton
              text={"Create New Admin"}
              onClick={navigationHandler}
            />
          </div>
        </CardLayoutHeader>
        <CardLayoutBody removeBorder={true}>
          <Table
            columns={columnsData}
            data={adminsData}
            actions={actionsData}
          />
        </CardLayoutBody>
        <CardLayoutFooter></CardLayoutFooter>
      </CardLayoutContainer>
    </>
  );
};

export default Admins;
