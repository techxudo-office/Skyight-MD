import React, { useEffect, useState } from "react";
import {
  SecondaryButton,
  ConfirmModal,
  Table,
  Switch,
  Searchbar,
} from "../../components/components";
import { MdAdd, MdEditSquare, MdAutoDelete } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
  CardLayoutFooter,
} from "../../components/CardLayout/CardLayout";
import { errorToastify } from "../../helper/toast";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteUser,
  getCompanyUsers,
  getUsers,
} from "../../_core/features/userSlice";
import EditUserModal from "./EditUserModal/EditUserModal";

const Users = ({ isCompanyUser }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { companyId } = useParams();
  const [deleteId, setDeleteId] = useState(null);
  const [modalStatus, setModalStatus] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [editUserData, setEditUserData] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { adminData } = useSelector((state) => state.auth);
  const {
    users,
    isLoadingUsers,
    isDeletingUser,
    companyUsers,
    isLoadingCompanyUsers,
  } = useSelector((state) => state.user);

  const userColumns = [
    {
      name: "USER ID",
      selector: (row) => row?.id,
      sortable: false,

    },
    {
      name: "FIRST NAME",
      selector: (row) => row?.first_name,
      sortable: false,

    },
    {
      name: "LAST NAME",
      selector: (row) => row?.last_name,
      sortable: false,

    },
    {
      name: "EMAIL",
      selector: (row) => row?.email,
      sortable: false,

    },
    {
      name: "ROLE",
      selector: (row) => row?.role?.role,
      sortable: false,

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
          <span
            className="text-xl cursor-pointer"
            onClick={() => {
              setModalStatus(true);
              setDeleteId(row.id);
            }}
          >
            <MdAutoDelete title="Delete" className="text-red-500" />
          </span>
        </div>
      ),
      sortable: false,

    },
  ];

  const navigationHandler = () => {
    navigate("/dashboard/create-user");
  };

  const deleteUserHandler = () => {
    if (!deleteId) {
      errorToastify("Failed to delete this user");
      setModalStatus(false);
      return;
    }

    dispatch(deleteUser({ id: deleteId, token: adminData?.token })).then(() => {
      setModalStatus(false);
      setDeleteId(null);
    });
  };

  const abortDeleteHandler = () => {
    setModalStatus(false);
    setDeleteId(null);
  };

  useEffect(() => {
    if (!adminData?.token) return;

    const action = isCompanyUser
      ? getCompanyUsers({ token: adminData.token, id: companyId })
      : getUsers(adminData.token);

    dispatch(action);
  }, [dispatch, adminData?.token, companyId, isCompanyUser]);

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
          heading={isCompanyUser ? "Company Users" : "Users"}
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
          <Searchbar data={isCompanyUser ? companyUsers : users} onFilteredData={setFilteredUsers} />
          <Table
            pagination={true}
            columnsData={userColumns}
            tableData={filteredUsers}
            progressPending={
              isCompanyUser ? isLoadingCompanyUsers : isLoadingUsers
            }
            paginationTotalRows={
              filteredUsers.length
            }
            paginationComponentOptions={{ noRowsPerPage: "10" }}
          />
        </CardLayoutBody>
        <CardLayoutFooter></CardLayoutFooter>
      </CardLayoutContainer>
    </>
  );
};

export default Users;
