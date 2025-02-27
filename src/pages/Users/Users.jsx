import React, { useEffect, useState } from "react";
import {
  Table,
  SecondaryButton,
  ConfirmModal,
  TableNew,
} from "../../components/components";
import { getUsers, deleteUser } from "../../utils/api_handler";
import { MdAdd, MdEditSquare } from "react-icons/md";
import { MdAutoDelete } from "react-icons/md";

import { useNavigate } from "react-router-dom";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
  CardLayoutFooter,
} from "../../components/CardLayout/CardLayout";
import { userColumns } from "../../data/columns";
// import { successToastify, errorToastify } from "../../helper/toast";

const Users = () => {
  const navigate = useNavigate();

  const navigationHandler = () => {
    navigate("/dashboard/create-user");
  };

  const [usersData, setUsersData] = useState([]);
  const [modalStatus, setModalStatus] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const actionsData = [
    {
      name: "Edit",
      icon: <MdEditSquare title="Edit" className="text-blue-500" />,
      handler: (index, item) => {
        console.log("item", item);
        navigate("/dashboard/update-reason", { state: item });
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

  const gettingUsers = async () => {
    const response = await getUsers();
    console.log(response)
    setUsersData(response[0]);
  };

  const deleteUserHandler = async (idx) => {
    if (!idx) {
      errorToastify("Failed to delete this user");
      setModalStatus(false);
    } else {
      const response = await deleteUser(idx);
      if (response.status) {
        setUsersData(usersData.filter(({ id }) => id !== idx));
        setModalStatus(false);
        setDeleteId(null);
        // successToastify(response.message);
      } else {
        // errorToastify(response.message);
      }
    }
  };

  const abortDeleteHandler = () => {
    setModalStatus(false);
    setDeleteId(null);
  };

  useEffect(() => {
    gettingUsers();
  }, []);

  return (
    <>
      <ConfirmModal
        status={modalStatus}
        abortDelete={abortDeleteHandler}
        deleteHandler={deleteUserHandler}
      />
      <CardLayoutContainer removeBg={true}>
        <CardLayoutHeader
          removeBorder={true}
          heading={"Users"}
          className="flex items-center justify-between"
        >
          <div className="relative">
            <SecondaryButton
              icon={<MdAdd />}
              text={"Create New User"}
              onClick={navigationHandler}
            />
          </div>
        </CardLayoutHeader>
        <CardLayoutBody removeBorder={true}>
          <TableNew
            columnsToView={userColumns}
            tableData={usersData}
            // onDeleteUser={deleteUserHandler}
            actions={actionsData}
          />
        </CardLayoutBody>
        <CardLayoutFooter></CardLayoutFooter>
      </CardLayoutContainer>
    </>
  );
};

export default Users;
