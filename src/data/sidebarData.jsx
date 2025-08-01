import { useSelector } from "react-redux";
import { FaSquarePollHorizontal } from "react-icons/fa6";
import { TbManualGearboxFilled } from "react-icons/tb";
import {
  MdAccountBalanceWallet,
  MdCancelScheduleSend,
  MdDoorbell,
  MdOutlineGroups,
  MdOutlineNoteAlt,
  MdSettings,
} from "react-icons/md";
import { TbTransactionDollar } from "react-icons/tb";
import { PiBankBold } from "react-icons/pi";
import { IoTicket } from "react-icons/io5";
import { FaUserShield, FaUser } from "react-icons/fa";
import { HiRectangleGroup } from "react-icons/hi2";
import { IoMdBookmark } from "react-icons/io";
import { RiRefund2Fill } from "react-icons/ri";
import { IoIosChatboxes } from "react-icons/io";

// Hook that returns a filtered list of sidebar navigation links based on admin's page permissions
export const useAdminSidebarLinks = () => {
  // Retrieve admin data from Redux state (persisted version)
  const adminData = useSelector((state) => state.persist.adminData);

  // Extract page permissions from admin role
  const pagePermissions = adminData?.admin?.role?.page_permission || {
    // Fallback default permissions if not found
    dashboard: true,
    flights: true,
    bookings: true,
    credits: true,
    transactions: true,
    history: true,
    administrators: true,
    tickets: true,
    help_and_support: true,
  };

  // Return an array of sidebar link objects
  return [
    // Conditionally show Dashboard if permission exists
    pagePermissions.dashboard && {
      title: "Dashboard",
      path: "/dashboard",
      icon: <HiRectangleGroup />,
    },
    pagePermissions.flights && {
      title: "Flight Bookings",
      path: "flight-bookings",
      icon: <IoMdBookmark />,
    },

    // Always show Companies link (not permission-based)
    {
      title: "Companies",
      path: "companies",
      icon: <TbManualGearboxFilled />,
    },

    // Conditionally show Bookings section with sub-links based on respective permissions
    pagePermissions.bookings && {
      title: "Bookings",
      icon: <IoMdBookmark />,
      sublinks: [
        pagePermissions.tickets && {
          title: "Tickets",
          path: "tickets",
          icon: <IoTicket />,
        },
        {
          title: "Refund Requests",
          path: "refund-requests",
          icon: <RiRefund2Fill />,
        },
        {
          title: "Cancel Requests",
          path: "cancel-requests",
          icon: <MdCancelScheduleSend />,
        },
      ].filter(Boolean), // Filters out any falsy entries if permissions are missing
    },

    // Accounts section with static link to Banks page
    {
      title: "Accounts",
      icon: <MdAccountBalanceWallet />,
      sublinks: [
        pagePermissions.transactions && {
          title: "Transactions",
          path: "transactions",
          icon: <TbTransactionDollar />,
        },
        {
          title: "Banks",
          path: "banks",
          icon: <PiBankBold />,
        },
        {
          title: "User Verifications",
          path: "user-verifications",
          icon: <FaUser />,
        },
      ].filter(Boolean),
    },

    // Settings section, currently only includes Reasons page
    {
      title: "Settings",
      icon: <MdSettings />,
      sublinks: [
        {
          title: "Reasons",
          path: "reasons",
          icon: <MdOutlineNoteAlt />,
        },
        {
          title: "Offers",
          path: "offers",
          icon: <MdOutlineNoteAlt />,
        },
      ].filter(Boolean),
    },

    // Conditionally render Users section if admin has 'administrators' permission
    pagePermissions.administrators && {
      title: "Users",
      icon: <MdOutlineGroups />,
      sublinks: [
        {
          title: "Roles",
          path: "roles",
          icon: <FaSquarePollHorizontal />,
        },
        pagePermissions.administrators && {
          title: "Admins",
          path: "admins",
          icon: <FaUserShield />,
        },
      ].filter(Boolean),
    },
    {
      title: "Customers",
      path: "customers",
      icon: <FaUser />,
    },
    // Conditionally show Notifications link
    pagePermissions.help_and_support && {
      title: "Notifications",
      path: "notifications",
      icon: <MdDoorbell />,
    },

    // Static link for support chat
    {
      title: "Support Chat",
      path: "supportChat",
      icon: <IoIosChatboxes />,
    },
  ].filter(Boolean); // Filters out any completely falsy sections (like disabled dashboard/bookings)
};
