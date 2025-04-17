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
import { FaUserShield } from "react-icons/fa";
import { BiSolidDollarCircle } from "react-icons/bi";
import { HiRectangleGroup } from "react-icons/hi2";
import { IoMdBookmark } from "react-icons/io";
import { RiRefund2Fill } from "react-icons/ri";

export const useAdminSidebarLinks = () => {
  const adminData = useSelector((state) => state.auth.adminData);
  const pagePermissions = adminData?.admin?.role?.page_permission || {
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

  return [
    pagePermissions.dashboard && {
      title: "Dashboard",
      path: "/dashboard",
      icon: <HiRectangleGroup />,
    },
    {
      title: "Companies",
      path: "companies",
      icon: <TbManualGearboxFilled />,
    },
    {
      title: "Apply Commisions",
      path: "apply-commisions",
      icon: <BiSolidDollarCircle />,
    },
    pagePermissions.bookings && {
      title: "Bookings",
      icon: <IoMdBookmark />,
      sublinks: [
        pagePermissions.transactions && {
          title: "Transactions",
          path: "transactions",
          icon: <TbTransactionDollar />,
        },
        pagePermissions.tickets && {
          title: "Tickets",
          path: "tickets",
          icon: <IoTicket />,
        },
        pagePermissions.flights && {
          title: "Flight Bookings",
          path: "flight-bookings",
          icon: <IoMdBookmark />,
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
      ].filter(Boolean),
    },
    {
      title: "Accounts",
      icon: <MdAccountBalanceWallet />,
      sublinks: [
        {
          title: "Banks",
          path: "banks",
          icon: <PiBankBold />,
        },
      ].filter(Boolean),
    },
    {
      title: "Settings",
      icon: <MdSettings />,
      sublinks: [
        pagePermissions.reasons && {
          title: "Reasons",
          path: "reasons",
          icon: <MdOutlineNoteAlt />,
        },
      ].filter(Boolean),
    },
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
    pagePermissions.help_and_support && {
      title: "Notifications",
      path: "notifications",
      icon: <MdDoorbell />,
    },
  ].filter(Boolean);
};
