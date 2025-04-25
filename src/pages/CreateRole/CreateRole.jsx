import React, { useState } from "react";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
  CardLayoutFooter,
} from "../../components/CardLayout/CardLayout";
import { Input, Button, Spinner } from "../../components/components";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { createRole } from "../../_core/features/roleSlice";

const initialRolesData = {
  name: "",
  description: "",
  page_permission: {
    dashboard: false,
    flights: false,
    bookings: false,
    credits: false,
    transactions: false,
    history: false,
    administrators: false,
    tickets: false,
    help_and_support: false,
  },
  action_permission: {
    read_admin: false,
    write_admin: false,
    read_company: false,
    write_company: false,
    read_user: false,
    write_user: false,
    read_booking: false,
    write_booking: false,
    read_transaction: false,
    write_reason: false,
    read_role: false,
    write_role: false,
    write_transaction: false,
    read_notification: false,
    read_flight: false,
    read_error_log: false,
    write_announcement: false,
    read_announcement: false,
  },
};

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

const CreateRole = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { adminData } = useSelector((state) => state.auth);
  const [rolesData, setRolesData] = useState(initialRolesData);

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

  const handleSubmit = async () => {
    if (!rolesData.name.trim() || !rolesData.description.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    const payload = {
      name: rolesData.name,
      description: rolesData.description,
      page_permission: rolesData.page_permission,
      action_permission: rolesData.action_permission,
    };

    dispatch(createRole({ data: payload, token: adminData?.token }));
  };

  return (
    <>
      <Toaster />
      <CardLayoutContainer>
        <CardLayoutHeader
          heading="Create Role"
          className="flex items-center justify-between"
        />
        <CardLayoutBody>
          <div className="flex mb-5 space-x-5">
            <Input
              placeholder="Enter Role Name"
              label="Role Name*"
              type="text"
              name="name"
              value={rolesData.name}
              onChange={handleInputChange}
            />
            <Input
              placeholder="Enter Role Description"
              label="Role Description*"
              type="text"
              name="description"
              value={rolesData.description}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-5">
            <h3 className="mb-2 font-semibold">Page Permissions</h3>
            <div className="grid grid-cols-3 gap-3">
              {Object.keys(rolesData.page_permission).map((key) => (
                <Checkbox
                  key={key}
                  label={key.replace(/_/g, " ")}
                  checked={rolesData.page_permission[key]}
                  onChange={() => handleCheckboxChange("page_permission", key)}
                />
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">Action Permissions</h3>
            <div className="grid grid-cols-3 gap-3">
              {Object.keys(rolesData.action_permission).map((key) => (
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
        <CardLayoutFooter>
          <Button
            text={loading ? <Spinner /> : "Create Role"}
            disabled={loading}
            onClick={handleSubmit}
          />
        </CardLayoutFooter>
      </CardLayoutContainer>
    </>
  );
};

export default CreateRole;
