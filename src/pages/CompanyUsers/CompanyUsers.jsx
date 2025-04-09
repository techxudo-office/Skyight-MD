import React, { useCallback, useEffect, useState } from "react";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
} from "../../components/CardLayout/CardLayout";
import { MdEditSquare } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";

import { Table, Tag } from "../../components/components";
import { getCompanyUsers } from "../../_core/features/userSlice";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";

const Companies = () => {
  const { companyId } = useParams();
  const dispatch = useDispatch();
  const { adminData } = useSelector((state) => state.auth);
  const { companyUsers, isLoadingCompanyUsers } = useSelector(
    (state) => state.user
  );

  const companiesColumns = [
    {
      name: "NAME",
      selector: (row) => `${row.first_name} ${row.last_name}`,
      sortable: false,
      minwidth: "150px",
      center: true,
    },
    {
      name: "NAME",
      selector: (row) => `${row.first_name} ${row.last_name}`,
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
      name: "CREATED AT",
      selector: (row) => dayjs(row.created_at).format("ddd-DD-MMM-YYYY"),
      sortable: false,
      center: true,
    },
    {
      name: "WEBSITE",
      selector: (row) => row.website,
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

  useEffect(() => {
    if (companyId && adminData?.token) {
      dispatch(getCompanyUsers({ token: adminData?.token, id: companyId }));
    }
  }, [adminData?.token, companyId]);

  return (
    <>
      <CardLayoutContainer removeBg={true}>
        <CardLayoutHeader
          removeBorder={true}
          heading={"Roles"}
          className="flex items-center justify-between"
        ></CardLayoutHeader>
        <CardLayoutBody removeBorder={true}>
          <Table
            pagination={true}
            columnsData={companiesColumns}
            tableData={companyUsers || []}
            progressPending={isLoadingCompanyUsers}
            paginationTotalRows={companyUsers?.length}
            paginationComponentOptions={{ noRowsPerPage: "10" }}
          />
        </CardLayoutBody>
      </CardLayoutContainer>
    </>
  );
};

export default Companies;
