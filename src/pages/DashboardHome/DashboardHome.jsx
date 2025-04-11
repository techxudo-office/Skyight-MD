import React from "react";
import { DashboardCards } from "../../components/components";

const DashboardHome = () => {
  return (
    <>
      <DashboardCards />
    </>
  );
};

export default DashboardHome;

// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getDummy } from "../../store/slices/yourSlice"; // update with actual slice path
// import { DashboardCards, Table } from "../../components/components";

// const columns = [
//   {
//     name: "Name",
//     selector: (row) => row.name,
//     sortable: true,
//   },
//   {
//     name: "Status",
//     selector: (row) => row.status,
//     sortable: true,
//   },
//   {
//     name: "Amount",
//     selector: (row) => row.amount,
//     sortable: true,
//   },
// ];

// const DashboardHome = () => {
//   const dispatch = useDispatch();

//   const dummyData = useSelector((state) => state.yourSlice.dummy); // update as per your store

//   useEffect(() => {
//     dispatch(getDummy());
//   }, [dispatch]);

//   const DataArray = [
//     {
//       title: "Latest Transactions",
//       tableData: dummyData.slice(0, 5),
//     },
//     {
//       title: "Refund Requests",
//       tableData: dummyData.slice(5, 10),
//     },
//     {
//       title: "Recent Bookings",
//       tableData: dummyData.slice(10, 15),
//     },
//     {
//       title: "Cancelled Orders",
//       tableData: dummyData.slice(15, 20),
//     },
//   ];

//   return (
//     <div className="px-5 pb-10 space-y-10">
//       <DashboardCards />

//       {DataArray.map((section, index) => (
//         <div key={index}>
//           <h2 className="mb-3 text-xl font-semibold">{section.title}</h2>
//           <Table
//             columnsData={columns}
//             tableData={section.tableData}
//             pagination={false}
//             noRowsPerPage={true}
//             progressPending={false}
//           />
//         </div>
//       ))}
//     </div>
//   );
// };

// export default DashboardHome;
