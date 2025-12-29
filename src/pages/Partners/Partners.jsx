import { useEffect, useState } from "react";
import {
  deletePartner,
  getAllPartners,
  regeneratePartnerToken,
} from "../../_core/features/partnerSlice";
import SecondaryButton from "../../components/SecondaryBtn/SecondaryBtn";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import Table from "../../components/Table/Table";
import Searchbar from "../../components/Searchbar/Searchbar";
import { useDispatch, useSelector } from "react-redux";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
  CardLayoutFooter,
} from "../../components/CardLayout/CardLayout";
import AddPartnerModal from "./AddPartnerModal/AddPartnerModal";
import { MdAdd, MdEditSquare, MdAutoDelete, MdRefresh } from "react-icons/md";
import toast from "react-hot-toast";

const Partners = () => {
  const dispatch = useDispatch();
  const [deleteId, setDeleteId] = useState(null);
  const [modalStatus, setModalStatus] = useState(false);
  const [filteredPartners, setFilteredPartners] = useState([]);
  const [editPartnerData, setEditPartnerData] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { adminData } = useSelector((state) => state.persist);
  const {
    partners,
    isLoadingPartners,
    isDeletingPartner,
    partnersTotal,
    regeneratingTokenId,
  } = useSelector((state) => state.partner);

  const partnerColumns = [
    {
      name: "COMPANY NAME",
      selector: (row) => row?.company?.name || "N/A",
      sortable: false,
    },
    {
      name: "OWNER NAME",
      selector: (row) => `${row?.first_name || ""} ${row?.last_name || ""}`.trim(),
      sortable: false,
    },
    {
      name: "EMAIL",
      selector: (row) => row?.email,
      sortable: false,
    },
    {
      name: "PHONE",
      selector: (row) => row?.company?.phone_number || "N/A",
      sortable: false,
    },
    {
      name: "CITY",
      selector: (row) => row?.company?.city || "N/A",
      sortable: false,
    },
    {
      name: "COUNTRY",
      selector: (row) => row?.company?.country || "N/A",
      sortable: false,
    },
    {
      name: "STATUS",
      selector: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            row?.isActive
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row?.isActive ? "Active" : "Inactive"}
        </span>
      ),
      sortable: false,
    },
    {
      name: "",
      selector: (row) => (
        <div className="flex items-center gap-x-4">
          <span
            className={`text-xl ${regeneratingTokenId === row.id ? "animate-spin" : "cursor-pointer"}`}
            onClick={() => {
              if (regeneratingTokenId !== row.id) {
                regenerateTokenHandler(row.id);
              }
            }}
          >
            <MdRefresh title="Regenerate Token" className="text-orange-500" />
          </span>
          <span
            className="text-xl cursor-pointer"
            onClick={() => {
              setEditPartnerData(row);
              setIsAddModalOpen(true);
            }}
          >
            <MdEditSquare title="Edit" className="text-blue-500" />
          </span>
          <span
            className="text-xl cursor-pointer"
            onClick={() => {
              setModalStatus(true);
              setDeleteId(row.id);
            }}
          >
            <MdAutoDelete title="Delete" className="text-red-500" />
          </span>
        </div>
      ),
      sortable: false,
    },
  ];

  const openAddModalHandler = () => {
    setEditPartnerData(null);
    setIsAddModalOpen(true);
  };

  const regenerateTokenHandler = (partnerId) => {
    dispatch(
      regeneratePartnerToken({ id: partnerId, token: adminData?.token })
    );
  };

  const deletePartnerHandler = () => {
    if (!deleteId) {
      toast.error("Failed to delete this partner");
      setModalStatus(false);
      return;
    }

    dispatch(deletePartner({ id: deleteId, token: adminData?.token })).then(() => {
      setModalStatus(false);
      setDeleteId(null);
    });
  };

  const abortDeleteHandler = () => {
    setModalStatus(false);
    setDeleteId(null);
  };

  useEffect(() => {
    if (!adminData?.token) return;

    dispatch(getAllPartners({ token: adminData.token }));
  }, [dispatch, adminData?.token]);

  return (
    <>
      <ConfirmModal
        status={modalStatus}
        loading={isDeletingPartner}
        onAbort={abortDeleteHandler}
        onConfirm={deletePartnerHandler}
      />
      {isAddModalOpen && (
        <AddPartnerModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          partnerData={editPartnerData}
        />
      )}
      <CardLayoutContainer removeBg={true}>
        <CardLayoutHeader
          removeBorder={true}
          heading={`All Partners (${partnersTotal || 0})`}
          className="flex items-center justify-between"
        >
          <div className="relative">
            <SecondaryButton
              icon={<MdAdd />}
              text={"Add Partner"}
              onClick={openAddModalHandler}
            />
          </div>
        </CardLayoutHeader>
        <CardLayoutBody removeBorder={true}>
          <Searchbar
            data={partners}
            onFilteredData={setFilteredPartners}
          />
          <Table
            pagination={true}
            columnsData={partnerColumns}
            tableData={filteredPartners}
            progressPending={isLoadingPartners}
            paginationTotalRows={filteredPartners.length}
            paginationComponentOptions={{ noRowsPerPage: "10" }}
          />
        </CardLayoutBody>
        <CardLayoutFooter></CardLayoutFooter>
      </CardLayoutContainer>
    </>
  );
};

export default Partners;
