import React, { useEffect, useState } from "react";
import {
  SecondaryButton,
  ConfirmModal,
  Table,
  Switch,
} from "../../components/components";
import { MdAdd, MdEditSquare, MdAutoDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
  CardLayoutFooter,
} from "../../components/CardLayout/CardLayout";
import { errorToastify } from "../../helper/toast";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, getUsers } from "../../_core/features/userSlice";
import EditUserModal from "./EditUserModal/EditUserModal";

const Users = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [deleteId, setDeleteId] = useState(null);
  const [modalStatus, setModalStatus] = useState(false);
  const [editUserData, setEditUserData] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { userData } = useSelector((state) => state.auth);
  const { users, isLoadingUsers, isDeletingUser } = useSelector(
    (state) => state.user
  );

  const userColumns = [
    {
      name: "USER ID",
      selector: (row) => row?.id,
      sortable: false,
      minwidth: "150px",
      center: true,
    },
    {
      name: "FIRST NAME",
      selector: (row) => row?.first_name,
      sortable: false,
      minwidth: "150px",
      center: true,
    },
    {
      name: "LAST NAME",
      selector: (row) => row?.last_name,
      sortable: false,
      minwidth: "150px",
      center: true,
    },
    {
      name: "EMAIL",
      selector: (row) => row?.email,
      sortable: false,
      minwidth: "150px",
      center: true,
    },
    {
      name: "ROLE",
      selector: (row) => row?.role?.name,
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
            onClick={() => {
              setEditUserData(row);
              setIsEditModalOpen(true);
            }}>
            <MdEditSquare title="Edit" className="text-blue-500" />
          </span>
          <span
            className="text-xl cursor-pointer"
            onClick={() => {
              setModalStatus(true);
              setDeleteId(row.id);
            }}>
            <MdAutoDelete title="Delete" className="text-red-500" />
          </span>
        </div>
      ),
      sortable: false,
      minwidth: "150px",
      center: true,
    },
  ];

  const navigationHandler = () => {
    navigate("/dashboard/create-user");
  };

  const deleteUserHandler = () => {
    console.log(deleteId, "deleteId TABLE");
    if (!deleteId) {
      errorToastify("Failed to delete this user");
      setModalStatus(false);
      return;
    }

    dispatch(deleteUser({ id: deleteId, token: userData?.token })).then(() => {
      setModalStatus(false);
      setDeleteId(null);
    });
  };

  const abortDeleteHandler = () => {
    setModalStatus(false);
    setDeleteId(null);
  };

  useEffect(() => {
    dispatch(getUsers(userData?.token));
  }, []);

  return (
    <>
      <ConfirmModal
        status={modalStatus}
        loading={isDeletingUser}
        onAbort={abortDeleteHandler}
        onConfirm={deleteUserHandler}
      />
      {isEditModalOpen && (
        <EditUserModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          usersData={editUserData}
        />
      )}
      <CardLayoutContainer removeBg={true}>
        <CardLayoutHeader
          removeBorder={true}
          heading={"Users"}
          className="flex items-center justify-between">
          <div className="relative">
            <SecondaryButton
              icon={<MdAdd />}
              text={"Create New User"}
              onClick={navigationHandler}
            />
          </div>
        </CardLayoutHeader>
        <CardLayoutBody removeBorder={true}>
          <Table
            pagination={true}
            columnsData={userColumns}
            tableData={users || []}
            progressPending={isLoadingUsers}
            paginationTotalRows={users.length}
            paginationComponentOptions={{ noRowsPerPage: "10" }}
          />
        </CardLayoutBody>
        <CardLayoutFooter></CardLayoutFooter>
      </CardLayoutContainer>
    </>
  );
};

export default Users;
