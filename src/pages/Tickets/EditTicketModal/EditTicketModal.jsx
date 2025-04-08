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
  Switch,
} from "../../../components/components";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { ticketValidation } from "../../../utils/validations";
import { editTicket } from "../../../_core/features/ticketSlice";

Modal.setAppElement("#root");

const inputFields = [
  {
    name: "title",
    label: "Title*",
    type: "text",
    placeholder: "Enter Title",
  },
  {
    name: "description",
    label: "Description*",
    type: "text",
    placeholder: "Enter Description",
  },
];

const statusOptions = [
  { label: "Open", value: "open" },
  { label: "In Progress", value: "in-progress" },
  { label: "Closed", value: "closed" },
  { label: "Rejected", value: "rejected" },
];

const initialState = {
  title: "",
  description: "",
  ticket_id: "",
};

const EditTicketModal = ({ isOpen, onClose, data }) => {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(data?.status || "open");
  const [formData, setFormData] = useState(initialState);
  const { userData } = useSelector((state) => state.auth);
  const { isUpdatingTicket } = useSelector((state) => state.ticket);

  useEffect(() => {
    if (data) {
      console.log(data, "data");
      setFormData({
        title: data?.title || "",
        description: data?.description || "",
        ticket_id: data?.id || "",
      });
      setStatus(data?.status || "open");
    }
  }, [data]);
  useEffect(() => {
    console.log(isUpdatingTicket, "STATE");
  }, [isUpdatingTicket]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!ticketValidation(formData, setErrors)) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    const payload = {
      title: formData.title,
      description: formData.description,
      ticket_id: Number(formData.ticket_id),
      status,
    };

    dispatch(editTicket({ data: payload, token: userData?.token })).then(() => {
      onClose();
    });
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Edit User"
    >
      <CardLayoutContainer>
        <CardLayoutHeader heading="Edit User" />
        <CardLayoutBody>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {inputFields.map(({ name, label, type }) => (
              <div key={name} className="relative">
                <Input
                  name={name}
                  label={label}
                  type={type}
                  value={formData[name]}
                  onChange={handleChange}
                  placeholder={`Enter ${label}`}
                />
                {errors[name] && (
                  <p className="mt-1 text-sm text-red-500">{errors[name]}</p>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4">
            <label className="block mb-1 font-medium text-gray-700">
              Status:
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </CardLayoutBody>
        <CardLayoutFooter>
          <Button
            text={isUpdatingTicket ? <Spinner /> : "Update Ticket"}
            onClick={handleSubmit}
            disabled={isUpdatingTicket}
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

export default EditTicketModal;
