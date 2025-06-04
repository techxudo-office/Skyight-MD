import { useEffect, useState } from "react";
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
import { editcommision } from "../../../_core/features/commisionSlice";

Modal.setAppElement("#root");
// Required for accessibility, binds modal to the root app element

const EditCommisionModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { adminData } = useSelector((state) => state.persist);
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
    // When `commisions` data changes (likely fetched from API),
    // initialize form with existing commission values or 0 if undefined
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
    // Update formData for changed input, converting input string to Number
    setFormData((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleSubmit = () => {
    // Dispatch action to edit commission with updated form data and admin token
    dispatch(editcommision({ data: formData, token: adminData?.token })).then(
      () => {
        onClose(); // Close modal after successful update
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
          <div className="grid grid-cols-2 gap-5">
            {/* Dynamically render input fields for each key in formData */}
            {Object.keys(formData).map((key) => (
              <div key={key}>
                <Input
                  label={key.toUpperCase()}
                  name={key}
                  type="number"
                  value={formData[key]}
                  onChange={handleChange}
                  min="" // no minimum restriction specified
                  placeholder={`Enter ${key.toUpperCase()}`}
                />
              </div>
            ))}
          </div>
        </CardLayoutBody>
        <CardLayoutFooter>
          {/* Submit button shows spinner while editing is in progress */}
          <Button
            text={isEditingcommision ? <Spinner /> : "Update Commission"}
            onClick={handleSubmit}
            disabled={isEditingcommision} // Disable button while editing
          />
          <Button
            text="Cancel"
            className="ml-3 bg-redColor hover:bg-red-600"
            onClick={onClose} // Close modal without saving
          />
        </CardLayoutFooter>
      </CardLayoutContainer>
    </ModalWrapper>
  );
};

export default EditCommisionModal;
