import React, { useState, useEffect } from "react";
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
import { editRole } from "../../../_core/features/roleSlice";

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

  const [rolesData, setRolesData] = useState(roleData || {});
  const { userData } = useSelector((state) => state.auth);
  const { isEditingRole } = useSelector((state) => state.role);

  useEffect(() => {
    console.log(roleData);
    if (roleData) setRolesData(roleData);
  }, [roleData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRolesData({ ...rolesData, [name]: value });
  };

  const handleCheckboxChange = (category, key) => {
    setRolesData((prevState) => ({
      ...prevState,
      [category]: {
        ...prevState[category],
        [key]: !prevState[category][key],
      },
    }));
  };

  const handleSubmit = () => {
    if (!rolesData.role.trim() || !rolesData.description.trim()) {
      alert("Please fill in all fields");
      return;
    }
    const { role_id: actionRoleId, ...action_permission } =
      rolesData?.action_permission || {};
    const { role_id: pageRoleId, ...page_permission } =
      rolesData?.page_permission || {};

    const payload = {
      role: rolesData?.role,
      description: rolesData?.description,
      page_permission: page_permission,
      action_permission: action_permission,
    };

    dispatch(
      editRole({ data: payload, token: userData?.token, id: rolesData?.id })
    ).then(() => {
      onClose();
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
            <h3 className="mb-2 font-semibold">Page Permissions</h3>
            <div className="grid grid-cols-2 gap-3">
              {rolesData?.page_permission &&
                Object.keys(rolesData.page_permission).map((key) => (
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
          <div className="mt-6">
            <h3 className="mb-2 font-semibold">Action Permissions</h3>
            <div className="grid grid-cols-2 gap-3">
              {rolesData?.action_permission &&
                Object.keys(rolesData.action_permission).map((key) => (
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
        </CardLayoutBody>

        <CardLayoutFooter className="flex justify-end gap-4 mt-4">
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
