import React, { useEffect } from "react";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
} from "../../components/CardLayout/CardLayout";
import { FaEye } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

const CompanyDetails = () => {
  const navigate = useNavigate();
  const { companyId } = useParams();

  const companySections = [
    { title: "Tickets", path: "tickets" },
    { title: "Refunded Requests", path: "refunded-requests" },
    {
      title: "Cancelled Requests",
      path: "cancelled-requests",
    },
    { title: "Notifications", path: "notifications" },
    { title: "Transactions", path: "transactions" },
  ];

  return (
    <>
      <CardLayoutContainer removeBg={true}>
        <CardLayoutHeader
          removeBorder={true}
          heading={"Company Details"}
          className="flex items-center justify-between"
        />
        <CardLayoutBody removeBorder={true}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {companySections.map((section) => (
              <div
                key={section.path}
                onClick={() => navigate(`/dashboard/company/details/${section.path}/${companyId}`)}
                className="flex items-center justify-between p-5 bg-white shadow-md cursor-pointer rounded-xl hover:shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-semibold">{section.title}</span>
                </div>
                <FaEye className="text-gray-500" />
              </div>
            ))}
          </div>
        </CardLayoutBody>
      </CardLayoutContainer>
    </>
  );
};

export default CompanyDetails;
