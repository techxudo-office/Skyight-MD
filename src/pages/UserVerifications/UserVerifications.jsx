import { useEffect, useState } from "react";
import Tag from "../../components/Tag/Tag";
import Table from "../../components/Table/Table";
import Searchbar from "../../components/Searchbar/Searchbar";
import CustomTooltip from "../../components/CustomTooltip/CustomTooltip";
import { FaEye } from "react-icons/fa";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
  CardLayoutFooter,
} from "../../components/CardLayout/CardLayout";
import { useDispatch, useSelector } from "react-redux";
import useLogout from "../../hooks/useLogout";
import { getUserVerificationForms } from "../../_core/features/userSlice";
import EditUserVerificationsModal from "./EditUserVerificationsModal/EditUserVerificationsModal";

const UserVerifications = () => {
  const dispatch = useDispatch();
  const logoutHandler = useLogout();
  const { adminData } = useSelector((state) => state.persist);
  const { userVerificationForms, isLoadingUserVerificationForms } = useSelector(
    (state) => state.user
  );

  const [filteredForms, setFilteredForms] = useState([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);

  // Fetch forms once when token changes
  useEffect(() => {
    if (adminData?.token) {
      dispatch(
        getUserVerificationForms({ token: adminData.token, logoutHandler })
      );
    }
  }, [adminData?.token, dispatch]);

  // Update filtered forms whenever the fetched data changes
  useEffect(() => {
    setFilteredForms(userVerificationForms);
  }, [userVerificationForms]);

  const handleView = (row) => {
    setSelectedForm(row);
    setIsViewModalOpen(true);
  };

  const columns = [
    { name: "USER", selector: (row) => row.fullName, sortable: false },
    { name: "EMAIL", selector: (row) => row.email, sortable: false },
    { name: "MOBILE", selector: (row) => row.mobile_number, sortable: false },
    {
      name: "ADDRESS",
      selector: (row) => row.address,
      sortable: false,
      wrap: true,
    },
    {
      name: "STATUS",
      selector: (row) => <Tag value={row.status} />,
      sortable: false,
      wrap: true,
      grow: 1,
    },
    {
      name: "",
      selector: (row) => (
        <CustomTooltip content="View Details">
          <FaEye
            className="text-lg cursor-pointer text-greenColor"
            onClick={() => handleView(row)}
          />
        </CustomTooltip>
      ),
      sortable: false,
    },
  ];

  return (
    <>
      {isViewModalOpen && (
        <EditUserVerificationsModal
          isOpen={isViewModalOpen}
          selectedForm={selectedForm}
          setSelectedForm={setSelectedForm}
          setIsViewModalOpen={setIsViewModalOpen}
        />
      )}
      <CardLayoutContainer removeBg>
        <CardLayoutHeader
          removeBorder
          heading="User Verifications"
          className="flex items-center justify-between"
        />
        <CardLayoutBody removeBorder>
          <Searchbar
            data={filteredForms}
            onFilteredData={setFilteredForms}
            searchFields={["fullName", "email", "status"]}
          />
          <Table
            pagination
            columnsData={columns}
            tableData={filteredForms}
            progressPending={isLoadingUserVerificationForms}
            paginationTotalRows={filteredForms?.length}
            paginationComponentOptions={{ noRowsPerPage: "10" }}
          />
        </CardLayoutBody>
        <CardLayoutFooter />
      </CardLayoutContainer>
    </>
  );
};

export default UserVerifications;
