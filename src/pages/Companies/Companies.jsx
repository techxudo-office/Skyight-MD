import React, { useCallback, useEffect, useState } from "react";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
  CardLayoutFooter,
} from "../../components/CardLayout/CardLayout";
import { MdEditSquare } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import {
  Table,
  Dropdown,
  SecondaryButton,
  Tag,
} from "../../components/components";
import { getCompanies } from "../../_core/features/companySlice";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";

const Companies = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.auth);
  const { companies, isLoadingCompanies } = useSelector(
    (state) => state.company
  );

  const companiesColumns = [
    {
      name: "NAME",
      selector: (row) => row.name,
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
              navigate(`/dashboard/company/user/${row.id}`);
            }}
          >
            <p>Details</p>
          </span>
          <span
            className="text-xl cursor-pointer"
            onClick={() => {
              navigate(`/dashboard/company/user/${row.id}`);
            }}
          >
            <p>Users</p>
          </span>
        </div>
      ),
      sortable: false,
      minwidth: "150px",
      center: true,
    },
  ];

  useEffect(() => {
    dispatch(getCompanies(userData?.token));
  }, [dispatch, userData?.token]);

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
            tableData={companies || []}
            progressPending={isLoadingCompanies}
            paginationTotalRows={companies?.length}
            paginationComponentOptions={{ noRowsPerPage: "10" }}
          />
        </CardLayoutBody>
      </CardLayoutContainer>
    </>
  );
};

export default Companies;
