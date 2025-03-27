import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
  CardLayoutFooter,
} from "../../../components/CardLayout/CardLayout";
import {
  Button,
  Spinner,
  ModalWrapper,
  Switch,
  MultiSelect,
} from "../../../components/components";
import { useDispatch, useSelector } from "react-redux";
import { getReasons } from "../../../_core/features/reasonsSlice";
import { editTransaction } from "../../../_core/features/transactionSlice";
import toast from "react-hot-toast";

Modal.setAppElement("#root");

const EditTransactionModal = ({ isOpen, onClose, transactionId }) => {
  const dispatch = useDispatch();
  const [toggle, setToggle] = useState(false);
  const [selectedValues, setSelectedValues] = useState([]);
  const { userData } = useSelector((state) => state.auth);
  const { isEditingTransaction } = useSelector((state) => state.transaction);
  const { reasons, isLoadingReasons } = useSelector((state) => state.reasons);

  useEffect(() => {
    dispatch(getReasons(userData?.token));
  }, [userData?.token]);

  const handleSubmit = () => {
    if (!toggle && !selectedValues.length) {
      toast.error("Please give a reason.");
      return;
    }

    const payload = {
      status: toggle ? "approved" : "rejected",
      transaction_id: transactionId,
      reasonIds: !toggle ? selectedValues.map((item) => item.value) : null,
    };

    dispatch(editTransaction({ data: payload, token: userData?.token })).then(
      () => {
        onClose();
      }
    );
  };
  return (
    <ModalWrapper
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Edit Transaction"
    >
      <CardLayoutContainer>
        <CardLayoutHeader heading="Edit Transaction" />
        <CardLayoutBody>
          <div className="mb-4">
            <Switch label={"Status:"} setToggle={setToggle} />
          </div>
          {!toggle && (
            <MultiSelect
              id="userRoles"
              label="Role"
              maxHeight="h-16"
              value={selectedValues}
              onChange={(value) => setSelectedValues(value)}
              options={reasons?.map((reason) => ({
                value: reason.id,
                label: reason.reason,
              }))}
              placeholder="Select a Reason"
              isLoading={isLoadingReasons}
            />
          )}
        </CardLayoutBody>
        <CardLayoutFooter>
          <Button
            text={isEditingTransaction ? <Spinner /> : "Update User"}
            onClick={handleSubmit}
            disabled={isEditingTransaction}
          />
          <Button
            text="Cancel"
            className="ml-3 bg-redColor hover:bg-red-600"
            onClick={onClose}
          />
        </CardLayoutFooter>
      </CardLayoutContainer>
    </ModalWrapper>
  );
};

export default EditTransactionModal;
