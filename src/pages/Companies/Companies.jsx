import { useEffect, useState } from "react";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
} from "../../components/CardLayout/CardLayout";
import { useNavigate } from "react-router-dom";

import Tag from "../../components/Tag/Tag";
import Table from "../../components/Table/Table";
import Searchbar from "../../components/Searchbar/Searchbar";
import CustomTooltip from "../../components/CustomTooltip/CustomTooltip";
import { getCompanies } from "../../_core/features/companySlice";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { FaEye } from "react-icons/fa";
import useLogout from "../../hooks/useLogout";

const Companies = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logoutHandler = useLogout();
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const { adminData } = useSelector((state) => state.persist);
  const { companies, isLoadingCompanies } = useSelector(
    (state) => state.company
  );

  useEffect(() => {
    if (adminData?.token) {
      dispatch(getCompanies({ token: adminData.token, logoutHandler }));
    }
  }, [dispatch, adminData?.token]);

  const companiesColumns = [
    {
      name: "NAME",
      selector: (row) => row.name,
      sortable: false,
    },
    // {
    //   name: "ID",
    //   selector: (row) => row.id,
    //   sortable: false,
    // },
    {
      name: "STATUS",
      selector: (row) => <Tag value={row.is_deleted ? "inactive" : "active"} />,
      sortable: false,
    },
    {
      name: "CREATED AT",
      selector: (row) => dayjs(row.created_at).format("ddd-DD-MMM-YYYY"),
      sortable: false,
    },
    {
      name: "WEBSITE",
      selector: (row) => row.website,
      sortable: false,
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
    },
  ];

  return (
    <>
      <CardLayoutContainer removeBg={true}>
        <CardLayoutHeader
          removeBorder={true}
          heading={"Companies"}
          className="flex items-center justify-between"
        ></CardLayoutHeader>
        <CardLayoutBody removeBorder={true}>
          <Searchbar
            data={companies}
            onFilteredData={setFilteredCompanies}
            searchFields={["name"]}
          />
          <Table
            pagination={true}
            columnsData={companiesColumns}
            tableData={filteredCompanies || []}
            progressPending={isLoadingCompanies}
            paginationTotalRows={filteredCompanies?.length}
            paginationComponentOptions={{ noRowsPerPage: "10" }}
          />
        </CardLayoutBody>
      </CardLayoutContainer>
    </>
  );
};

export default Companies;
