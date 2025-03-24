import React, { useEffect, useState } from "react";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
} from "../../components/CardLayout/CardLayout";
import { MdEditSquare } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";

import { SecondaryButton, Table, Tag } from "../../components/components";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getRoles } from "../../_core/features/roleSlice";
const CompanyDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { roles, isLoadingRoles, isDeletingRole } = useSelector(
    (state) => state.role
  );
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    dispatch(getRoles(userData?.token));
  }, [dispatch, userData?.token]);

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
      selector: (row) => <Tag value={row.is_deleted ? "inactive" : "active"} />,
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
            }}
          >
            <MdEditSquare title="Edit" className="text-blue-500" />
          </span>
        </div>
      ),
      sortable: false,
      minwidth: "150px",
      center: true,
    },
  ];

  return (
    <>
      <CardLayoutContainer removeBg={true}>
        <CardLayoutHeader
          removeBorder={true}
          heading={"Company Details"}
          className="flex items-center justify-between"
        >
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

export default CompanyDetails;
