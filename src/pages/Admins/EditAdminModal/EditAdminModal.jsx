import { useEffect, useState } from "react";
import Modal from "react-modal";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
  CardLayoutFooter,
} from "../../../components/CardLayout/CardLayout";
import Input from "../../../components/Input/Input";
import Button from "../../../components/Button/Button";
import Spinner from "../../../components/Spinner/Spinner";
import ModalWrapper from "../../../components/ModalWrapper/ModalWrapper";
import Select from "../../../components/Select/Select";
import Switch from "../../../components/Switch/Switch";
import { useDispatch, useSelector } from "react-redux";
import { getRoles } from "../../../_core/features/roleSlice";
import toast from "react-hot-toast";
import { adminValidation } from "../../../utils/validations";
import { editAdmin } from "../../../_core/features/adminSlice";
import { editAdminInpFields } from "../../../utils/InputFields";
import useLogout from "../../../hooks/useLogout";

// Set modal's root element for accessibility
Modal.setAppElement("#root");

const initialState = {
  full_name: "",
  email: "",
  password: "",
  role_id: "",
};

const EditAdminModal = ({ isOpen, onClose, data }) => {
  const dispatch = useDispatch();
  const logoutHandler = useLogout();
  const [errors, setErrors] = useState({});
  const [active, setActive] = useState(data?.is_active); // Boolean switch for active/inactive status
  const [formData, setFormData] = useState(initialState);
  const [selectedRole, setSelectedRole] = useState(null);
  const { adminData } = useSelector((state) => state.persist);
  const { isEditingAdmin } = useSelector((state) => state.admin);
  const { roles, isLoadingRoles } = useSelector((state) => state.role);

  // Pre-fill form fields when `data` or `roles` change
  useEffect(() => {
    if (data) {
      setFormData({
        full_name: data?.full_name || "",
        email: data?.email || "",
        role_id: data?.role?.id || "",
      });

      // Match the role object to set in Select input
      const role = roles?.find((r) => r.id == data.role_id);
      setSelectedRole(role || null);
    }
  }, [data, roles]);

  // Fetch available roles for the dropdown if token exists
  useEffect(() => {
    if (!adminData?.token) return;
    dispatch(getRoles({ token: adminData.token, logoutHandler }));
  }, [dispatch, adminData?.token]);

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle selection from dropdown for roles
  const handleRoleSelect = (role) => {
    let data = {
      id: role.value,
      role: role.label,
    };
    setSelectedRole(data);
    setFormData((prev) => ({ ...prev, role_id: data.id }));
  };

  // Handle final submit (validation + dispatch API call)
  const handleSubmit = () => {
    if (!adminValidation(formData, setErrors)) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    const payload = {
      full_name: formData.full_name,
      password: formData.password,
      role_id: Number(formData.role_id),
      is_active: active,
    };

    // Dispatch the editAdmin action and close modal after successful update
    dispatch(
      editAdmin({ data: payload, token: adminData?.token, id: data?.id })
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
          {/* Inputs: Full Name, Email, Password */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {editAdminInpFields.map(({ name, label, type, disabled }) => (
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
                {/* Inline validation error */}
                {errors[name] && (
                  <p className="mt-1 text-sm text-red-500">{errors[name]}</p>
                )}
              </div>
            ))}

            {/* Role selection using custom Select dropdown */}
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

          {/* Switch for active/inactive status */}
          <div className="mt-4">
            <Switch label={"Status:"} onChange={setActive} value={active} />
          </div>
        </CardLayoutBody>

        <CardLayoutFooter>
          {/* Submit Button with loading spinner */}
          <Button
            text={isEditingAdmin ? <Spinner /> : "Update User"}
            onClick={handleSubmit}
            disabled={isEditingAdmin}
          />
          {/* Cancel/Close Modal Button */}
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
