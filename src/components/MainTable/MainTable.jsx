import { useState } from "react";
import { FaEye, FaUndo } from "react-icons/fa";

const MainTable = ({ columns, data, actions }) => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(20);

  const filteredData = data.filter((row) =>
    columns.some((col) =>
      row[col.accessor]?.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + recordsPerPage);

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg">
      {/* Search Bar */}
      <div className="relative w-full max-w-sm mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="peer w-full border border-gray-300 rounded-lg p-2 pl-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder=" "
        />
        <label
          className="absolute left-3 top-2.5 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
        >
          Search...
        </label>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              {columns.map((col) => (
                <th key={col.accessor} className="px-4 py-2 border-b">
                  {col.header}
                </th>
              ))}
              <th className="px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                {columns.map((col) => (
                  <td key={col.accessor} className="px-4 py-2">
                    {row[col.accessor]}
                  </td>
                ))}
                <td className="px-4 py-2 flex gap-2">
                  <button className="text-blue-500 hover:text-blue-700">
                    <FaEye size={18} />
                  </button>
                  <button className="text-red-500 hover:text-red-700">
                    <FaUndo size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination & Records Per Page */}
      <div className="flex items-center justify-between mt-4">
        <div>
          <label className="mr-2 text-sm text-gray-600">Rows per page:</label>
          <select
            value={recordsPerPage}
            onChange={(e) => {
              setRecordsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-gray-300 p-1 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {[20, 25, 50, 100].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-1 border rounded-lg disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-2">Page {currentPage} of {totalPages}</span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="px-3 py-1 border rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainTable;
