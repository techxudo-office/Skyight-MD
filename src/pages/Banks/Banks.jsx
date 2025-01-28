import React, { useEffect, useState } from "react";
import {
  Table,
  SecondaryButton,
  ConfirmModal,
} from "../../components/components";
import { getBanks,deleteBank  } from "../../utils/api_handler";
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
import { baseUrl, getToken} from "../../utils/api_handler";

const Banks = () => {
  const navigate = useNavigate();

  const navigationHandler = () => {
    navigate("/dashboard/create-bank");
  };

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

  const gettingBanks = async () => {
    let response = await axios({
      method: "GET",
      url: `${baseUrl}/api/bank`,
      headers: {
        Authorization: getToken(),
      },
    });
    console.log(response.data.data);
    setBanksData(response.data.data);
    return response.data;
  };

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
    gettingBanks();
  }, []);

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
            columns={columnsData}
            data={banksData}
            actions={actionsData}
          />
        </CardLayoutBody>
        <CardLayoutFooter></CardLayoutFooter>
      </CardLayoutContainer>
    </>
  );
};

export default Banks;
