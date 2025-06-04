import { useEffect, useState } from "react";
import {
  Table,
  SecondaryButton,
  ConfirmModal,
  Tag,
  ModalWrapper,
  Button,
  Textarea,
  CustomTooltip,
} from "../../components/components";
import { MdDelete, MdEditSquare } from "react-icons/md";
import {
  getReasons,
  deleteReason,
  editReason,
} from "../../_core/features/reasonsSlice";
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
import useLogout from "../../hooks/useLogout";

const Reasons = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logoutHandler = useLogout();

  // Track which reason is being edited (by id) and its updated text
  const [editId, setEditId] = useState(null);
  const [updateReason, setUpdateReason] = useState(null);

  const { adminData } = useSelector((state) => state.persist);
  const { reasons, isLoadingReasons, isLoadingDeleteReason, isEditingReason } =
    useSelector((state) => state.reasons);

  // For delete confirmation: controls visibility, displayed text, loading, and callbacks
  const [modalObject, setModalObject] = useState({
    status: false, // whether the confirm modal is visible
    text: "", // prompt text to show in ConfirmModal
    loading: false, // show spinner if delete is in progress
    onAbort: () => {}, // callback when user cancels deletion
    onConfirm: () => {}, // callback when user confirms deletion
  });

  // For the edit modal: header, visibility, aria-label, and close callback
  const [modalWrapper, setModalWrapper] = useState({
    header: null, // title of the edit modal
    isOpen: false, // whether the edit modal is visible
    contentLabel: "", // aria content label (can be used for accessibility)
    onRequestClose: () => {}, // called when modal should close (e.g. backdrop click)
  });

  useEffect(() => {
    // On mount (or when token changes), fetch all reasons for this admin
    // logoutHandler is passed so that if the token is invalid, user is logged out
    if (adminData?.token) {
      dispatch(getReasons({ token: adminData?.token, logoutHandler }));
    }
  }, [adminData?.token]);

  const handleEdit = () => {
    // Basic length check before dispatching edit
    if (updateReason.trim().length < 4) {
      toast.error("Reason must be at least 4 characters.");
      return;
    }

    // Dispatch editReason with new text and id, then close modal on success
    dispatch(
      editReason({ token: adminData.token, data: updateReason, id: editId })
    ).then(() => {
      setModalWrapper((prev) => ({ ...prev, isOpen: false }));
    });
  };

  const columns = [
    {
      name: "Created At",
      selector: (row) => dayjs(row.created_at).format("DD-MMM-YYYY"),
      sortable: false,
    },
    {
      name: "Reason",
      selector: (row) => row.reason,
      sortable: false,
    },
    {
      name: "",
      selector: (row) => (
        <div className="flex items-center justify-center gap-3">
          {/* Delete button: opens ConfirmModal by setting modalObject */}
          <button
            onClick={() =>
              setModalObject({
                status: true,
                text: `Are you really Want to delete this reason of id ${row.id}`,
                onAbort: () =>
                  // Close confirm modal without action
                  setModalObject((prev) => ({ ...prev, status: false })),
                onConfirm: () => {
                  // Dispatch deleteReason and close modal
                  dispatch(
                    deleteReason({ token: adminData.token, id: row.id })
                  );
                  setModalObject((prev) => ({ ...prev, status: false }));
                },
              })
            }
          >
            <CustomTooltip content={"Delete Reason"}>
              <MdDelete className="text-lg text-redColor" />
            </CustomTooltip>
          </button>

          {/* Edit button: open edit modal and preload textarea with existing reason */}
          <button
            onClick={() => {
              setEditId(row.id);
              setUpdateReason(row.reason);
              setModalWrapper({
                header: `Edit reason of id ${row.id}`,
                isOpen: true,
                contentLabel: `${row.id}`,
                onRequestClose: () => {
                  // Close edit modal when requested
                  setModalWrapper((prev) => ({ ...prev, isOpen: false }));
                },
              });
            }}
          >
            <CustomTooltip content={"Edit Reason"}>
              <MdEditSquare className="text-lg text-blueColor" />
            </CustomTooltip>
          </button>
        </div>
      ),
      sortable: false,
      wrap: true,
    },
  ];

  const navigationHandler = () => {
    // Navigate to screen for creating a new reason
    navigate("/dashboard/create-reason");
  };

  return (
    <>
      {/* ConfirmModal for deletions; props come from modalObject state */}
      <ConfirmModal loading={isLoadingDeleteReason} {...modalObject} />

      {/* ModalWrapper for editing a reason; opens when modalWrapper.isOpen is true */}
      <ModalWrapper {...modalWrapper}>
        <CardLayoutBody>
          {/* Textarea pre-filled with the existing reason text */}
          <Textarea
            name=""
            id=""
            value={updateReason}
            onChange={(e) => setUpdateReason(e.target.value)}
          />
          <CardLayoutFooter>
            {/* Update button triggers handleEdit, shows spinner when editing in progress */}
            <Button
              text={"Update"}
              onClick={handleEdit}
              loading={isEditingReason}
            />
          </CardLayoutFooter>
        </CardLayoutBody>
      </ModalWrapper>

      <CardLayoutContainer removeBg={true}>
        <CardLayoutHeader
          removeBorder={true}
          heading={"Reasons"}
          className="flex items-center justify-between"
        >
          <div className="relative">
            {/* Button to navigate to create-reason page */}
            <SecondaryButton
              text={"Create New Reason"}
              onClick={navigationHandler}
            />
          </div>
        </CardLayoutHeader>

        <CardLayoutBody removeBorder={true}>
          {/* Table displays all reasons with delete/edit actions */}
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
