import { AiFillHome } from "react-icons/ai";
import { FaSquarePollHorizontal } from "react-icons/fa6";
import { MdEditSquare } from "react-icons/md";
import { FaBusinessTime } from "react-icons/fa6";
import { TbTransactionDollar } from "react-icons/tb";
import { PiBankBold } from "react-icons/pi";
import { IoTicket } from "react-icons/io5";
import { FaUserShield, FaUser } from "react-icons/fa";
import { VscGitStashApply } from "react-icons/vsc";

export const sidebarLinks = [
  {
    title: "Home",
    path: "/",
    icon: <AiFillHome />,
  },
  {
    title: "Apply Commisions",
    path: "/apply-commisions",
    icon: <VscGitStashApply />,
  },
  {
    title: "Flight Bookings",
    path: "/flight-bookings",
    icon: <FaBusinessTime />,
  },
  {
    title: "Transactions",
    path: "/transactions",
    icon: <TbTransactionDollar />,
  },
  {
    title: "Tickets",
    path: "/tickets",
    icon: <IoTicket />,
  },
  {
    title: "Refund Requests",
    path: "/refund-requests",
    icon: <FaBusinessTime />,
  },
  {
    title: "Cancel Requests",
    path: "/cancel-requests",
    icon: <FaBusinessTime />,
  },
  // {
  //   title: "Date Change",
  //   path: "/date-change",
  //   icon: <FaBusinessTime />,
  // },
  {
    title: "Banks",
    path: "/banks",
    icon: <PiBankBold />,
  },
  {
    title: "Reasons",
    path: "/reasons",
    icon: <MdEditSquare />,
  },
  {
    title: "Companies",
    path: "/companies",
    icon: <MdEditSquare />,
  },
  {
    title: "Roles",
    path: "/roles",
    icon: <FaSquarePollHorizontal />,
  },
  {
    title: "Users",
    path: "/users",
    icon: <FaUser />,
  },
  {
    title: "Admins",
    path: "/admins",
    icon: <FaUserShield />,
  },
];
