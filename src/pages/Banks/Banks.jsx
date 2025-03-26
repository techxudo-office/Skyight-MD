import React, { useEffect, useState } from "react";
import {
  Table,
  SecondaryButton,
  ConfirmModal,
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

const Banks = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const navigationHandler = () => {
    navigate("/dashboard/create-bank");
  };

  const { userData } = useSelector((state) => state.auth);
  const { banks, isLoadingBanks } = useSelector((state) => state.booking);

  useEffect(() => {
    dispatch(getBanks(userData?.token));
  }, []);

  const columns = [
    {
      name: "Id",
      selector: (row) => row.id,
      sortable: false,
      center: true,
      grow: 2,
    },
    {
      name: "Bank",
      selector: (row) => row.bank,
      sortable: false,
      center: true,
      wrap: true,
      grow: 4,
    },
    {
      name: "Date",
      selector: (row) => dayjs(row.created_at).format("DD-MMM-YYYY"),
      sortable: false,
      minwidth: "150px",
      center: true,
      grow: 2,
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
            tableData={banks || []}
            pagination={true}
            progressPending={isLoadingBanks}
            paginationTotalRows={banks?.length}
            paginationComponentOptions={{ noRowsPerPage: "10" }}
          />
        </CardLayoutBody>
        <CardLayoutFooter></CardLayoutFooter>
      </CardLayoutContainer>
    </>
  );
};

export default Banks;
