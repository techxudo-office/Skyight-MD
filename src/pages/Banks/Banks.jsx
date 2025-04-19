import React, { useEffect, useState } from "react";
import {
  Table,
  SecondaryButton,
  ConfirmModal,
  ModalWrapper,
  Textarea,
  Button,
  CustomTooltip,
  Searchbar,
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
import { MdAdd, MdDelete, MdEdit, MdEditSquare } from "react-icons/md";
import toast from "react-hot-toast";

const Banks = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [updateBank, setUpdateBank] = useState(null);
  const [filteredBanks, setFilteredBanks] = useState([]);
  const [editId, setEditId] = useState(null);

  const navigationHandler = () => {
    navigate("/dashboard/create-bank");
  };

  const { adminData } = useSelector((state) => state.auth);
  const { banks, isLoadingBanks, isLoadingDeleteBank, isEditingBank } =
    useSelector((state) => state.bank);

  const [modalObject, setModalObject] = useState({
    status: false,
    text: "",
    loading: false,
    onAbort: () => { },
    onConfirm: () => { },
  });
  const [modalWrapper, setModalWrapper] = useState({
    header: null,
    isOpen: false,
    contentLabel: "",
    onRequestClose: () => { },
  });

  useEffect(() => {
    if (adminData?.token) {
      dispatch(getBanks(adminData?.token));
    }
  }, []);

  const columns = [
    {
      name: "Id",
      selector: (row) => row.id,
      sortable: false,
      grow: 2,
    },
    {
      name: "Bank",
      selector: (row) => row.bank,
      sortable: false,
      wrap: true,
      grow: 4,
    },
    {
      name: "Date",
      selector: (row) => dayjs(row.created_at).format("DD-MMM-YYYY"),
      sortable: false,

      grow: 2,
    },
    {
      name: "",
      selector: (row) => (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() =>
              setModalObject({
                status: true,
                text: `Are you really Want to delete this bank of id ${row.id}`,
                onAbort: () =>
                  setModalObject((prev) => ({ ...prev, status: false })),
                onConfirm: () => {
                  dispatch(
                    deleteBank({ token: adminData.token, id: Number(row.id) })
                  ).then(() =>
                    setModalObject((prev) => ({ ...prev, status: false }))
                  );
                },
              })
            }
          >
            <CustomTooltip content={"Delete Bank"}>
              <MdDelete className="text-lg text-redColor" />
            </CustomTooltip>
          </button>
          <button
            onClick={() => {
              setEditId(row.id);
              setUpdateBank(row.bank);
              setModalWrapper({
                header: `Edit bank of id ${row.id}`,
                isOpen: true,
                contentLabel: `${row.id}`,
                onRequestClose: () => {
                  setModalWrapper((prev) => ({ ...prev, isOpen: false }));
                },
              });
            }}
          >
            <CustomTooltip content={"Edit Bank"}>
              <MdEditSquare className="text-lg text-blueColor" />
            </CustomTooltip>
          </button>
        </div>
      ),
      sortable: false,
      wrap: true,
    },
  ];

  const handleEdit = () => {
    if (updateBank.trim().length < 4) {
      toast.error("Bank name must be at least 4 characters.");
      return;
    } else {
      dispatch(
        editBank({ token: adminData.token, data: updateBank, id: editId })
      ).then(() => {
        setModalWrapper((prev) => ({ ...prev, isOpen: false }));
      });
    }
  };
  return (
    <>
      <ConfirmModal loading={isLoadingDeleteBank} {...modalObject} />
      <ModalWrapper {...modalWrapper}>
        <CardLayoutBody>
          <Textarea
            name=""
            id=""
            value={updateBank}
            onChange={(e) => setUpdateBank(e.target.value)}
          ></Textarea>
          <CardLayoutFooter>
            <Button
              text={"Update"}
              onClick={handleEdit}
              loading={isEditingBank}
            />
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
              icon={<MdAdd />}
            />
          </div>
        </CardLayoutHeader>
        <CardLayoutBody removeBorder={true}>
          <Searchbar
            data={banks}
            onFilteredData={
              setFilteredBanks
            }
            searchFields={["bank", "id"]} />
          <Table
            columnsData={columns}
            tableData={filteredBanks || []}
            pagination={true}
            progressPending={isLoadingBanks}
            paginationTotalRows={filteredBanks?.length}
            paginationComponentOptions={{ noRowsPerPage: "10" }}
          />
        </CardLayoutBody>
        <CardLayoutFooter></CardLayoutFooter>
      </CardLayoutContainer>
    </>
  );
};

export default Banks;
