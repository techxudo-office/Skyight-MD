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
//   const { adminData } = useSelector((state) => state.auth);
//   const { settingData, isSettingLoading, errorSetting } = useSelector(
//     (state) => state.setting
//   );

//   useEffect(() => {
//     dispatch(getSetting(adminData?.token));
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
import { getBanks } from "../../_core/features/bankSlice";
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
import { getCommision } from "../../_core/features/commisionSlice";
import EditCommisionModal from "./EditCommisionModal/EditCommisionModal";

const ApplyCommisions = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { adminData } = useSelector((state) => state.auth);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { commisions, isLoadingCommision } = useSelector(
    (state) => state.commision
  );

  useEffect(() => {
    if (adminData?.token) {
      dispatch(getCommision(adminData?.token));
    }
  }, [adminData?.token]);

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
        <CustomTooltip content={"Edit"}>
          <MdEditSquare
            className="text-base cursor-pointer text-primary"
            onClick={() => setIsEditModalOpen(true)}
          />
        </CustomTooltip>
      ),
    },
  ];

  return (
    <div className="">
      {isEditModalOpen && (
        <EditCommisionModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
      <CardLayoutContainer removeBg={true}>
        <CardLayoutHeader
          removeBorder={true}
          heading={"Apply Commisions"}
          className="flex items-center justify-between"
        />
        <CardLayoutBody removeBorder={true}>
          <Table
            columnsData={columns}
            tableData={[commisions] || []}
            progressPending={isLoadingCommision}
            paginationTotalRows={commisions?.length}
            paginationComponentOptions={{ noRowsPerPage: "10" }}
          />
        </CardLayoutBody>
        <CardLayoutFooter></CardLayoutFooter>
      </CardLayoutContainer>
    </div>
  );
};

export default ApplyCommisions;
