import dayjs from "dayjs";
import { useState } from "react";
import Tag from "../../../components/Tag/Tag";
import useLogout from "../../../hooks/useLogout";
import Switch from "../../../components/Switch/Switch";
import Button from "../../../components/Button/Button";
import { useDispatch, useSelector } from "react-redux";
import ModalWrapper from "../../../components/ModalWrapper/ModalWrapper";
import { getUserVerificationForms, updateUserVerificationForms } from "../../../_core/features/userSlice";

const EditUserVerificationsModal = ({
  isOpen,
  setSelectedForm,
  selectedForm,
}) => {
  const dispatch = useDispatch();
  const logoutHandler = useLogout();
  const { adminData } = useSelector((state) => state.persist);
  const [decision, setDecision] = useState(true); // true=approve, false=reject

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

  return (
    <ModalWrapper
      isOpen={isOpen}
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
            <div className="flex items-center w-1/4 gap-2">
              <strong>Status:</strong> <Tag value={selectedForm.status} />
            </div>
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
  );
};

export default EditUserVerificationsModal;
