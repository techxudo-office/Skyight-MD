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
    title: "Reasons",
    path: "reasons",
    icon: <MdOutlineNoteAlt />,
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
      {
        title: "Users",
        path: "users",
        icon: <FaUser />,
      },
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

// import {
//   MdFlight,
//   MdOutlineReadMore,
//   MdSearch,
//   MdSupervisedUserCircle,
//   MdContentPasteSearch,
//   MdAdminPanelSettings,
//   MdOutlineHistory,
// } from "react-icons/md";
// import { HiUsers } from "react-icons/hi";
// import { useSelector } from "react-redux";
// import { IoTicket } from "react-icons/io5";
// import { RiDashboardFill } from "react-icons/ri";
// import { BiSolidBookmarks } from "react-icons/bi";
// import { FaBusinessTime, FaMoneyBill1Wave } from "react-icons/fa6";

// export const useSidebarLinks = () => {
//   const { userData } = useSelector((state) => state.auth);
//   const pagePermissions = userData?.user?.role?.page_permission || {
//     dashboard: true,
//     flights: true,
//     bookings: true,
//     credits: true,
//     transactions: true,
//     history: true,
//     administrators: true,
//     tickets: true,
//     help_and_support: true,
//   };

//   return [
//     pagePermissions.dashboard && {
//       title: "Dashboard",
//       path: "/dashboard",
//       icon: <RiDashboardFill />,
//     },
//     pagePermissions.flights && {
//       title: "Search",
//       icon: <MdContentPasteSearch />,
//       sublinks: [
//         {
//           title: "Search Flights",
//           path: "/dashboard/search-flights",
//           icon: <MdFlight />,
//         },
//       ],
//     },
//     pagePermissions.bookings && {
//       title: "Bookings",
//       icon: <FaBusinessTime />,
//       sublinks: [
//         {
//           title: "Flight Bookings",
//           path: "/dashboard/flight-bookings",
//           icon: <BiSolidBookmarks />,
//         },
//       ],
//     },
//     pagePermissions.transactions && {
//       title: "Transactions",
//       icon: <FaMoneyBill1Wave />,
//       sublinks: [
//         {
//           title: "Transaction History",
//           path: "/dashboard/transactions",
//           icon: <MdOutlineHistory />,
//         },
//       ],
//     },
//     pagePermissions.administrators && {
//       title: "Administrator",
//       icon: <MdAdminPanelSettings />,
//       sublinks: [
//         {
//           title: "Roles",
//           path: "/dashboard/roles",
//           icon: <MdSupervisedUserCircle />,
//         },
//         {
//           title: "Users",
//           path: "/dashboard/users",
//           icon: <HiUsers />,
//         },
//       ],
//     },
//     pagePermissions.tickets && {
//       title: "Support",
//       icon: <IoTicket />,
//       sublinks: [
//         {
//           title: "Tickets",
//           path: "/dashboard/view-tickets",
//           icon: <IoTicket />,
//         },
//       ],
//     },
//     pagePermissions.history && {
//       title: "History",
//       icon: <IoTicket />,
//       sublinks: [
//         {
//           title: "Search",
//           path: "/dashboard/search-history",
//           icon: <MdSearch />,
//         },
//         {
//           title: "Booking",
//           path: "/dashboard/booking-history",
//           icon: <IoTicket />,
//         },
//         {
//           title: "Order",
//           path: "/dashboard/order-history",
//           icon: <MdOutlineReadMore />,
//         },
//       ],
//     },
//   ].filter(Boolean);
// };
