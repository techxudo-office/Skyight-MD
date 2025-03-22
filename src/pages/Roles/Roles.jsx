import React, { useEffect, useState } from "react";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
} from "../../components/CardLayout/CardLayout";
import { MdEditSquare } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import { MdAutoDelete } from "react-icons/md";

import {
  ConfirmModal,
  SecondaryButton,
  Table,
  Tag,
} from "../../components/components";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteRole, getRoles } from "../../_core/features/roleSlice";
import EditRoleModal from "./EditRoleModal/EditRoleModal";

const Roles = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [deleteId, setDeleteId] = useState(null);
  const [modalStatus, setModalStatus] = useState(false);
  const [editRoleData, setEditRoleData] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { roles, isLoadingRoles, isDeletingRole } = useSelector(
    (state) => state.role
  );
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    dispatch(getRoles(userData?.token));
  }, [dispatch, userData?.token]);

  useEffect(() => {
    console.log(roles, "roles");
  }, [roles]);

  const roleColumns = [
    {
      name: "ROLE",
      selector: (row) => row.role,
      sortable: false,
      minwidth: "150px",
      center: true,
    },
    {
      name: "ROLE ID",
      selector: (row) => row.id,
      sortable: false,
      minwidth: "150px",
      center: true,
    },
    {
      name: "STATUS",
      selector: (row) => <Tag value={row.status} />,
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
              console.log(row, "Row");
              setEditRoleData(row);
              setIsEditModalOpen(true);
            }}>
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

  // const deleteUserHandler = () => {
  //   console.log(deleteId, "deleteId TABLE");
  //   if (!deleteId) {
  //     errorToastify("Failed to delete this user");
  //     setModalStatus(false);
  //     return;
  //   }

  //   dispatch(deleteRole({ id: deleteId, token: userData?.token })).then(() => {
  //     setModalStatus(false);
  //     setDeleteId(null);
  //   });
  // };

  // const abortDeleteHandler = () => {
  //   setModalStatus(false);
  //   setDeleteId(null);
  // };

  return (
    <>
      {/* <ConfirmModal
        status={modalStatus}
        loading={isDeletingRole}
        onAbort={abortDeleteHandler}
        onConfirm={deleteUserHandler}
      /> */}
      {isEditModalOpen && (
        <EditRoleModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          roleData={editRoleData}
        />
      )}
      <CardLayoutContainer removeBg={true}>
        <CardLayoutHeader
          removeBorder={true}
          heading={"Roles"}
          className="flex items-center justify-between">
          <div className="relative">
            <SecondaryButton
              text={"Create New Role"}
              icon={<FaPlus />}
              onClick={() => {
                navigate("/dashboard/create-role");
              }}
              className="mb-4"
            />
          </div>
        </CardLayoutHeader>
        <CardLayoutBody removeBorder={true}>
          <Table
            pagination={true}
            columnsData={roleColumns}
            tableData={roles || []}
            progressPending={isLoadingRoles}
            paginationTotalRows={roles.length}
            paginationComponentOptions={{ noRowsPerPage: "10" }}
          />
        </CardLayoutBody>
      </CardLayoutContainer>
    </>
  );
};

export default Roles;
