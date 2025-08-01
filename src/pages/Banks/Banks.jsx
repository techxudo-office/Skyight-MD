import { useEffect, useState } from "react";
import Table from "../../components/Table/Table";
import SecondaryButton from "../../components/SecondaryBtn/SecondaryBtn";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import ModalWrapper from "../../components/ModalWrapper/ModalWrapper";
import TextArea from "../../components/TextArea/TextArea";
import Button from "../../components/Button/Button";
import CustomTooltip from "../../components/CustomTooltip/CustomTooltip";
import Searchbar from "../../components/Searchbar/Searchbar";
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
import { MdAdd, MdDelete, MdEditSquare } from "react-icons/md";
import toast from "react-hot-toast";
import useLogout from "../../hooks/useLogout";

const Banks = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logoutHandler = useLogout(); // Custom hook to handle secure logout logic

  const [updateBank, setUpdateBank] = useState(null); // Controlled input for editing bank
  const [filteredBanks, setFilteredBanks] = useState([]); // State for search-filtered bank list
  const [editId, setEditId] = useState(null); // Tracks ID of the bank being edited

  const navigationHandler = () => {
    navigate("/dashboard/create-bank");
  };

  const { adminData } = useSelector((state) => state.persist);
  const { banks, isLoadingBanks, isLoadingDeleteBank, isEditingBank } =
    useSelector((state) => state.bank);

  const [modalObject, setModalObject] = useState({
    status: false, // Controls visibility of confirmation modal
    text: "",
    loading: false,
    onAbort: () => {},
    onConfirm: () => {},
  });

  const [modalWrapper, setModalWrapper] = useState({
    header: null,
    isOpen: false, // Controls visibility of edit modal
    contentLabel: "",
    onRequestClose: () => {},
  });

  useEffect(() => {
    // On component mount, fetch banks using admin token
    if (adminData?.token) {
      dispatch(getBanks({ token: adminData.token, logoutHandler }));
    }
  }, []);

  const columns = [
    {
      name: "Bank",
      selector: (row) => row.bank,
      sortable: false,
      wrap: true,
      grow: 4,
    },
    {
      name: "Date",
      selector: (row) => dayjs(row.created_at).format("DD-MMM-YYYY"), // Format raw date string to readable format
      sortable: false,
      grow: 2,
    },
    {
      name: "",
      selector: (row) => (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() =>
              // Trigger confirmation modal before deletion
              setModalObject({
                status: true,
                text: `Are you really Want to delete this bank of id ${row.id}`,
                onAbort: () =>
                  setModalObject((prev) => ({ ...prev, status: false })),
                onConfirm: () => {
                  // Dispatch delete action and close modal afterward
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
              // Prepare edit modal by pre-filling data and opening modal
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
    // Validate input length before sending edit request
    if (updateBank.trim().length < 4) {
      toast.error("Bank name must be at least 4 characters.");
      return;
    } else {
      // Dispatch edit action and close modal on success
      const payload = {
        bank_id: editId,
        bank: updateBank,
      };
      dispatch(editBank({ token: adminData.token, payload })).then(() => {
        setModalWrapper((prev) => ({ ...prev, isOpen: false }));
      });
    }
  };

  return (
    <>
      {/* Delete confirmation modal */}
      <ConfirmModal loading={isLoadingDeleteBank} {...modalObject} />

      {/* Modal for editing a bank entry */}
      <ModalWrapper {...modalWrapper}>
        <CardLayoutBody>
          <TextArea
            name=""
            id=""
            value={updateBank}
            onChange={(e) => setUpdateBank(e.target.value)} // Bind input to updateBank state
          ></TextArea>
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
          {/* Searchbar filters data by "bank" and "id" fields */}
          <Searchbar
            data={banks}
            onFilteredData={setFilteredBanks}
            searchFields={["bank", "id"]}
          />
          {/* Render table with filtered results */}
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
