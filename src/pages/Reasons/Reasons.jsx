import  { useEffect, useState } from "react";
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
import { MdDelete, MdEdit, MdEditSquare } from "react-icons/md";
import { MdAutoDelete } from "react-icons/md";
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
  const [editId, setEditId] = useState(null);
  const [updateReason, setUpdateReason] = useState(null);
  const { adminData } = useSelector((state) => state.persist);
  const { reasons, isLoadingReasons, isLoadingDeleteReason, isEditingReason } =
    useSelector((state) => state.reasons);

  const navigationHandler = () => {
    navigate("/dashboard/create-reason");
  };
  const [modalObject, setModalObject] = useState({
    status: false,
    text: "",
    loading: false,
    onAbort: () => {},
    onConfirm: () => {},
  });
  const [modalWrapper, setModalWrapper] = useState({
    header: null,
    isOpen: false,
    contentLabel: "",
    onRequestClose: () => {},
  });

  useEffect(() => {
    if (adminData?.token) {
      dispatch(getReasons({ token: adminData?.token, logoutHandler }));
    }
  }, [adminData?.token]);

  const handleEdit = () => {
    if (updateReason.trim().length < 4) {
      toast.error("Reason must be at least 4 characters.");
      return;
    }
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
          <button
            onClick={() =>
              setModalObject({
                status: true,
                text: `Are you really Want to delete this reason of id ${row.id}`,
                onAbort: () =>
                  setModalObject((prev) => ({ ...prev, status: false })),
                onConfirm: () => {
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
          <button
            onClick={() => {
              setEditId(row.id);
              setUpdateReason(row.reason);
              setModalWrapper({
                header: `Edit reason of id ${row.id}`,
                isOpen: true,
                contentLabel: `${row.id}`,
                onRequestClose: () => {
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

  return (
    <>
      <ConfirmModal loading={isLoadingDeleteReason} {...modalObject} />
      <ModalWrapper {...modalWrapper}>
        <CardLayoutBody>
          <Textarea
            name=""
            id=""
            value={updateReason}
            onChange={(e) => setUpdateReason(e.target.value)}
          ></Textarea>
          <CardLayoutFooter>
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
