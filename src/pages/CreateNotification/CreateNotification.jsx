import React, { useEffect, useState } from "react";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
  CardLayoutFooter,
} from "../../components/CardLayout/CardLayout";
import { Input, Button, Spinner, Select } from "../../components/components";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { notificationValidation } from "../../utils/validations";
import { createNotification } from "../../_core/features/notificationSlice";
import { getCompanies } from "../../_core/features/companySlice";
import { notificationInpFields } from "../../utils/InputFields";

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
    if (!notificationValidation(formData, setErrors)) {
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
      <CardLayoutContainer>
        <CardLayoutHeader
          className="flex items-center justify-between"
          heading="Create Notification"
        />
        <form onSubmit={handleSubmit} noValidate>
          <CardLayoutBody>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 md:gap-5 mb-7">
              {notificationInpFields.map(({ name, label, type }) => (
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
              <div>
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
                {errors["company_id"] && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors["company_id"]}
                  </p>
                )}
              </div>
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
