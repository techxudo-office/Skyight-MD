import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
// import EditUserModal from "./EditUserModal/EditUserModal";
import { MdAdd, MdEditSquare, MdAutoDelete } from "react-icons/md";
import toast from "react-hot-toast";
import {
  deleteCustomer,
  getCustomers,
} from "../../_core/features/customerSlice";
import useLogout from "../../hooks/useLogout";

const Customers = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logoutHandler = useLogout();
  const { companyId } = useParams();
  const [deleteId, setDeleteId] = useState(null);
  const [modalStatus, setModalStatus] = useState(false);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [editUserData, setEditUserData] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { adminData } = useSelector((state) => state.persist);
  const { customers, isLoadingCustomers, isDeletingCustomer } = useSelector(
    (state) => state.customer
  );

  const userColumns = [
    {
      name: "FIRST NAME",
      selector: (row) => row?.first_name,
      sortable: false,
    },
    {
      name: "LAST NAME",
      selector: (row) => row?.last_name,
      sortable: false,
    },
    {
      name: "EMAIL",
      selector: (row) => row?.email,
      sortable: false,
    },
    {
      name: "Mobile No.",
      selector: (row) => row?.mobile_number,
      sortable: false,
    },
    {
      name: "",
      selector: (row) => (
        <div className="flex items-center gap-x-4">
          <span
            className="text-xl cursor-pointer"
            onClick={() => {
              setEditUserData(row);
              setIsEditModalOpen(true);
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

  const deleteUserHandler = () => {
    if (!deleteId) {
      toast.error("Failed to delete this user");
      setModalStatus(false);
      return;
    }

    dispatch(deleteCustomer({ id: deleteId, token: adminData?.token })).then(
      () => {
        setModalStatus(false);
        setDeleteId(null);
      }
    );
  };

  const abortDeleteHandler = () => {
    setModalStatus(false);
    setDeleteId(null);
  };

  useEffect(() => {
    if (!adminData?.token) return;
    dispatch(getCustomers({ token: adminData.token, logoutHandler }));
  }, [dispatch, adminData?.token, companyId]);

  return (
    <>
      <ConfirmModal
        status={modalStatus}
        text={`Are you sure you want to delete customer with ID ${deleteId}?`}
        loading={isDeletingCustomer}
        onAbort={abortDeleteHandler}
        onConfirm={deleteUserHandler}
      />
      {/* {isEditModalOpen && (
        <EditUserModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          usersData={editUserData}
        />
      )} */}
      <CardLayoutContainer removeBg={true}>
        {/* <CardLayoutHeader
          removeBorder={true}
          heading={"Customers"}
          classNames="flex items-center justify-between"
        >
          <div className="relative">
            <SecondaryButton
              icon={<MdAdd />}
              text={"Create New Customer"}
              onClick={navigationHandler}
            />
          </div>
        </CardLayoutHeader> */}
        <CardLayoutBody removeBorder={true}>
          <Searchbar
            data={customers}
            onFilteredData={setFilteredCustomers}
            searchFields={["first_name", "last_name", "email", "mobile_number"]}
          />
          <Table
            pagination={true}
            columnsData={userColumns}
            tableData={filteredCustomers}
            progressPending={isLoadingCustomers}
            paginationTotalRows={filteredCustomers.length}
            paginationComponentOptions={{ noRowsPerPage: "10" }}
          />
        </CardLayoutBody>
        <CardLayoutFooter></CardLayoutFooter>
      </CardLayoutContainer>
    </>
  );
};

export default Customers;
