import React, { useEffect, useState } from "react";
import {
  Button,
  ModalWrapper,
  SecondaryButton,
  Table,
  Tag,
} from "../../components/components";
import { FaEye } from "react-icons/fa";
import { MdAdd } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
  CardLayoutFooter,
} from "../../components/CardLayout/CardLayout";
import { getTransactions } from "../../_core/features/transactionSlice";
import { useDispatch, useSelector } from "react-redux";
import "./Transaction.css";
import dayjs from "dayjs";

const Transactions = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { userData } = useSelector((state) => state.auth);
  const { transactions, isLoadingTransactions } = useSelector(
    (state) => state.transaction
  );
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    dispatch(getTransactions(userData?.token));
  }, [dispatch, userData?.token]);

  const handleView = (row) => {
    setSelectedTransaction(row);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  const columns = [
    {
      name: "BANK",
      selector: (row) => row.bank_name,
      sortable: false,
      minwidth: "150px",
      center: true,
    },
    {
      name: "BANK NO.",
      selector: (row) => row.bank_number,
      sortable: false,
      center: true,
    },
    {
      name: "PAYMENT DATE",
      selector: (row) => dayjs(row.payment_date).format("ddd-DD-MMM-YYYY"),
      sortable: false,
      center: true,
    },
    {
      name: "AMOUNT",
      selector: (row) => row.amount,
      sortable: false,
      center: true,
    },
    {
      name: "STATUS",
      selector: (row) => <Tag value={row.status} />,
      sortable: false,
      center: true,
      wrap: true,
      grow: 2,
    },
    {
      name: "",
      selector: (row) => (
        <span
          className="text-xl cursor-pointer"
          onClick={() => handleView(row)}>
          <FaEye title="View" className="text-green-500" />
        </span>
      ),
      sortable: false,
      center: true,
    },
  ];

  return (
    <>
      <CardLayoutContainer removeBg={true}>
        <CardLayoutHeader
          removeBorder={true}
          heading={"Transactions"}
          className="flex items-center justify-between">
          <div className="relative">
            <SecondaryButton
              text={"Create New Transaction"}
              icon={<MdAdd />}
              onClick={() => navigate("/dashboard/create-transaction")}
            />
          </div>
        </CardLayoutHeader>

        <CardLayoutBody removeBorder={true}>
          <Table
            pagination={true}
            columnsData={columns}
            tableData={transactions || []}
            progressPending={isLoadingTransactions}
            paginationTotalRows={transactions.length}
            paginationComponentOptions={{ noRowsPerPage: "10" }}
          />
        </CardLayoutBody>

        <CardLayoutFooter />
      </CardLayoutContainer>
      <ModalWrapper
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Transaction Details">
        {selectedTransaction && (
          <div className="p-6 bg-white shadow-lg rounded-lg border border-gray-300 max-w-md mx-auto">
            <h2 className="mb-4 text-2xl font-bold text-center border-b pb-2">
              Transaction Invoice
            </h2>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-600">Transaction ID:</span>
              <span className="font-semibold">
                {selectedTransaction?.id || "N/A"}
              </span>
            </div>
            <img
              src={selectedTransaction?.document_url}
              alt="Document"
              className="object-cover w-full h-40 mb-4 rounded-md border"
            />
            <div className="space-y-2 text-sm">
              <p>
                <strong className="text-text">Bank Holder Name:</strong>{" "}
                <span className="font-medium">
                  {selectedTransaction?.account_holder_name}
                </span>
              </p>
              <p>
                <strong className="text-text">Bank number:</strong>{" "}
                <span className="font-medium">
                  {selectedTransaction?.bank_number}
                </span>
              </p>
              <p>
                <strong className="text-text">Bank:</strong>{" "}
                <span className="font-medium">
                  {selectedTransaction?.bank_name}
                </span>
              </p>
              <p>
                <strong className="text-text">Comment:</strong>{" "}
                <span className="font-medium">
                  {selectedTransaction?.comment}
                </span>
              </p>
              <p>
                <strong className="text-text">Payment Date:</strong>{" "}
                <span className="font-medium">
                  {dayjs(selectedTransaction?.payment_date).format(
                    "DD-MMM-YYYY h:mm a"
                  )}
                </span>
              </p>
              <p>
                <strong className="text-text">Amount:</strong>{" "}
                <span className="font-medium text-greenColor">
                  ${selectedTransaction?.amount}
                </span>
              </p>
              <p></p>
              <p>
                <strong className="text-text">Status:</strong>{" "}
                <span
                  className={`font-medium px-2 py-1 rounded ${
                    selectedTransaction?.status === "Approved"
                      ? "bg-green-100 text-greenColor"
                      : "bg-red-100 text-redColor"
                  }`}>
                  {selectedTransaction?.status}
                </span>
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <Button
                onClick={closeModal}
                text="Close"
                className="hover:bg-primary bg-redColor text-white px-4 py-2 rounded-md"
              />
            </div>
          </div>
        )}
      </ModalWrapper>
    </>
  );
};

export default Transactions;
