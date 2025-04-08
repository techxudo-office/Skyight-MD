import React, { useEffect } from "react";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
} from "../../components/CardLayout/CardLayout";
import { useNavigate } from "react-router-dom";

import { CustomTooltip, Table, Tag } from "../../components/components";
import { getCompanies } from "../../_core/features/companySlice";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { FaEye } from "react-icons/fa";

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
      name: "ID",
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
          <CustomTooltip content={"Details"}>
            <FaEye
              className="text-lg cursor-pointer text-greenColor"
              onClick={() => {
                navigate(`/dashboard/company/details/${row.id}`);
              }}
            />
          </CustomTooltip>
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
          heading={"Companies"}
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
