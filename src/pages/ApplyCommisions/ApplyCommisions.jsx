import React, { useEffect, useState } from "react";
import { Table } from "../../components/components";
import { MdEditSquare } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
  CardLayoutFooter,
} from "../../components/CardLayout/CardLayout";
import { useDispatch, useSelector } from "react-redux";
import { getSetting } from "../../_core/features/settingSlice";

const ApplyCommisions = () => {
  const navigate = useNavigate();

  const columnsData = [
    { columnName: "No.", fieldName: "no.", type: "no." },
    { columnName: "Commission", fieldName: "commission", type: "text" },
    { columnName: "AED", fieldName: "AED", type: "text" },
    { columnName: "EUR", fieldName: "EUR", type: "text" },
    { columnName: "IQD", fieldName: "IQD", type: "text" },
    { columnName: "IRR", fieldName: "IRR", type: "text" },
    { columnName: "PKR", fieldName: "PKR", type: "text" },
    { columnName: "SAR", fieldName: "SAR", type: "text" },
    { columnName: "TRY", fieldName: "TRY", type: "text" },
    { columnName: "USD", fieldName: "USD", type: "text" },
    { columnName: "Status", fieldName: "status", type: "status" },
    { columnName: "Actions", fieldName: "actions", type: "actions" },
  ];

  const actionsData = [
    {
      name: "Edit",
      icon: <MdEditSquare title="Edit" className="text-blue-500" />,
      handler: (index, item) => {
        navigate("/dashboard/update-setting", { state: item });
      },
    },
  ];

  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.auth);
  const { settingData, isSettingLoading, errorSetting } = useSelector(
    (state) => state.setting
  );

  useEffect(() => {
    dispatch(getSetting(userData?.token));
  }, [dispatch]);

  return (
    <>
      <CardLayoutContainer removeBg={true}>
        <CardLayoutHeader removeBorder={true} heading={"Apply Commisions"} />
        <CardLayoutBody removeBorder={true}>
          <Table
            columns={columnsData}
            data={settingData || []}
            actions={actionsData}
          />
        </CardLayoutBody>
        <CardLayoutFooter></CardLayoutFooter>
      </CardLayoutContainer>
    </>
  );
};

export default ApplyCommisions;
