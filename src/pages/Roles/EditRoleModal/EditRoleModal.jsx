import  { useState, useEffect } from "react";
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
import { updateAdminData } from "../../../_core/features/authSlice";
import { IoIosArrowForward } from "react-icons/io";

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
  const { adminData } = useSelector((state) => state.persist);
  const { isEditingRole } = useSelector((state) => state.role);
  const [showPagePermissions, setShowPagePermissions] = useState(false);
  const [showActionPermissions, setShowActionPermissions] = useState(false);

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
      editRole({ data: payload, token: adminData?.token, id: rolesData?.id })
    ).then((resp) => {
      dispatch(
        updateAdminData({
          ...adminData,
          admin: {
            ...adminData.admin,
            role: resp.payload,
          },
        })
      );
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
            <button
              onClick={() => setShowPagePermissions((prev) => !prev)}
              className="flex items-center justify-between w-full mb-2 font-semibold text-left"
            >
              <span>Page Permissions</span>
              <IoIosArrowForward
                className={`transition-transform duration-200 ${showPagePermissions ? "rotate-90" : "rotate-0"
                  }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${showPagePermissions ? "max-h-96" : "max-h-0"
                }`}
            >
              <div className="grid grid-cols-2 gap-3">
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
            <button
              onClick={() => setShowActionPermissions((prev) => !prev)}
              className="flex items-center justify-between w-full mb-2 font-semibold text-left"
            >
              <span>Action Permissions</span>
              <IoIosArrowForward
                className={`transition-transform duration-200 ${showActionPermissions ? "rotate-90" : "rotate-0"
                  }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${showActionPermissions ? "max-h-96" : "max-h-0"
                }`}
            >
              <div className="grid grid-cols-2 gap-3">
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
