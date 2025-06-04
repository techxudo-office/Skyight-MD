import {
  NotFound,
  Dashboard,
  DashboardHome,
  Roles,
  Users,
  Companies,
  CreateUser,
  CreateRole,
  Reasons,
  CreateReason,
  FlightBookings,
  BookingDetails,
  Transactions,
  Banks,
  CreateBank,
  Tickets,
  Settings,
  ApplyCommisions,
  Login,
  Admins,
  CreateAdmin,
  RefundRequests,
  CancelRequests,
  NotificationPage,
  CreateNotification,
  CompanyDetails,
  CompanyTickets,
  CompanyRefundedRequests,
  CompanyCancelledRequests,
  SupportChatPage,
} from "../pages/pages";

// Route definitions for the application
export const routesData = [
  { path: "/", element: <Login /> }, // Public login route

  {
    path: "/dashboard", // Main dashboard route (protected layout)
    element: <Dashboard />,
    children: [
      { index: true, element: <DashboardHome /> }, // Default child route when /dashboard is accessed

      // CRUD and listing routes for roles and users
      { path: "roles", element: <Roles /> },
      { path: "users", element: <Users /> },
      { path: "create-user", element: <CreateUser /> },
      { path: "create-role", element: <CreateRole /> },

      { path: "companies", element: <Companies /> },

      // Dynamic route for listing company users based on company ID
      {
        path: "company/details/users/:companyId",
        element: <Users isCompanyUser={true} />, // Reusing Users component with a flag
      },

      // Reason management routes
      { path: "reasons", element: <Reasons /> },
      { path: "create-reason", element: <CreateReason /> },

      // Booking and transaction routes
      { path: "flight-bookings", element: <FlightBookings /> },
      { path: "booking-details", element: <BookingDetails /> },
      { path: "transactions", element: <Transactions /> },

      // Bank management
      { path: "banks", element: <Banks /> },
      { path: "create-bank", element: <CreateBank /> },

      { path: "tickets", element: <Tickets /> },
      { path: "settings", element: <Settings /> },
      { path: "apply-commisions", element: <ApplyCommisions /> },

      // Admin management
      { path: "admins", element: <Admins /> },
      { path: "create-admin", element: <CreateAdmin /> },

      // Refund and cancellation requests
      { path: "refund-requests", element: <RefundRequests /> },
      { path: "cancel-requests", element: <CancelRequests /> },

      // Notifications management
      { path: "notifications", element: <NotificationPage /> },
      { path: "create-notification", element: <CreateNotification /> },

      // Detailed company views using dynamic :companyId param
      { path: "company/details/:companyId", element: <CompanyDetails /> },
      {
        path: "company/details/tickets/:companyId",
        element: <CompanyTickets />,
      },
      {
        path: "company/details/bookings/:companyId",
        element: <FlightBookings isCompanyDetail={true} />, // Reusing booking page with flag
      },
      {
        path: "company/details/transactions/:companyId",
        element: <Transactions isCompanyDetail={true} />, // Reusing transactions page with flag
      },
      {
        path: "company/details/refunded/:companyId",
        element: <CompanyRefundedRequests />,
      },
      {
        path: "company/details/refunded/booking-details/:companyId",
        element: <BookingDetails />, // View booking details in refunded tab
      },
      {
        path: "company/details/cancelled/:companyId",
        element: <CompanyCancelledRequests />,
      },
      {
        path: "company/details/cancelled/booking-details/:companyId",
        element: <BookingDetails />, // View booking details in cancelled tab
      },

      // Route for real-time support chat interface
      { path: "supportChat", element: <SupportChatPage /> },
    ],
  },

  // Fallback route for undefined paths
  { path: "*", element: <NotFound /> },
];
