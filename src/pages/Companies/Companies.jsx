import React, { useCallback, useEffect, useState } from "react";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
  CardLayoutFooter,
} from "../../components/CardLayout/CardLayout";

import { FaEye } from "react-icons/fa";
import { MdEditSquare } from "react-icons/md";
import { FaRegCircleCheck } from "react-icons/fa6";
import { MdAutoDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import { Table, Dropdown, SecondaryButton } from "../../components/components";
import { getRoles } from "../../utils/api_handler";

const Companies = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [rolesData, setRolesData] = useState([]);
  const [dropdownStatus, setDropdownStatus] = useState(false);

  const navigationHandler = () => {
    navigate("/dashboard/create-role");
  };

  const handleGetRoles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getRoles();
      if (response.status) {
        let data = response.data.roles.map((item) => ({
          id: item.id.toString(),
          role: item.name || "Unknown",
          roleRights: item.page_permission
            ? Object.keys(item.page_permission)
                .filter((key) => item.page_permission[key])
                .map((key) => key.replace(/_/g, " "))
                .join(", ")
            : "No Permissions",
          status: item.is_deleted ? "inactive" : "active",
        }));
        setRolesData(data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    handleGetRoles();
  }, [handleGetRoles]);

  const data = [
    {
      id: "64c3f3f4e4b0f1a1d2c3b3e1",
      role: "Admin",
      roleRights: "Full Access",
      status: "active",
    },
    {
      id: "64c3f3f4e4b0f1a1d2c3b3e2",
      role: "Editor",
      roleRights: "Create, Update, View",
      status: "active",
    },
    {
      id: "64c3f3f4e4b0f1a1d2c3b3e3",
      role: "Viewer",
      roleRights: "View Only",
      status: "inactive",
    },
    {
      id: "64c3f3f4e4b0f1a1d2c3b3e4",
      role: "Manager",
      roleRights: "Create, Update, View",
      status: "active",
    },
    {
      id: "64c3f3f4e4b0f1a1d2c3b3e5",
      role: "Support",
      roleRights: "Limited Access",
      status: "inactive",
    },
  ];

  const columnsData = [
    { columnName: "No.", fieldName: "no.", type: "no." },
    // { columnName: "Role Img", fieldName: "image", type: 'img' },
    { columnName: "Role", fieldName: "role", type: "text" },
    // { columnName: "Role ID", fieldName: "id", type: "id" },
    { columnName: "Status", fieldName: "status", type: "status" },
    { columnName: "Actions", fieldName: "actions", type: "actions" },
  ];

  const viewColumns = [
    { columnName: "Role Rights", fieldName: "roleRights", type: "text" },
  ];

  const actionsData = [
    {
      name: "View",
      icon: <FaEye title="View" className="text-green-500" />,
      handler: (index) => {
        if (activeIndex === index) {
          setActiveIndex(null);
        } else setActiveIndex(index);
      },
    },
    {
      name: "Edit",
      icon: <MdEditSquare title="Edit" className="text-blue-500" />,
      handler: () => {
        alert("Hello Im Edit Alert !");
      },
    },
    {
      name: "Rights",
      icon: (
        <FaRegCircleCheck title="Rights" className="text-sm text-orange-500" />
      ),
      handler: () => {
        alert("Hello Im Rights Alert !");
      },
    },
    {
      name: "Delete",
      icon: <MdAutoDelete title="Delete" className="text-red-500" />,
      handler: () => {
        alert("Hello Im Delete Alert !");
      },
    },
  ];

  const filterOptions = [
    {
      name: "Filter One",
      handler: () => {
        setDropdownStatus(!dropdownStatus);
      },
    },
    {
      name: "Filter Two",
      handler: () => {
        setDropdownStatus(!dropdownStatus);
      },
    },
    {
      name: "Filter Three",
      handler: () => {
        setDropdownStatus(!dropdownStatus);
      },
    },
  ];

  return (
    <>
      <CardLayoutContainer removeBg={true}>
        <CardLayoutHeader
          removeBorder={true}
          heading={"Roles"}
          className="flex items-center justify-between">
          <div className="relative">
            <SecondaryButton
              text={"Create New Role"}
              onClick={navigationHandler}
            />
            <Dropdown
              className={"top-16 right-10"}
              status={dropdownStatus}
              changeStatus={setDropdownStatus}
              options={filterOptions}
            />
          </div>
        </CardLayoutHeader>
        <CardLayoutBody removeBorder={true}>
          <Table
            columns={columnsData}
            viewColumns={viewColumns}
            data={rolesData}
            actions={actionsData}
            activeIndex={activeIndex}
          />
        </CardLayoutBody>
        <CardLayoutFooter></CardLayoutFooter>
      </CardLayoutContainer>
    </>
  );
};

export default Companies;
