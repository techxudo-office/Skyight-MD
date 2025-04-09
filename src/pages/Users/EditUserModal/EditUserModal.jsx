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
import { userValidation } from "../../../utils/validations";

Modal.setAppElement("#root");

const inputFields = [
  {
    name: "first_name",
    label: "First Name*",
    type: "text",
    placeholder: "Enter First Name",
  },
  {
    name: "last_name",
    label: "Last Name*",
    type: "text",
    placeholder: "Enter Last Name",
  },
  {
    name: "email",
    label: "Email*",
    type: "text",
    placeholder: "Enter Email",
  },
  {
    name: "password",
    label: "Password*",
    type: "password",
    placeholder: "Enter New Password",
  },
  {
    name: "mobile_number",
    label: "Mobile Number*",
    type: "text",
    placeholder: "Enter Mobile Number",
  },
];

const initialState = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  mobile_number: "",
  role_id: "",
};

const EditUserModal = ({ isOpen, onClose, usersData }) => {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const [active, setActive] = useState(usersData?.isActive);
  const [formData, setFormData] = useState(initialState);
  const [selectedRole, setSelectedRole] = useState(null);
  const { adminData } = useSelector((state) => state.auth);
  const { isEditingUser } = useSelector((state) => state.user);
  const { userRoles, isLoadingUserRoles } = useSelector((state) => state.role);

  useEffect(() => {
    if (usersData) {
      console.log(usersData, "usersData");
      setFormData({
        first_name: usersData?.first_name || "",
        last_name: usersData?.last_name || "",
        email: usersData?.email || "",
        mobile_number: usersData?.mobile_number || "",
        role_id: usersData?.role?.id || "",
      });

      const role = userRoles?.find((r) => r.id == usersData.role_id);
      setSelectedRole(role || null);
    }
  }, [usersData, userRoles]);

  useEffect(() => {
    if (adminData?.token) {
      dispatch(getUserRoles(adminData?.token));
    }
  }, [adminData?.token]);

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
    setFormData((prev) => ({ ...prev, role_id: data.id }));
  };

  const handleSubmit = () => {
    if (!userValidation(formData, setErrors)) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    const payload = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      mobile_number: formData.mobile_number,
      password: formData.password,
      role_id: Number(formData.role_id),
      isActive: active,
    };

    dispatch(
      editUser({ data: payload, token: adminData?.token, id: usersData?.id })
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
            <Select
              id="userRoles"
              label="Role"
              height="h-12"
              value={selectedRole ? selectedRole.role : ""}
              onChange={handleRoleSelect}
              options={userRoles?.map((role) => ({
                value: role.id,
                label: role.role,
              }))}
              placeholder="Select a Role"
              isLoading={isLoadingUserRoles}
            />
          </div>
          <div className="mt-4">
            <Switch label={"Status:"} onChange={setActive} value={active} />
          </div>
        </CardLayoutBody>
        <CardLayoutFooter>
          <Button
            text={isEditingUser ? <Spinner /> : "Update User"}
            onClick={handleSubmit}
            disabled={isEditingUser}
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

export default EditUserModal;
