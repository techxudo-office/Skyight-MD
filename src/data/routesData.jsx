import { lazy } from "react";

const NotFound = lazy(() => import("../pages/Not-Found/Not-Found"));
const Dashboard = lazy(() => import("../pages/Dashboard/Dashboard"));
const DashboardHome = lazy(() =>
  import("../pages/DashboardHome/DashboardHome")
);
const Roles = lazy(() => import("../pages/Roles/Roles"));
const Users = lazy(() => import("../pages/Users/Users"));
const CreateUser = lazy(() => import("../pages/CreateUser/CreateUser"));
const CreateRole = lazy(() => import("../pages/CreateRole/CreateRole"));
const Companies = lazy(() => import("../pages/Companies/Companies"));
const Reasons = lazy(() => import("../pages/Reasons/Reasons"));
const CreateReason = lazy(() => import("../pages/CreateReason/CreateReason"));
const FlightBookings = lazy(() =>
  import("../pages/FlightBookings/FlightBookings")
);
const BookingDetails = lazy(() =>
  import("../pages/BookingDetails/BookingDetails")
);
const Transactions = lazy(() => import("../pages/Transactions/Transactions"));
const Banks = lazy(() => import("../pages/Banks/Banks"));
const CreateBank = lazy(() => import("../pages/CreateBank/CreateBank"));
const Tickets = lazy(() => import("../pages/Tickets/Tickets"));
const Settings = lazy(() => import("../pages/Settings/Settings"));
const ApplyCommisions = lazy(() =>
  import("../pages/ApplyCommisions/ApplyCommisions")
);
const Login = lazy(() => import("../pages/Login/Login"));
const Verification = lazy(() => import("../pages/Verification/Verification"));
const Admins = lazy(() => import("../pages/Admins/Admins"));
const CreateAdmin = lazy(() => import("../pages/CreateAdmin/CreateAdmin"));
const RefundRequests = lazy(() =>
  import("../pages/RefundRequests/RefundRequests")
);
const CancelRequests = lazy(() =>
  import("../pages/CancelRequests/CancelRequests")
);
const NotificationPage = lazy(() =>
  import("../pages/NotificationPage/NotificationPage")
);
const CreateNotification = lazy(() =>
  import("../pages/CreateNotification/CreateNotification")
);
const CompanyDetails = lazy(() =>
  import("../pages/CompanyDetails/CompanyDetails")
);
const CompanyTickets = lazy(() =>
  import("../pages/CompanyDetails/CompanyTickets/CompanyTickets")
);
const CompanyRefundedRequests = lazy(() =>
  import(
    "../pages/CompanyDetails/CompanyRefundedRequests/CompanyRefundedRequests"
  )
);
const CompanyCancelledRequests = lazy(() =>
  import(
    "../pages/CompanyDetails/CompanyCancelledRequests/CompanyCancelledRequests"
  )
);
const SupportChatPage = lazy(() => import("../pages/SupportChat/SupportChat"));

export const routesData = [
  { path: "/", element: <Login /> },
  { path: "/verification-login", element: <Verification /> },

  {
    path: "/dashboard",
    element: <Dashboard />,
    children: [
      { index: true, element: <DashboardHome /> },
      { path: "roles", element: <Roles /> },
      { path: "users", element: <Users /> },
      { path: "create-user", element: <CreateUser /> },
      { path: "create-role", element: <CreateRole /> },
      { path: "companies", element: <Companies /> },
      {
        path: "company/details/users/:companyId",
        element: <Users isCompanyUser={true} />,
      },
      { path: "reasons", element: <Reasons /> },
      { path: "create-reason", element: <CreateReason /> },
      { path: "flight-bookings", element: <FlightBookings /> },
      { path: "booking-details", element: <BookingDetails /> },
      { path: "transactions", element: <Transactions /> },
      { path: "banks", element: <Banks /> },
      { path: "create-bank", element: <CreateBank /> },
      { path: "tickets", element: <Tickets /> },
      { path: "settings", element: <Settings /> },
      { path: "apply-commisions", element: <ApplyCommisions /> },
      { path: "admins", element: <Admins /> },
      { path: "create-admin", element: <CreateAdmin /> },
      { path: "refund-requests", element: <RefundRequests /> },
      { path: "cancel-requests", element: <CancelRequests /> },
      { path: "notifications", element: <NotificationPage /> },
      { path: "create-notification", element: <CreateNotification /> },
      { path: "company/details/:companyId", element: <CompanyDetails /> },
      {
        path: "company/details/tickets/:companyId",
        element: <CompanyTickets />,
      },
      {
        path: "company/details/bookings/:companyId",
        element: <FlightBookings isCompanyDetail={true} />,
      },
      {
        path: "company/details/transactions/:companyId",
        element: <Transactions isCompanyDetail={true} />,
      },
      {
        path: "company/details/refunded/:companyId",
        element: <CompanyRefundedRequests />,
      },
      {
        path: "company/details/refunded/booking-details/:companyId",
        element: <BookingDetails />,
      },
      {
        path: "company/details/cancelled/:companyId",
        element: <CompanyCancelledRequests />,
      },
      {
        path: "company/details/cancelled/booking-details/:companyId",
        element: <BookingDetails />,
      },
      { path: "supportChat", element: <SupportChatPage /> },
    ],
  },

  { path: "*", element: <NotFound /> },
];
