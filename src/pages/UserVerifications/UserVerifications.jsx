import { useEffect, useState } from "react";
import Tag from "../../components/Tag/Tag";
import Table from "../../components/Table/Table";
import Button from "../../components/Button/Button";
import Searchbar from "../../components/Searchbar/Searchbar";
import ModalWrapper from "../../components/ModalWrapper/ModalWrapper";
import CustomTooltip from "../../components/CustomTooltip/CustomTooltip";
import { FaEye } from "react-icons/fa";
import Switch from "../../components/Switch/Switch";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
  CardLayoutFooter,
} from "../../components/CardLayout/CardLayout";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import useLogout from "../../hooks/useLogout";
import {
  getUserVerificationForms,
  updateUserVerificationForms,
} from "../../_core/features/userSlice";

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
  const [enlargeImage, setEnlargeImage] = useState(false);
  const [decision, setDecision] = useState(true); // true=approve, false=reject

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
    setDecision(row.status === "accepted");
    setIsViewModalOpen(true);
    setEnlargeImage(false);
  };

  const closeModal = () => {
    setIsViewModalOpen(false);
    setSelectedForm(null);
  };

  const handleDecisionChange = (value) => {
    setDecision(value);
  };

  const submitDecision = () => {
    if (!selectedForm) return;
    const newStatus = decision ? "accepted" : "rejected";
    dispatch(
      updateUserVerificationForms({
        id: selectedForm.id,
        payload: { status: newStatus },
        token: adminData.token,
        logoutHandler,
      })
    )
      .unwrap()
      .then(() => {
        dispatch(
          getUserVerificationForms({ token: adminData.token, logoutHandler })
        );
        closeModal();
      });
  };

  const columns = [
    { name: "ID", selector: (row) => row.id, sortable: false },
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

      <ModalWrapper
        isOpen={isViewModalOpen}
        onRequestClose={closeModal}
        contentLabel="Verification Details"
      >
        {selectedForm && (
          <div className="max-w-lg p-6 mx-auto bg-white border rounded-lg shadow">
            <h2 className="pb-2 mb-4 text-2xl font-bold text-center border-b">
              Verification Request
            </h2>
            <div className="space-y-3 text-sm">
              <p>
                <strong>ID:</strong> {selectedForm.id}
              </p>
              <p>
                <strong>Submitted At:</strong>{" "}
                {dayjs(selectedForm.created_at).format("DD-MMM-YYYY h:mm A")}
              </p>
              <p>
                <strong>Full Name:</strong> {selectedForm.fullName}
              </p>
              <p>
                <strong>Email:</strong> {selectedForm.email}
              </p>
              <p>
                <strong>Mobile:</strong> {selectedForm.mobile_number}
              </p>
              <p>
                <strong>Address:</strong> {selectedForm.address}
              </p>
              <div className="space-y-2">
                <strong>Documents:</strong>
                <ul className="list-disc list-inside">
                  {selectedForm.dts_copy && (
                    <li>
                      <a
                        href={selectedForm.dts_copy}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        DTS Copy
                      </a>
                    </li>
                  )}
                  {selectedForm.ntn_copy && (
                    <li>
                      <a
                        href={selectedForm.ntn_copy}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        NTN Copy
                      </a>
                    </li>
                  )}
                  {selectedForm.visiting_card && (
                    <li>
                      <a
                        href={selectedForm.visiting_card}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Visiting Card
                      </a>
                    </li>
                  )}
                </ul>
              </div>
              <p>
                <strong>Status:</strong> <Tag value={selectedForm.status} />
              </p>
              <div className="mt-4">
                <Switch
                  label="Approve"
                  value={decision}
                  onChange={handleDecisionChange}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button
                onClick={closeModal}
                text="Cancel"
                className="px-4 py-2 text-black bg-gray-300 rounded hover:bg-gray-400"
              />
              <Button
                onClick={submitDecision}
                text={decision ? "Approve" : "Reject"}
                className="px-4 py-2 text-white rounded "
                style={{ backgroundColor: decision ? "#4caf50" : "#f44336" }}
              />
            </div>
          </div>
        )}
      </ModalWrapper>
    </>
  );
};

export default UserVerifications;
