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
import { editTicket } from "../../../_core/features/ticketSlice";

Modal.setAppElement("#root");

const statusOptions = [
  { label: "Open", value: "open" },
  { label: "In Progress", value: "in-progress" },
  { label: "Closed", value: "closed" },
  { label: "Rejected", value: "rejected" },
];

const initialState = {
  ticket_id: "",
  admin_response: "",
};

const EditTicketModal = ({ isOpen, onClose, data }) => {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(data?.status || "open");
  const [formData, setFormData] = useState(initialState);
  const { adminData } = useSelector((state) => state.auth);
  const { isUpdatingTicket } = useSelector((state) => state.ticket);

  useEffect(() => {
    if (data) {
      setFormData({ ticket_id: data?.id || "" });
      setStatus(data?.status || "open");
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formData?.admin_response?.trim()) {
      setErrors({ ...errors, admin_response: "Admin response is required" });
      toast.error("Admin response is required");
      return;
    }

    const payload = {
      status,
      ticket_id: formData?.ticket_id,
      admin_response: formData?.admin_response,
    };

    dispatch(editTicket({ data: payload, token: adminData?.token })).then(
      () => {
        onClose();
      }
    );
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
          <div className="relative">
            <div key={"admin_response"} className="relative">
              <Input
                name={"admin_response"}
                label={"Admin Response*"}
                type={"text"}
                value={formData["admin_response"]}
                onChange={handleChange}
                placeholder={`Enter ${"Admin Response*"}`}
              />
              {errors["admin_response"] && (
                <p className="mt-1 text-sm text-red-500">
                  {errors["admin_response"]}
                </p>
              )}
            </div>
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
