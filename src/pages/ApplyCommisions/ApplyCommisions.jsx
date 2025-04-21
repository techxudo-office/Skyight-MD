import React, { useEffect, useState } from "react";
import { Table, CustomTooltip } from "../../components/components";
import { MdEditSquare } from "react-icons/md";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
} from "../../components/CardLayout/CardLayout";
import { useDispatch, useSelector } from "react-redux";
import { getCommision } from "../../_core/features/commisionSlice";
import EditCommisionModal from "./EditCommisionModal/EditCommisionModal";

const ApplyCommisions = () => {
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
      wrap: true,
      grow: 2,
    },
    {
      name: "AED",
      selector: (row) => row.AED,
      sortable: false,
      grow: 1,
    },
    {
      name: "EUR",
      selector: (row) => row.EUR,
      sortable: false,
      grow: 1,
    },
    {
      name: "IQD",
      selector: (row) => row.IQD,
      sortable: false,
      grow: 1,
    },
    {
      name: "IRR",
      selector: (row) => row.IRR,
      sortable: false,
      grow: 1,
    },
    {
      name: "PKR",
      selector: (row) => row.PKR,
      sortable: false,
      grow: 1,
    },
    {
      name: "SAR",
      selector: (row) => row.SAR,
      sortable: false,
      grow: 1,
    },
    {
      name: "TRY",
      selector: (row) => row.TRY,
      sortable: false,
      grow: 1,
    },
    {
      name: "USD",
      selector: (row) => row.USD,
      sortable: false,
      grow: 1,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: false,
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
      <CardLayoutContainer removeBg={true} className={""}>
        <CardLayoutHeader
          removeBorder={true}
          heading={"Apply Commisions"}
          className="flex items-center justify-between"
        />
        <CardLayoutBody removeBorder={true} className={"overflow-x-auto w-[900px] mx-auto "}>
          <Table
            columnsData={columns}
            tableData={[commisions] || []}
            progressPending={isLoadingCommision}
            paginationTotalRows={commisions?.length}
            paginationComponentOptions={{ noRowsPerPage: "10" }}
          />

        </CardLayoutBody>
      </CardLayoutContainer>
    </div>
  );
};

export default ApplyCommisions;
