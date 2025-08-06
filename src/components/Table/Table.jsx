import { useState, useEffect } from "react";
import Loader from "../Loader/Loader";
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
  const [currentPage, setCurrentPage] = useState(1); // Tracks current page number
  const [rowsPerPage, setRowsPerPage] = useState(10); // Number of rows shown per page
  const [paginatedData, setPaginatedData] = useState([]); // Data sliced according to pagination

  useEffect(() => {
    // On changes to data or pagination state, calculate the slice of data to show
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    setPaginatedData(tableData?.slice(startIndex, endIndex));
  }, [tableData, currentPage, rowsPerPage]);

  const handlePageChange = (page) => {
    // Updates current page when user changes pagination
    setCurrentPage(page);
  };

  // Add a "NO" column to display the row number across pages
  const modifiedColumns = [
    {
      name: "NO",
      selector: (_, index) => (currentPage - 1) * rowsPerPage + index + 1, // Calculate global row number
      sortable: false,
      grow: 0,
    },
    // Enhance each column with default props if not defined
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
        data={paginatedData} // Pass only the current slice of data
        pagination={pagination}
        paginationTotalRows={paginationTotalRows || tableData?.length} // Needed for server-side pagination UI
        paginationComponentOptions={paginationComponentOptions}
        onChangePage={handlePageChange} // Triggers data slice update
        paginationServer={true} // Enables manual pagination handling
        noRowsPerPage={noRowsPerPage} // Optionally hides rows-per-page dropdown
        noDataComponent={
          tableData?.length > 0 ? (
            <Loader /> // Shows loader if data exists but still loading
          ) : (
            <div className="w-full text-center bg-background text-yellowColor">
              There are no records to display
            </div>
          )
        }
        progressPending={progressPending} // Boolean to indicate loading state
        progressComponent={<Loader />} // Custom loading indicator
        customStyles={{
          table: {
            style: {
              backgroundColor: "#4FA9A8",
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px",
              borderBottomWidth: "0px",
              maxWidth: "100%"
            },
          },
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
              padding: "8px 0px"// Centers content horizontally
            },
          },
        }}
      />
    </div>
  );
};

export default Table;
