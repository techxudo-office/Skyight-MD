import React, { useEffect, useState } from "react";
import {
  Table,
  SecondaryButton,
  ConfirmModal,
} from "../../components/components";
import { FaEye } from "react-icons/fa";
import { MdEditSquare } from "react-icons/md";
import { MdAutoDelete } from "react-icons/md";
import { FaRegCircleCheck } from "react-icons/fa6";

import { getTransactions, approvedTransaction } from "../../utils/api_handler";
import { useNavigate } from "react-router-dom";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
  CardLayoutFooter,
} from "../../components/CardLayout/CardLayout";
import toast from "react-hot-toast";

const Transactions = () => {
  const navigate = useNavigate();

  const navigationHandler = () => {
    navigate("/dashboard/transactions");
  };

  const [activeIndex, setActiveIndex] = useState(null);
  const [transactionsData, setTransactionsData] = useState([]);
  const [modalStatus, setModalStatus] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const columnsData = [
    { columnName: "No.", fieldName: "no.", type: "no." },
    { columnName: "Bank", fieldName: "bank_name", type: "text" },
    { columnName: "Bank No.", fieldName: "bank_number", type: "text" },
    { columnName: "Payment Date", fieldName: "payment_date", type: "text" },
    { columnName: "Amount", fieldName: "amount", type: "text" },
    { columnName: "Status", fieldName: "status", type: "status" },
    { columnName: "Actions", fieldName: "actions", type: "actions" },
  ];

  const viewColumns = [
    { columnName: "Transaction ID", fieldName: "id", type: "id" },
    { columnName: "Company", fieldName: "company_id", type: "id" },
    {
      columnName: "Document Number",
      fieldName: "document_number",
      type: "text",
    },
    { columnName: "Document", fieldName: "document_url", type: "img" },
    { columnName: "Comment", fieldName: "comment", type: "text" },
    { columnName: "Reasons", fieldName: "reasonIds", type: "text" },
    {
      columnName: "Account Holder Name",
      fieldName: "account_holder_name",
      type: "text",
    },
  ];

  const actionsData = [
    {
      name: "View",
      icon: <FaEye title="View" className="text-green-500" />,
      handler: (index) => {
        if (activeIndex === index) {
          setActiveIndex(null);
        } else setActiveIndex(index);
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
    {
      name: "Rights",
      icon: (
        <FaRegCircleCheck title="Rights" className="text-blue-500 text-sm" />
      ),
      handler: (_, item) => {
        approvedTransactionHandler(item);
      },
    },
  ];

  const gettingTransactions = async () => {
    const response = await getTransactions();
    if (response.status) {
      setTransactionsData(response.data);
    }
  };

  const deleteReasonHandler = async () => {
    if (!deleteId) {
      toast.error("Failed to delete this record");
      setModalStatus(false);
    } else {
      const response = await deleteReason(deleteId);
      if (response.status) {
        setTransactionsData(
          transactionsData.filter(({ id }) => id !== deleteId)
        );
        setModalStatus(false);
        setDeleteId(null);
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    }
  };

  const approvedTransactionHandler = async (item) => {
    let payload = {
      bank_name: item.bank_name,
      status: "approved",
      credit: Number(item.amount),
      company_id: item.company_id,
      transaction_id: item.id,
      reasonIds: [45],
    };

    let response = await approvedTransaction(payload);
    console.log(response);
    if (response.status) {
      toast.success(response.message);
    } else {
      toast.error(response.error);
    }
  };

  const abortDeleteHandler = () => {
    setModalStatus(false);
    setDeleteId(null);
  };

  useEffect(() => {
    gettingTransactions();
  }, []);

  return (
    <>
      <ConfirmModal
        status={modalStatus}
        abortDelete={abortDeleteHandler}
        deleteHandler={deleteReasonHandler}
      />
      <CardLayoutContainer removeBg={true}>
        <CardLayoutHeader
          removeBorder={true}
          heading={"Transactions"}
          className="flex justify-between items-center"
        >
          <div className="relative">
            <SecondaryButton
              text={"Create New Transaction"}
              onClick={navigationHandler}
            />
          </div>
        </CardLayoutHeader>
        <CardLayoutBody removeBorder={true}>
          <Table
            columns={columnsData}
            viewColumns={viewColumns}
            data={transactionsData}
            actions={actionsData}
            activeIndex={activeIndex}
          />
        </CardLayoutBody>
        <CardLayoutFooter></CardLayoutFooter>
      </CardLayoutContainer>
    </>
  );
};

export default Transactions;
