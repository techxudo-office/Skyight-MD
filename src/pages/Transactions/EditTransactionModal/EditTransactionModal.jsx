import { useEffect, useState } from "react";
import Modal from "react-modal";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
  CardLayoutFooter,
} from "../../../components/CardLayout/CardLayout";
import Button from "../../../components/Button/Button";
import Spinner from "../../../components/Spinner/Spinner";
import ModalWrapper from "../../../components/ModalWrapper/ModalWrapper";
import Switch from "../../../components/Switch/Switch";
import MultiSelect from "../../../components/MultiSelect/MultiSelect";
import { useDispatch, useSelector } from "react-redux";
import { getReasons } from "../../../_core/features/reasonsSlice";
import { editTransaction } from "../../../_core/features/transactionSlice";
import toast from "react-hot-toast";
import { editAdminCredits } from "../../../_core/features/bookingSlice";
import useLogout from "../../../hooks/useLogout";

Modal.setAppElement("#root");

const EditTransactionModal = ({ isOpen, onClose, transaction }) => {
  const dispatch = useDispatch();
  const [toggle, setToggle] = useState(false);
  const [selectedValues, setSelectedValues] = useState([]);
  const { adminData } = useSelector((state) => state.persist);
  const { isEditingTransaction } = useSelector((state) => state.transaction);
  const { reasons, isLoadingReasons } = useSelector((state) => state.reasons);
  const logoutHandler = useLogout();

  useEffect(() => {
    if (adminData?.token) {
      dispatch(getReasons({ token: adminData?.token, logoutHandler }));
    }
  }, [adminData?.token]);

  const handleSubmit = () => {
    if (!toggle && !selectedValues.length) {
      toast.error("Please give a reason.");
      return;
    }

    const payload = {
      status: toggle ? "approved" : "rejected",
      transaction_id: transaction.id,
      reasonIds: !toggle ? selectedValues.map((item) => item.value) : null,
    };

    dispatch(editTransaction({ data: payload, token: adminData?.token }))
      .unwrap()
      // .then(() => {
      //   dispatch(
      //     editAdminCredits({
      //       data: { amount: Number(transaction.amount) },
      //       token: adminData?.token,
      //     })
      //   );
      // })
      .finally(() => {
        onClose();
      });
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
            <Switch label={"Status:"} onChange={setToggle} value={toggle} />
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
            text={isEditingTransaction ? <Spinner /> : "Update Transaction"}
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
