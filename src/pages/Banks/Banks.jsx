import React, { useEffect, useState } from "react";
import {
  Table,
  SecondaryButton,
  ConfirmModal,
} from "../../components/components";
import { deleteBank } from "../../utils/api_handler";
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
import toast from "react-hot-toast";

// Import Libraries
import axios from "axios";

// Base URL
import { baseUrl, getToken } from "../../utils/api_handler";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";

const Banks = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const navigationHandler = () => {
    navigate("/dashboard/create-bank");
  };

  const { userData } = useSelector((state) => state.auth);
  const { banks, isLoadingBanks, banksError } = useSelector((state) => state.booking)

  const [banksData, setBanksData] = useState([]);
  const [modalStatus, setModalStatus] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const columnsData = [
    { columnName: "No.", fieldName: "no.", type: "no." },
    // { columnName: "ID", fieldName: "id", type: "id" },
    { columnName: "Bank", fieldName: "bank", type: "text" },
    { columnName: "Status", fieldName: "status", type: "status" },
    { columnName: "Actions", fieldName: "actions", type: "actions" },
  ];

  const actionsData = [
    {
      name: "Edit",
      icon: <MdEditSquare title="Edit" className="text-blue-500" />,
      handler: (index, item) => {
        navigate("/dashboard/update-bank", { state: item });
      },
    },
    {
      name: "Delete",
      icon: <MdAutoDelete title="Delete" className="text-red-500" />,
      handler: (_, item) => {
        setModalStatus(true);
        setDeleteId(item.id);
      },
    },
  ];

  // const gettingBanks = async () => {
  //   let response = await axios({
  //     method: "GET",
  //     url: `${baseUrl}/api/bank`,
  //     headers: {
  //       Authorization: getToken(),
  //     },
  //   });
  //   console.log(response.data.data);
  //   setBanksData(response.data.data);
  //   return response.data;
  // };

  const deleteBankHandler = async () => {
    if (!deleteId) {
      toast.error("Failed to delete this record");
      setModalStatus(false);
    } else {
      const response = await deleteBank(deleteId);
      if (response.status) {
        setBanksData(banksData.filter(({ id }) => id !== deleteId));
        setModalStatus(false);
        setDeleteId(null);
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    }
  };

  const abortDeleteHandler = () => {
    setModalStatus(false);
    setDeleteId(null);
  };

  useEffect(() => {
    dispatch(getBanks(userData?.token));
  }, []);
  console.log("banks", banks)

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
      selector: (row) => (row.bank
      ),
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
      <ConfirmModal
        status={modalStatus}
        abortDelete={abortDeleteHandler}
        deleteHandler={deleteBankHandler}
      />
      <CardLayoutContainer removeBg={true}>
        <CardLayoutHeader
          removeBorder={true}
          heading={"Banks"}
          className="flex justify-between items-center"
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

          />
        </CardLayoutBody>
        <CardLayoutFooter></CardLayoutFooter>
      </CardLayoutContainer>
    </>
  );
};

export default Banks;
