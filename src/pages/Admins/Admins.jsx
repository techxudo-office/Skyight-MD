import { useEffect, useState } from "react";
import Tag from "../../components/Tag/Tag";
import Table from "../../components/Table/Table";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import SecondaryButton from "../../components/SecondaryBtn/SecondaryBtn";
import { MdAdd, MdEditSquare, MdAutoDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
  CardLayoutFooter,
} from "../../components/CardLayout/CardLayout";
import useLogout from "../../hooks/useLogout";
import { useDispatch, useSelector } from "react-redux";
import EditAdminModal from "./EditAdminModal/EditAdminModal";
import { deleteAdmin, getAdmins } from "../../_core/features/adminSlice";
import toast from "react-hot-toast";

const Admin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logoutHandler = useLogout();
  const [deleteId, setDeleteId] = useState(null);
  const [modalStatus, setModalStatus] = useState(false);
  const [editAdminData, setEditAdminData] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { adminData } = useSelector((state) => state.persist);
  const { admins, isLoadingAdmins, isDeletingAdmin } = useSelector(
    (state) => state.admin
  );

  const navigationHandler = () => {
    navigate("/dashboard/create-admin");
  };

  const deleteUserHandler = () => {
    if (!deleteId) {
      toast.error("Failed to delete this user");
      setModalStatus(false);
      return;
    }

    dispatch(deleteAdmin({ id: deleteId, token: adminData?.token })).then(
      () => {
        setModalStatus(false);
        setDeleteId(null);
      }
    );
  };

  // Cancel delete modal
  const abortDeleteHandler = () => {
    setModalStatus(false);
    setDeleteId(null);
  };

  useEffect(() => {
    if (adminData?.token) {
      dispatch(getAdmins({ token: adminData.token, logoutHandler }));
    }
  }, []);

  const adminColumns = [
    {
      name: "FULL NAME",
      selector: (row) => row?.full_name,
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
      name: "STATUS",
      selector: (row) => <Tag value={row.is_active ? "active" : "inactive"} />,
      sortable: false,
    },
    {
      name: "", // Action buttons column (Edit & Delete)
      selector: (row) => {
        const isSuperAdmin = row?.role?.role === "Super Admin";

        return (
          <div className="flex items-center gap-x-4">
            {!isSuperAdmin && (
              <>
                {/* Edit Admin Button */}
                <span
                  className="text-xl cursor-pointer"
                  onClick={() => {
                    setEditAdminData(row);
                    setIsEditModalOpen(true);
                  }}
                >
                  <MdEditSquare title="Edit" className="text-blue-500" />
                </span>

                {/* Delete Admin Button */}
                <span
                  className="text-xl cursor-pointer"
                  onClick={() => {
                    setModalStatus(true);
                    setDeleteId(row.id);
                  }}
                >
                  <MdAutoDelete title="Delete" className="text-red-500" />
                </span>
              </>
            )}
          </div>
        );
      },
      sortable: false,
    },
  ];

  return (
    <>
      {/* Confirm Delete Modal */}
      <ConfirmModal
        status={modalStatus}
        loading={isDeletingAdmin}
        onAbort={abortDeleteHandler}
        onConfirm={deleteUserHandler}
        text={"Are you sure you want to delete this admin?"}
      />

      {/* Edit Admin Modal */}
      {isEditModalOpen && (
        <EditAdminModal
          data={editAdminData}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}

      {/* Page Layout */}
      <CardLayoutContainer removeBg={true}>
        {/* Header with "Create New Admin" button */}
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

        {/* Admin Table */}
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

        {/* Empty footer for consistent layout */}
        <CardLayoutFooter></CardLayoutFooter>
      </CardLayoutContainer>
    </>
  );
};

export default Admin;
