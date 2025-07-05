import { useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { editRole } from "../../../_core/features/roleSlice";
import { IoIosArrowForward } from "react-icons/io";
import { updateAdminData } from "../../../_core/features/authSlice";

Modal.setAppElement("#root");

const Checkbox = ({ label, checked, onChange }) => {
  return (
    <label className="flex items-center space-x-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4"
      />
      <span>{label}</span>
    </label>
  );
};

const EditRoleModal = ({ isOpen, onClose, roleData }) => {
  const dispatch = useDispatch();

  // Initialize local state with the passed-in roleData (contains nested permissions)
  const [rolesData, setRolesData] = useState(roleData || {});
  const { adminData } = useSelector((state) => state.persist);
  const { isEditingRole } = useSelector((state) => state.role);

  // Control whether each permission section is expanded or collapsed
  const [showPagePermissions, setShowPagePermissions] = useState(false);
  const [showActionPermissions, setShowActionPermissions] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Update top-level role name or description
    setRolesData({ ...rolesData, [name]: value });
  };

  const handleCheckboxChange = (category, key) => {
    // Toggle specific permission flag within either page_permission or action_permission
    setRolesData((prevState) => ({
      ...prevState,
      [category]: {
        ...prevState[category],
        [key]: !prevState[category][key],
      },
    }));
  };

  const handleSubmit = () => {
    // Basic validation to ensure role name and description aren't empty
    if (!rolesData.role.trim() || !rolesData.description.trim()) {
      alert("Please fill in all fields");
      return;
    }

    // Extract all keys except 'role_id' for payload; role_id is not needed in update payload
    const { role_id: actionRoleId, ...action_permission } =
      rolesData?.action_permission || {};
    const { role_id: pageRoleId, ...page_permission } =
      rolesData?.page_permission || {};

    // Construct payload matching API shape: only role, description, and permission objects
    const payload = {
      role: rolesData?.role,
      description: rolesData?.description,
      page_permission: page_permission,
      action_permission: action_permission,
    };

    // Dispatch editRole thunk. On success (resolved promise), update auth slice with new role data
    dispatch(
      editRole({ data: payload, token: adminData?.token, id: rolesData?.id })
    ).then((resp) => {
      // Update currently logged-in admin's role in auth state so UI reflects changes immediately
      dispatch(
        updateAdminData({
          ...adminData,
          admin: {
            ...adminData.admin,
            role: resp.payload,
          },
        })
      );
      onClose(); // Close modal after successful update
    });
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Edit Role"
    >
      <CardLayoutContainer>
        <CardLayoutHeader heading="Edit Role" />
        <CardLayoutBody>
          <div className="flex flex-col gap-4">
            <Input
              placeholder="Enter Role Name"
              label="Role Name"
              name="role"
              value={rolesData.role || ""}
              onChange={handleInputChange}
            />
            <Input
              placeholder="Enter Role Description"
              label="Role Description"
              name="description"
              value={rolesData.description || ""}
              onChange={handleInputChange}
            />
          </div>

          <div className="mt-6">
            {/* Toggle accordion for page permissions */}
            <button
              onClick={() => setShowPagePermissions((prev) => !prev)}
              className="flex items-center justify-between w-full mb-2 font-semibold text-left"
            >
              <span>Page Permissions</span>
              {/* Rotate arrow icon when expanded */}
              <IoIosArrowForward
                className={`transition-transform duration-200 ${
                  showPagePermissions ? "rotate-90" : "rotate-0"
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                showPagePermissions ? "max-h-96" : "max-h-0"
              }`}
            >
              <div className="grid grid-cols-2 gap-3">
                {/* Render checkboxes for each page permission, excluding 'role_id' */}
                {rolesData?.page_permission &&
                  Object.keys(rolesData.page_permission)
                    .filter((key) => key !== "role_id")
                    .map((key) => (
                      <Checkbox
                        key={key}
                        label={key.replace(/_/g, " ")}
                        checked={rolesData.page_permission[key]}
                        onChange={() =>
                          handleCheckboxChange("page_permission", key)
                        }
                      />
                    ))}
              </div>
            </div>
          </div>

          <div className="mt-6">
            {/* Toggle accordion for action permissions */}
            <button
              onClick={() => setShowActionPermissions((prev) => !prev)}
              className="flex items-center justify-between w-full mb-2 font-semibold text-left"
            >
              <span>Action Permissions</span>
              {/* Rotate arrow icon when expanded */}
              <IoIosArrowForward
                className={`transition-transform duration-200 ${
                  showActionPermissions ? "rotate-90" : "rotate-0"
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                showActionPermissions ? "max-h-96" : "max-h-0"
              }`}
            >
              <div className="grid grid-cols-2 gap-3">
                {/* Render checkboxes for each action permission, excluding 'role_id' */}
                {rolesData?.action_permission &&
                  Object.keys(rolesData.action_permission)
                    .filter((key) => key !== "role_id")
                    .map((key) => (
                      <Checkbox
                        key={key}
                        label={key.replace(/_/g, " ")}
                        checked={rolesData.action_permission[key]}
                        onChange={() =>
                          handleCheckboxChange("action_permission", key)
                        }
                      />
                    ))}
              </div>
            </div>
          </div>
        </CardLayoutBody>

        <CardLayoutFooter className="flex justify-end gap-4 mt-4">
          {/* Update button shows spinner while edit is in progress */}
          <Button
            text={isEditingRole ? <Spinner /> : "Update Role"}
            onClick={handleSubmit}
            disabled={isEditingRole}
          />
          <Button text="Cancel" className="bg-redColor" onClick={onClose} />
        </CardLayoutFooter>
      </CardLayoutContainer>
    </ModalWrapper>
  );
};

export default EditRoleModal;
