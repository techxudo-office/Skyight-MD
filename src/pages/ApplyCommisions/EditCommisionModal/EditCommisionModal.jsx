import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
  CardLayoutFooter,
} from "../../../components/CardLayout/CardLayout";
import {
  Input,
  Button,
  Spinner,
  ModalWrapper,
} from "../../../components/components";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { editcommision } from "../../../_core/features/commisionSlice";

Modal.setAppElement("#root");

const EditCommisionModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.auth);
  const { commisions, isEditingcommision } = useSelector(
    (state) => state.commision
  );

  const [formData, setFormData] = useState({
    PKR: 0,
    IRR: 0,
    AED: 0,
    SAR: 0,
    TRY: 0,
    USD: 0,
    EUR: 0,
    IQD: 0,
    commission: 0,
  });

  useEffect(() => {
    if (commisions) {
      setFormData({
        PKR: commisions.PKR || 0,
        IRR: commisions.IRR || 0,
        AED: commisions.AED || 0,
        SAR: commisions.SAR || 0,
        TRY: commisions.TRY || 0,
        USD: commisions.USD || 0,
        EUR: commisions.EUR || 0,
        IQD: commisions.IQD || 0,
        commission: commisions.commission || 0,
      });
    }
  }, [commisions]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleSubmit = () => {
    dispatch(editcommision({ data: formData, token: userData?.token })).then(
      () => {
        toast.success("Commision updated successfully!");
        onClose();
      }
    );
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Edit Commision"
    >
      <CardLayoutContainer>
        <CardLayoutHeader heading="Edit Commision" />
        <CardLayoutBody>
          <div className="grid grid-cols-2 gap-4">
            {Object.keys(formData).map((key) => (
              <div key={key}>
                <label className="block mb-1 text-gray-600">
                  {key.toUpperCase()}
                </label>
                <Input
                  name={key}
                  type="number"
                  value={formData[key]}
                  onChange={handleChange}
                  min="0"
                  placeholder={`Enter ${key.toUpperCase()}`}
                />
              </div>
            ))}
          </div>
        </CardLayoutBody>
        <CardLayoutFooter>
          <Button
            text={isEditingcommision ? <Spinner /> : "Update Commission"}
            onClick={handleSubmit}
            disabled={isEditingcommision}
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

export default EditCommisionModal;
