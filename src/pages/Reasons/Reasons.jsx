import React, { useEffect, useState } from "react";
import {
  Table,
  SecondaryButton,
  ConfirmModal,
  Tag,
} from "../../components/components";
import { MdDelete, MdEditSquare } from "react-icons/md";
import { MdAutoDelete } from "react-icons/md";
import { getReasons, deleteReason } from "../../_core/features/reasonsSlice";
import { useNavigate } from "react-router-dom";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
  CardLayoutFooter,
} from "../../components/CardLayout/CardLayout";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";

const Reasons = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const { userData } = useSelector((state) => state.auth)
  const { reasons, isLoadingReasons, isLoadingDeleteReason, reasonsError } = useSelector((state) => state.reasons)
  console.log("reasons", reasons)
  const navigationHandler = () => {
    navigate("/dashboard/create-reason");
  };

  const [reasonsData, setReasonsData] = useState([]);
  const [modalObject, setModalObject] = useState({
    status: false,
    text: "",
    loading: false,
    onAbort: () => { },
    onConfirm: () => { }
  });
  const [deleteId, setDeleteId] = useState(null);

  const columns = [
    {
      name: "Created At",
      selector: (row) => dayjs(row.created_at).format("DD-MMM-YYYY"),
      sortable: false,
      center: true,
    },
    {
      name: "Reason",
      selector: (row) => row.reason,
      sortable: false,
      center: true,
    },
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: false,
      center: true,
      wrap: true,
    },
    {
      name: "",
      selector: (row) =>
        <button onClick={() => setModalObject({
          status: true,
          text: `Are you really Want to delete this reason of id ${row.id}`,
          loading: isLoadingDeleteReason,
          onAbort: () => setModalObject((prev) => ({ ...prev, status: false })),
          onConfirm: () => {
            dispatch(deleteReason({ token: userData.token, id: row.id }))
            setModalObject((prev) => ({ ...prev, status: false }))
          }

        })}>
          <MdDelete className="text-lg text-redColor" />
        </button>,
      sortable: false,
      center: true,
      wrap: true,
    },
  ];

  const abortDeleteHandler = () => {
    setModalObject(false);
    setDeleteId(null);
  };

  useEffect(() => {
    // gettingReasons();
    dispatch(getReasons(userData?.token))
  }, []);

  return (
    <>
      <ConfirmModal {...modalObject} />
      <CardLayoutContainer removeBg={true}>
        <CardLayoutHeader
          removeBorder={true}
          heading={"Reasons"}
          className="flex justify-between items-center"
        >
          <div className="relative">
            <SecondaryButton
              text={"Create New Reason"}
              onClick={navigationHandler}
            />
          </div>
        </CardLayoutHeader>
        <CardLayoutBody removeBorder={true}>
          <Table
            pagination={true}
            columnsData={columns}
            tableData={reasons || []}
            progressPending={isLoadingReasons}
            paginationTotalRows={reasons?.length || 0}
            paginationComponentOptions={{ noRowsPerPage: "10" }}
          />
        </CardLayoutBody>
        <CardLayoutFooter></CardLayoutFooter>
      </CardLayoutContainer>
    </>
  );
};

export default Reasons;
