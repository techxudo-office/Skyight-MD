import React, { useState } from "react";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
  CardLayoutFooter,
} from "../../components/CardLayout/CardLayout";
import { Input, Button, Spinner } from "../../components/components";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { adminValidation } from "../../utils/validations";
import { createNotification } from "../../_core/features/notificationSlice";

let inputFields = [
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

const initialState = {
  title: "",
  description: "",
  company_id: "",
};

const CreateNotification = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const [active, setActive] = useState(true);
  const [formData, setFormData] = useState(initialState);
  const { userData } = useSelector((state) => state.auth);
  const { isCreatingNotification } = useSelector((state) => state.notification);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!adminValidation(formData, setErrors)) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    const payload = {
      title: formData.title,
      email: formData.email,
      description: formData.description,
      company_id: Number(formData.company_id),
      is_active: active,
    };
    console.log(payload);

    dispatch(createNotification({ data: payload, token: userData?.token }))
      .unwrap()
      .then(() => {
        setFormData(initialState);
      });
  };

  return (
    <>
      <Toaster />
      <CardLayoutContainer>
        <CardLayoutHeader
          className="flex items-center justify-between"
          heading="Create Admin"
        />
        <form onSubmit={handleSubmit} noValidate>
          <CardLayoutBody>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 md:gap-5 mb-7">
              {inputFields.map(({ name, label, type }) => (
                <div key={name} className="relative">
                  <Input
                    id={name}
                    name={name}
                    label={label}
                    type={type}
                    placeholder={`Enter ${label}`}
                    value={formData[name]}
                    onChange={handleChange}
                  />
                  {errors[name] && (
                    <p className="mt-1 text-sm text-red-500">{errors[name]}</p>
                  )}
                </div>
              ))}
            </div>
          </CardLayoutBody>
          <CardLayoutFooter>
            <Button
              text={
                isCreatingNotification ? <Spinner /> : "Create Notification"
              }
              disabled={isCreatingNotification}
              type="submit"
            />
          </CardLayoutFooter>
        </form>
      </CardLayoutContainer>
    </>
  );
};

export default CreateNotification;
