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
  Select,
  Switch,
} from "../../../components/components";
import { useDispatch, useSelector } from "react-redux";
import { getUserRoles } from "../../../_core/features/roleSlice";
import toast from "react-hot-toast";
import { editUser } from "../../../_core/features/userSlice";
import { adminValidation, userValidation } from "../../../utils/validations";
import { editAdmin } from "../../../_core/features/adminSlice";

Modal.setAppElement("#root");

const inputFields = [
  {
    name: "full_name",
    label: "Full Name*",
    type: "text",
    disabled: false,
    placeholder: "Enter First Name",
  },
  {
    name: "email",
    label: "Email*",
    type: "text",
    disabled: true,
    placeholder: "Enter Email",
  },
  {
    name: "password",
    label: "Password*",
    type: "password",
    disabled: false,
    placeholder: "Enter New Password",
  },
];

const initialState = {
  full_name: "",
  email: "",
  password: "",
  role_id: "",
};

const EditAdminModal = ({ isOpen, onClose, data }) => {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const [active, setActive] = useState(data?.is_active);
  const [formData, setFormData] = useState(initialState);
  const [selectedRole, setSelectedRole] = useState(null);
  const { userData } = useSelector((state) => state.auth);
  const { isEditingAdmin } = useSelector((state) => state.admin);
  const { roles, isLoadingRoles } = useSelector((state) => state.role);

  useEffect(() => {
    if (data) {
      console.log(data, "data");
      setFormData({
        full_name: data?.full_name || "",
        email: data?.email || "",
        role_id: data?.role?.id || "",
      });

      const role = roles?.find((r) => r.id == data.role_id);
      setSelectedRole(role || null);
    }
  }, [data, roles]);

  useEffect(() => {
    dispatch(getUserRoles(userData?.token));
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleSelect = (role) => {
    let data = {
      id: role.value,
      role: role.label,
    };
    setSelectedRole(data);
    setFormData((prev) => ({ ...prev, role_id: data.role }));
  };

  const handleSubmit = () => {
    if (!adminValidation(formData, setErrors)) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    const payload = {
      full_name: formData.full_name,
      password: formData.password,
      // role_id: Number(formData.role_id),
      is_active: active,
    };

    dispatch(
      editAdmin({ data: payload, token: userData?.token, id: data?.id })
    ).then(() => {
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
            {inputFields.map(({ name, label, type, disabled }) => (
              <div key={name} className="relative">
                <Input
                  name={name}
                  label={label}
                  type={type}
                  disabled={disabled}
                  value={formData[name]}
                  onChange={handleChange}
                  placeholder={`Enter ${label}`}
                />
                {errors[name] && (
                  <p className="mt-1 text-sm text-red-500">{errors[name]}</p>
                )}
              </div>
            ))}
            <Select
              id="userRoles"
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
          <div className="mt-4">
            <Switch label={"Status:"} onChange={setActive} value={active} />
          </div>
        </CardLayoutBody>
        <CardLayoutFooter>
          <Button
            text={isEditingAdmin ? <Spinner /> : "Update User"}
            onClick={handleSubmit}
            disabled={isEditingAdmin}
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

export default EditAdminModal;
