// import React, { useEffect, useState } from "react";
// import { Table } from "../../components/components";
// import { MdEditSquare } from "react-icons/md";
// import { useNavigate } from "react-router-dom";
// import {
//   CardLayoutContainer,
//   CardLayoutHeader,
//   CardLayoutBody,
//   CardLayoutFooter,
// } from "../../components/CardLayout/CardLayout";
// import { useDispatch, useSelector } from "react-redux";
// import { getSetting } from "../../_core/features/settingSlice";

// const ApplyCommisions = () => {
//   const navigate = useNavigate();

//   const columnsData = [
//     { columnName: "No.", fieldName: "no.", type: "no." },
//     { columnName: "Commission", fieldName: "commission", type: "text" },
//     { columnName: "AED", fieldName: "AED", type: "text" },
//     { columnName: "EUR", fieldName: "EUR", type: "text" },
//     { columnName: "IQD", fieldName: "IQD", type: "text" },
//     { columnName: "IRR", fieldName: "IRR", type: "text" },
//     { columnName: "PKR", fieldName: "PKR", type: "text" },
//     { columnName: "SAR", fieldName: "SAR", type: "text" },
//     { columnName: "TRY", fieldName: "TRY", type: "text" },
//     { columnName: "USD", fieldName: "USD", type: "text" },
//     { columnName: "Status", fieldName: "status", type: "status" },
//     { columnName: "Actions", fieldName: "actions", type: "actions" },
//   ];

//   const actionsData = [
//     {
//       name: "Edit",
//       icon: <MdEditSquare title="Edit" className="text-blue-500" />,
//       handler: (index, item) => {
//         navigate("/dashboard/update-setting", { state: item });
//       },
//     },
//   ];

//   const dispatch = useDispatch();
//   const { userData } = useSelector((state) => state.auth);
//   const { settingData, isSettingLoading, errorSetting } = useSelector(
//     (state) => state.setting
//   );

//   useEffect(() => {
//     dispatch(getSetting(userData?.token));
//   }, [dispatch]);

//   return (
//     <>
//       <CardLayoutContainer removeBg={true}>
//         <CardLayoutHeader removeBorder={true} heading={"Apply Commisions"} />
//         <CardLayoutBody removeBorder={true}>
//           <Table
//             columns={columnsData}
//             data={settingData || []}
//             actions={actionsData}
//           />
//         </CardLayoutBody>
//         <CardLayoutFooter></CardLayoutFooter>
//       </CardLayoutContainer>
//     </>
//   );
// };

// export default ApplyCommisions;

import React, { useEffect, useState } from "react";
import {
  Table,
  SecondaryButton,
  ConfirmModal,
  CustomTooltip,
} from "../../components/components";
import { getBanks } from "../../_core/features/bookingSlice";
import { MdEditSquare } from "react-icons/md";
import { MdAutoDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
  CardLayoutFooter,
} from "../../components/CardLayout/CardLayout";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { getCommision } from "../../_core/features/commisionSlice";

const ApplyCommisions = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const navigationHandler = () => {
    navigate("/dashboard/create-bank");
  };

  const { userData } = useSelector((state) => state.auth);
  const { commisions, isLoadingCommission } = useSelector(
    (state) => state.commision
  );

  useEffect(() => {
    dispatch(getCommision(userData?.token));
  }, []);

  useEffect(() => {
    console.log(commisions);
  }, [commisions]);

  const columns = [
    {
      name: "Commission",
      selector: (row) => row.commission,
      sortable: false,
      center: true,
      wrap: true,
      grow: 2,
    },
    {
      name: "AED",
      selector: (row) => row.AED,
      sortable: false,
      center: true,
      grow: 1,
    },
    {
      name: "EUR",
      selector: (row) => row.EUR,
      sortable: false,
      center: true,
      grow: 1,
    },
    {
      name: "IQD",
      selector: (row) => row.IQD,
      sortable: false,
      center: true,
      grow: 1,
    },
    {
      name: "IRR",
      selector: (row) => row.IRR,
      sortable: false,
      center: true,
      grow: 1,
    },
    {
      name: "PKR",
      selector: (row) => row.PKR,
      sortable: false,
      center: true,
      grow: 1,
    },
    {
      name: "SAR",
      selector: (row) => row.SAR,
      sortable: false,
      center: true,
      grow: 1,
    },
    {
      name: "TRY",
      selector: (row) => row.TRY,
      sortable: false,
      center: true,
      grow: 1,
    },
    {
      name: "USD",
      selector: (row) => row.USD,
      sortable: false,
      center: true,
      grow: 1,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: false,
      center: true,
      grow: 2,
      cell: (row) => (
        <CustomTooltip content={"Details"}>
          <MdEditSquare
            className="text-lg cursor-pointer text-greenColor"
            onClick={() => {
              // navigate(`/dashboard/company/details/${row.id}`);
            }}
          />
        </CustomTooltip>
      ),
    },
  ];

  return (
    <>
      <CardLayoutContainer removeBg={true}>
        <CardLayoutHeader
          removeBorder={true}
          heading={"Banks"}
          className="flex items-center justify-between"
        >
          <div className="relative">
            <SecondaryButton
              text={"Create New Bank"}
              onClick={navigationHandler}
            />
          </div>
        </CardLayoutHeader>
        <CardLayoutBody removeBorder={true}>
          <Table
            columnsData={columns}
            tableData={[commisions] || []}
            progressPending={isLoadingCommission}
            paginationTotalRows={commisions?.length}
            paginationComponentOptions={{ noRowsPerPage: "10" }}
          />
        </CardLayoutBody>
        <CardLayoutFooter></CardLayoutFooter>
      </CardLayoutContainer>
    </>
  );
};

export default ApplyCommisions;
