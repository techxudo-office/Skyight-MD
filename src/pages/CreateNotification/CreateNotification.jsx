import React, { useEffect, useState } from "react";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
  CardLayoutFooter,
} from "../../components/CardLayout/CardLayout";
import { Input, Button, Spinner, Select } from "../../components/components";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { adminValidation, ticketValidation } from "../../utils/validations";
import { createNotification } from "../../_core/features/notificationSlice";
import { getCompanies } from "../../_core/features/companySlice";

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
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(initialState);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const { adminData } = useSelector((state) => state.auth);
  const { companies, isLoadingCompanies } = useSelector(
    (state) => state.company
  );
  const { isCreatingNotification } = useSelector((state) => state.notification);

  useEffect(() => {
    if (adminData?.token) {
      dispatch(getCompanies(adminData?.token));
    }
  }, [dispatch]);

  useEffect(() => {
    console.log(isCreatingNotification, "Loader");
  }, [isCreatingNotification]);

  const handleRoleSelect = (role) => {
    let data = {
      id: role.value,
      name: role.label,
    };
    setSelectedCompany(data);
    setFormData((prev) => ({ ...prev, company_id: data.id }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ticketValidation(formData, setErrors)) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    const payload = {
      title: formData?.title,
      description: formData?.description,
      company_id: Number(formData?.company_id),
    };

    dispatch(createNotification({ data: payload, token: adminData?.token }))
      .unwrap()
      .then(() => {
        setFormData(initialState);
        setSelectedCompany(null);
      });
  };

  return (
    <>
      <Toaster />
      <CardLayoutContainer>
        <CardLayoutHeader
          className="flex items-center justify-between"
          heading="Create Notification"
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
              <Select
                id="companies"
                label="Company"
                height="h-12"
                value={selectedCompany ? selectedCompany.name : ""}
                onChange={handleRoleSelect}
                options={companies?.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
                placeholder="Select a Company"
                isLoading={isLoadingCompanies}
              />
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
