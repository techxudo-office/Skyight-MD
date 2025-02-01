import React, { useEffect, useState } from "react";
import { Spinner } from "../components";

const Table = ({ columns, data, viewColumns, actions, activeIndex }) => {
  const [loaderStatus, setLoaderStatus] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoaderStatus(false);
    }, 3000);
  }, []);

  return (
    <>
      <table className="min-w-full bg-white rounded-2xl shadow-sm">
        <thead>
          <tr className="text-white font-semibold border-b border-slate-200">
            {columns.length > 0
              ? columns.map((column, columnIndex) => {
                  return (
                    <th
                      key={columnIndex}
                      className="custom-table-th bg-primary p-4 text-left text-md font-semibold text-gray-600"
                    >
                      {column.columnName}
                    </th>
                  );
                })
              : ""}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, dataIndex) => {
              return (
                <React.Fragment key={dataIndex}>
                  <tr
                    className={`${dataIndex % 2 ? "bg-slate-50" : "bg-white"}`}
                  >
                    {columns.map((column, columnKey) => {
                      return column.type === "no." ? (
                        <td
                          key={columnKey}
                          className="px-4 py-3 text-sm text-slate-500"
                        >
                          #{dataIndex + 1}
                        </td>
                      ) : column.type === "id" ? (
                        <td
                          key={columnKey}
                          className="px-4 py-3 text-sm text-slate-500"
                        >
                          {item[column.fieldName]
                            ? item[column.fieldName]
                            : "-"}
                        </td>
                      ) : column.type === "text" ? (
                        <td
                          key={columnKey}
                          className="px-4 py-3 text-sm text-slate-500"
                        >
                          {item[column.fieldName]
                            ? item[column.fieldName]
                            : "-"}
                        </td>
                      ) : column.type === "img" ? (
                        <td
                          key={columnKey}
                          className="px-4 py-3 text-sm text-slate-500"
                        >
                          <img
                            loading="lazy"
                            src={
                              item[column.fieldName]
                                ? item[column.fieldName]
                                : "-"
                            }
                            className="h-10"
                          />
                        </td>
                      ) : column.type === "status" ? (
                        <td
                          key={columnKey}
                          className="px-4 py-3 text-sm font-semibold capitalize"
                        >
                          <span
                            className={`text-center rounded-full px-3 py-1 ${
                              item[column.fieldName] === "active" || item[column.fieldName] === "approved" || item[column.fieldName] === "open"
                                ? "bg-green-100 text-green-500"
                                : "bg-red-100 text-red-500"
                            }`}
                          >
                               {item[column.fieldName]
                              ? item[column.fieldName]
                              : "-"}
                          </span>
                        </td>
                      ) : (
                        ""
                      );
                    })}
                    <td className="px-4 h-[64px] flex items-center justify-start">
                      {actions
                        ? actions.map((action, actionIndex) => {
                          {/* console.log(action, actionIndex) */}
                            return (
                              <span
                                className="cursor-pointer hover:bg-blue-50 p-2 rounded-full text-lg"
                                key={actionIndex}
                                onClick={() => [
                                  action.handler(dataIndex, item),
                                ]}
                              >
                                {action.icon}
                              </span>
                            );
                          })
                        : ""}
                    </td>
                  </tr>
                  {
                    <tr
                      key={dataIndex}
                      className={`bg-blue-100 transition-all ${
                        activeIndex === dataIndex ? "visible" : "hidden"
                      }`}
                    >
                      <td colSpan={columns && columns.length - 3}>
                        {viewColumns
                          ? viewColumns.map((column, columnIndex) => {
                              return column.type === "id" ? (
                                <div
                                  key={columnIndex}
                                  className="px-4 py-3 text-sm text-slate-500"
                                >
                                  <p className="text-text font-semibold">
                                    {[column.columnName]}
                                  </p>
                                  <span>
                                  {item[column.fieldName]
                                      ? item[column.fieldName]
                                      : "-"}
                                  </span>
                                </div>
                              ) : column.type === "text" ? (
                                <div
                                  key={columnIndex}
                                  className="px-4 py-3 text-sm text-slate-500"
                                >
                                  <p className="text-text font-semibold">
                                    {[column.columnName]}
                                  </p>
                                  <span>
                                    {item[column.fieldName]
                                      ? item[column.fieldName]
                                      : "-"}
                                  </span>
                                </div>
                              ) : (
                                ""
                              );
                            })
                          : ""}
                      </td>
                      <td colSpan={3}>
                        {viewColumns
                          ? viewColumns.map((column, columnIndex) => {
                              return column.type === "img" ? (
                                <div
                                  key={columnIndex}
                                  className="px-4 py-3 text-sm text-slate-500"
                                >
                                  {/* <p className="text-text font-semibold">
                                    {[column.columnName]}
                                  </p> */}
                                  <img
                                    loading="lazy"
                                    src={
                                      item[column.fieldName]
                                        ? item[column.fieldName]
                                        : "-"
                                    }
                                    className="h-96 "
                                  />
                                </div>
                              ) : (
                                ""
                              );
                            })
                          : ""}
                      </td>
                    </tr>
                  }
                </React.Fragment>
              );
            })
          ) : (
            <tr>
              <td className="px-4 py-3 text-center" colSpan={columns.length}>
                {loaderStatus ? (
                  <Spinner className={"text-primary"} />
                ) : (
                  <h2 className="text-xl">Data not found</h2>
                )}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};

export default Table;
