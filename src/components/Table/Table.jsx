import React, { useState, useEffect } from "react";
import { Loader } from "../components";
import DataTable from "react-data-table-component";

const Table = ({
  columnsData,
  tableData,
  pagination,
  paginationTotalRows,
  paginationComponentOptions,
  noRowsPerPage,
  progressPending,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [paginatedData, setPaginatedData] = useState([]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    setPaginatedData(tableData?.slice(startIndex, endIndex));
  }, [tableData, currentPage, rowsPerPage]);

  const handlePageChange = (page) => {
    console.log("Page Changed to:", page);
    setCurrentPage(page);
  };

  const modifiedColumns = [
    {
      name: "NO",
      selector: (_, index) => (currentPage - 1) * rowsPerPage + index + 1,
      sortable: false,
    },
    ...columnsData?.map((col) => ({
      ...col,
      grow: col.grow || 2,
      wrap: col.wrap || true,
    })),
  ];

  return (
    <div className="container mx-auto overflow-x-auto ">
      <DataTable
        columns={modifiedColumns}
        data={paginatedData}
        pagination={pagination}
        paginationTotalRows={paginationTotalRows || tableData?.length}
        paginationComponentOptions={paginationComponentOptions}
        onChangePage={handlePageChange}
        paginationServer={true}
        noRowsPerPage={noRowsPerPage}
        noDataComponent={
          tableData?.length > 0 ? (
            <Loader />
          ) : (
            <div>There are no records to display</div>
          )
        }
        progressPending={progressPending}
        progressComponent={<Loader />}
        customStyles={{
          headRow: {
            style: {
              backgroundColor: "#4FA9A8",
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px",
              borderBottomWidth: "0px",
            },
          },
          headCells: {
            style: {
              justifyContent: "center",
              fontFamily: "Poppins",
              color: "#fff",
              fontSize: "16px",
              fontWeight: "bold",
              whiteSpace: "normal",
              wordBreak: "break-word",
            },
          },
          rows: {
            style: {
              fontSize: "13px",
            },
          },
          rowsBottom: {
            style: {
              borderBottomWidth: "1px",
            },
          },
          cells: {
            style: {
              justifyContent: "center",
            },
          },
        }}
      />
    </div>
  );
};

export default Table;
