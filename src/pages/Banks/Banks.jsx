import React, { useEffect, useState } from "react";
import {
  Table,
  SecondaryButton,
  ConfirmModal,
  ModalWrapper,
  Textarea,
  Button,
  CustomTooltip,
} from "../../components/components";
import { deleteBank, editBank, getBanks } from "../../_core/features/bankSlice";
import { useNavigate } from "react-router-dom";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
  CardLayoutFooter,
} from "../../components/CardLayout/CardLayout";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { MdDelete, MdEdit, MdEditSquare } from "react-icons/md";
import toast from "react-hot-toast";

const Banks = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [updateBank, setUpdateBank] = useState(null)
  const [editId, setEditId] = useState(null)

  const navigationHandler = () => {
    navigate("/dashboard/create-bank");
  };

  const { userData } = useSelector((state) => state.auth);
  const { banks, isLoadingBanks, isLoadingDeleteBank, isEditingBank } = useSelector((state) => state.bank);

  const [modalObject, setModalObject] = useState({
    status: false,
    text: "",
    loading: false,
    onAbort: () => { },
    onConfirm: () => { }
  });
  const [modalWrapper, setModalWrapper] = useState({
    header: null,
    isOpen: false,
    contentLabel: "",
    onRequestClose: () => { },
  });

  console.log("banks", banks)
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
    {
      name: "",
      selector: (row) =>
        <div className="flex gap-3 items-center justify-center">
          <button onClick={() => setModalObject({
            status: true,
            text: `Are you really Want to delete this bank of id ${row.id}`,
            loading: isLoadingDeleteBank,
            onAbort: () => setModalObject((prev) => ({ ...prev, status: false })),
            onConfirm: () => {
              dispatch(deleteBank({ token: userData.token, id: Number(row.id) }))
              setModalObject((prev) => ({ ...prev, status: false }))
            }

          })}>
            <CustomTooltip content={"Delete Bank"}>
              <MdDelete className="text-lg text-redColor" />
            </CustomTooltip>
          </button>
          <button onClick={() => {
            setEditId(row.id)
            setUpdateBank(row.bank)
            setModalWrapper({
              header: `Edit bank of id ${row.id}`,
              isOpen: true,
              contentLabel: `${row.id}`,
              onRequestClose: () => { setModalWrapper((prev) => ({ ...prev, isOpen: false })) },
            })
          }}

          >
            <CustomTooltip content={"Edit Bank"}>
              <MdEditSquare className="text-lg text-blueColor" />

            </CustomTooltip>
          </button>
        </div>
      ,
      sortable: false,
      center: true,
      wrap: true,
    },
  ];

  const handleEdit = () => {
    if (updateBank.trim().length < 4) {
      toast.error("Bank name must be at least 4 characters.");
      return;
    } else {
      dispatch(editBank({ token: userData.token, data: updateBank, id: editId })).then(() => {
        setModalWrapper((prev) => ({ ...prev, isOpen: false }))
      })
    }

  }
  return (
    <>
      <ConfirmModal {...modalObject} />
      <ModalWrapper {...modalWrapper}>
        <CardLayoutBody>

          <Textarea name="" id=""
            value={updateBank}
            onChange={(e) => setUpdateBank(e.target.value)}
          >

          </Textarea>
          <CardLayoutFooter>
            <Button text={"Update"} onClick={handleEdit} loading={isEditingBank} />
          </CardLayoutFooter>
        </CardLayoutBody>
      </ModalWrapper>
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
