import React, { useEffect, useState } from "react";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
  CardLayoutFooter,
} from "../../components/CardLayout/CardLayout";
import {
  Input,
  Button,
  Spinner,
  Select,
  Switch,
} from "../../components/components";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { FaCaretDown } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { adminValidation } from "../../utils/validations";
import { getRoles } from "../../_core/features/roleSlice";
import { createAdmin } from "../../_core/features/adminSlice";

let inputFields = [
  {
    name: "full_name",
    label: "Full Name*",
    type: "text",
    placeholder: "Enter Full Name",
  },
  { name: "email", label: "Email*", type: "email", placeholder: "Enter Email" },
  {
    name: "password",
    label: "Password*",
    type: "password",
    placeholder: "Enter Password",
  },
];
const CreateAdmin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const [active, setActive] = useState(true);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    role_id: "",
  });
  const [selectedRole, setSelectedRole] = useState(null);
  const { userData } = useSelector((state) => state.auth);
  const { isCreatingAdmin } = useSelector((state) => state.admin);
  const { roles, isLoadingRoles } = useSelector((state) => state.role);

  useEffect(() => {
    dispatch(getRoles(userData?.token));
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleSelect = (role) => {
    let data = {
      id: role.value,
      role: role.label,
    };
    setSelectedRole(data);
    setFormData((prev) => ({ ...prev, role_id: data.id }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!adminValidation(formData, setErrors)) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    const payload = {
      full_name: formData.full_name,
      email: formData.email,
      password: formData.password,
      role_id: Number(formData.role_id),
      is_active: active,
    };
    console.log(payload)

    dispatch(createAdmin({ data: payload, token: userData?.token })).then(
      () => {
        onClose();
      }
    );
  };

  return (
    <>
      <Toaster />
      <CardLayoutContainer>
        <CardLayoutHeader
          className="flex items-center justify-between"
          heading="Create User"
        >
          <Switch label={"Status:"} onChange={setActive} value={active} />
        </CardLayoutHeader>
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
                id="adminRoles"
                label="Role"
                height="h-12"
                value={selectedRole ? selectedRole.role : ""}
                onChange={handleRoleSelect}
                options={roles?.map((role) => ({
                  value: role.id,
                  label: role.role,
                }))}
                placeholder="Select a Role"
                isLoading={isLoadingRoles}
              />
            </div>
          </CardLayoutBody>

          <CardLayoutFooter>
            <Button
              text={isCreatingAdmin ? <Spinner /> : "Create Admin"}
              disabled={isCreatingAdmin}
              type="submit"
            />
          </CardLayoutFooter>
        </form>
      </CardLayoutContainer>
    </>
  );
};

export default CreateAdmin;
