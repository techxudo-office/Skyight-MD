import { AiFillHome } from "react-icons/ai";
import { FaSquarePollHorizontal } from "react-icons/fa6";
import {
  MdAccountBalanceWallet,
  MdCancelScheduleSend,
  MdDoorbell,
  MdEditSquare,
  MdOutlineGroups,
  MdOutlineNoteAlt,
} from "react-icons/md";
import { FaBusinessTime } from "react-icons/fa6";
import { TbTransactionDollar } from "react-icons/tb";
import { PiBankBold } from "react-icons/pi";
import { IoTicket } from "react-icons/io5";
import { FaUserShield, FaUser } from "react-icons/fa";
import { VscGitStashApply } from "react-icons/vsc";
import { BiSolidDollarCircle } from "react-icons/bi";
import { HiRectangleGroup } from "react-icons/hi2";
import { IoMdBookmark } from "react-icons/io";
import { RiRefund2Fill } from "react-icons/ri";
export const sidebarLinks = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: <HiRectangleGroup />,
  },
  {
    title: "Companies",
    path: "companies",
    icon: <HiRectangleGroup />,
  },
  {
    title: "Apply Commisions",
    path: "apply-commisions",
    icon: <BiSolidDollarCircle />,
  },
  {
    title: "Bookings",
    icon: <IoMdBookmark />,
    sublinks: [
      {
        title: "Transactions",
        path: "transactions",
        icon: <TbTransactionDollar />,
      },
      {
        title: "Tickets",
        path: "tickets",
        icon: <IoTicket />,
      },
      {
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
    ],
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
    ],
  },
  {
    title: "Settings",
    icon: <MdAccountBalanceWallet />,
    sublinks: [
      {
        title: "Reasons",
        path: "reasons",
        icon: <MdOutlineNoteAlt />,
      },
    ],
  },
  {
    title: "Users",
    icon: <MdOutlineGroups />,
    sublinks: [
      {
        title: "Roles",
        path: "roles",
        icon: <FaSquarePollHorizontal />,
      },
      // {
      //   title: "Users",
      //   path: "users",
      //   icon: <FaUser />,
      // },
      {
        title: "Admins",
        path: "admins",
        icon: <FaUserShield />,
      },
    ],
  },
  {
    title: "Notifications",
    path: "notifications",
    icon: <MdDoorbell />,
  },
];