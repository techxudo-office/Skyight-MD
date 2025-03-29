import React, { useEffect, useState } from "react";
import {
  SecondaryButton,
  ConfirmModal,
  Table,
} from "../../components/components";
import { MdAdd, MdEditSquare, MdAutoDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
  CardLayoutFooter,
} from "../../components/CardLayout/CardLayout";
import { useDispatch, useSelector } from "react-redux";
import EditUserModal from "./EditUserModal/EditUserModal";
import { getAdmins } from "../../_core/features/adminSlice";

const Admin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [deleteId, setDeleteId] = useState(null);
  const [modalStatus, setModalStatus] = useState(false);
  const [editUserData, setEditUserData] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { userData } = useSelector((state) => state.auth);
  const { admins, isLoadingAdmins } = useSelector((state) => state.admin);

  const adminColumns = [
    {
      name: "ADMIN ID",
      selector: (row) => row?.id,
      sortable: false,
      minwidth: "150px",
      center: true,
    },
    {
      name: "FULL NAME",
      selector: (row) => row?.full_name,
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
      selector: (row) => row?.role?.role,
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
            }}
          >
            <MdEditSquare title="Edit" className="text-blue-500" />
          </span>
          {/* <span
            className="text-xl cursor-pointer"
            onClick={() => {
              setModalStatus(true);
              setDeleteId(row.id);
            }}
          >
            <MdAutoDelete title="Delete" className="text-red-500" />
          </span> */}
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

  // const deleteUserHandler = () => {
  //   console.log(deleteId, "deleteId TABLE");
  //   if (!deleteId) {
  //     errorToastify("Failed to delete this user");
  //     setModalStatus(false);
  //     return;
  //   }

  //   dispatch(deleteUser({ id: deleteId, token: userData?.token })).then(() => {
  //     setModalStatus(false);
  //     setDeleteId(null);
  //   });
  // };

  // const abortDeleteHandler = () => {
  //   setModalStatus(false);
  //   setDeleteId(null);
  // };

  useEffect(() => {
    dispatch(getAdmins(userData?.token));
  }, []);

  useEffect(() => {
    console.log(admins)
  }, [admins]);

  return (
    <>
      {/* <ConfirmModal
        status={modalStatus}
        loading={isDeletingUser}
        onAbort={abortDeleteHandler}
        onConfirm={deleteUserHandler}
      /> */}
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
          heading={"Admins"}
          className="flex items-center justify-between"
        >
          <div className="relative">
            <SecondaryButton
              icon={<MdAdd />}
              text={"Create New Admin"}
              onClick={navigationHandler}
            />
          </div>
        </CardLayoutHeader>
        <CardLayoutBody removeBorder={true}>
          <Table
            pagination={true}
            columnsData={adminColumns}
            tableData={admins}
            progressPending={isLoadingAdmins}
            paginationTotalRows={admins?.length}
            paginationComponentOptions={{ noRowsPerPage: "10" }}
          />
        </CardLayoutBody>
        <CardLayoutFooter></CardLayoutFooter>
      </CardLayoutContainer>
    </>
  );
};

export default Admin;
