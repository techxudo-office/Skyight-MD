import { useEffect } from "react";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
} from "../../components/CardLayout/CardLayout";
import { FaEye } from "react-icons/fa";
import { FaClipboardList } from "react-icons/fa";
import Loader  from "../../components/Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getCompanyRevenue } from "../../_core/features/companySlice";

const CompanyDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { companyId } = useParams();
  const { adminData } = useSelector((state) => state.persist);
  const { companyRevenue, isLoadingCompanyRevenue } = useSelector(
    (state) => state.company
  );

  // Define different subsections within the company dashboard
  const companySections = [
    { title: "Users", path: "users" },
    { title: "Bookings", path: "bookings" },
    { title: "Tickets", path: "tickets" },
    { title: "Transactions", path: "transactions" },
    { title: "Refunded", path: "refunded" },
    { title: "Cancelled", path: "cancelled" },
  ];

  useEffect(() => {
    // On component mount, dispatch action to fetch total revenue for a specific company
    // Requires admin's auth token and the current company ID
    if (adminData?.token) {
      dispatch(getCompanyRevenue({ token: adminData?.token, id: companyId }));
    }
  }, []);

  return (
    <CardLayoutContainer removeBg={true}>
      <CardLayoutHeader
        removeBorder={true}
        heading={"Company Details"}
        className="flex items-center justify-between"
      />
      <CardLayoutBody removeBorder={true}>
        <div className="grid grid-cols-1 gap-6 py-3 md:grid-cols-2 lg:grid-cols-2">
          {isLoadingCompanyRevenue ? (
            <Loader />
          ) : (
            <div className="p-3 transition-all duration-300 bg-white border-t-4 shadow-md border-primary rounded-xl hover:shadow-lg">
              <div className="flex items-center space-x-4">
                <FaClipboardList className="text-3xl text-primary" />
                <div>
                  <h3 className="text-lg text-gray-700 mdt-semibold">
                    Revenue Generated
                  </h3>
                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    {/* Format revenue with commas (e.g. 1,000,000) for readability */}
                    {companyRevenue.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Render navigable cards for each section (users, bookings, etc.) */}
          {companySections.map((section) => (
            <div
              key={section.path}
              onClick={() =>
                // Navigate to the respective subsection for the company, passing companyId in route
                navigate(
                  `/dashboard/company/details/${section.path}/${companyId}`
                )
              }
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
  );
};

export default CompanyDetails;
