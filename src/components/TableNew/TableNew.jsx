import React, { useEffect, useMemo } from 'react';
import { useState } from 'react';
import { useTable, usePagination } from 'react-table';
import { format } from 'date-fns';
import { TbCheck, TbChevronLeft, TbChevronLeftPipe, TbChevronRight, TbChevronRightPipe } from "react-icons/tb";
import { object } from 'yup';
import dayjs from 'dayjs';
import { CustomTooltip, DownloadButton, Input, Spinner } from '../components';
import { BsThreeDots } from 'react-icons/bs';
import { IoIosAirplane } from 'react-icons/io';
import { FaEdit, FaEye } from 'react-icons/fa';
import { Modal } from '../components'
import { logo } from '../../assets/Index';
import { MdDelete } from 'react-icons/md';
// import {Cell}  from "@table-library/react-table-library/table";

const TableNew = ({ columnsToView, tableData, actions, activeIndex, extraRows, onDeleteUser,downloadBtn }) => {
    // const data = React.useMemo(() => tableData, []);
    const data = tableData;
    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [finalRowsPerPage, setfinalRowsPerPage] = useState(15);
    const [loader, setLoader] = useState(true);
    const [extraRow, setExtraRow] = useState(null);
    const [toggle, setToggle] = useState(false);
    const [modal, setModal] = useState(false);
    const [maxLength, setmaxLength] = useState(null);
    const [editIdx, setEditIdx] = useState(null);


    console.log('tableData', tableData)
    // console.log('active in/dex', activeIndex)
    // console.log('columns', columnsToView)
    // console.log(extraRow);




    useEffect(() => {
        if (toggle) {
            setmaxLength(1000)
        } else {
            setmaxLength(15)
        }

    }, [toggle])
    useEffect(() => {
        setTimeout(() => {
            setLoader(false)
        }, 3000);
    }, [])


    console.log('filednames', extraRows)
    useEffect(() => {
        // it is to get the field names from tableData which are  present in extraRows an and show them when click on viw button action
        if (activeIndex != null & extraRows != undefined) {

            setExtraRow(Object.entries(tableData[activeIndex])
                .filter(([key]) => extraRows.includes(key))) // Compare key with fieldName values

        }
    }, [activeIndex]);


    const columnsView =
        columnsToView
            .filter(item => item.fieldName !== 'origin' && item.fieldName !== 'destination')
            .map((item, i) => {
                if (item.type == 'number') {
                    return {
                        Header: item.columnName,
                        accessor: item.fieldName,
                        Cell: ({ value }) => (
                            <span>
                                <p className={`text-text  text-sm `}>
                                    {Number(value).toLocaleString()}
                                </p>
                            </span>
                        )
                    }
                }
                else if (item.type == 'date') {
                    return {
                        Header: item.columnName,
                        accessor: item.fieldName,
                        Cell: ({ value }) => (
                            <span>
                                <p className={`text-text  text-sm `}>
                                    {dayjs(value).format('MMM-DD-YYYY')}
                                </p>
                            </span>
                        )
                    }
                }
                else if (item.type == 'text') {

                    return {
                        Header: item.columnName,
                        accessor: item.fieldName,
                        Cell: ({ value }) => {
                            const text = String(value)
                            return <span>
                                <p className={`text-xs md:text-sm `}>
                                    {text.length > 15 ? <span>{text.slice(0, 15)}...</span> : text}
                                </p>
                            </span>
                        }
                    }

                }
                if (item.columnName == 'Status') {
                    return {
                        Header: item.columnName,
                        accessor: item.fieldName,
                        Cell: ({ value }) => (
                            <span>
                                <p className={`text-xs md:text-sm w-40 md:w-44 mx-auto  border-[1px]  tracking-tight px-2 py-1  rounded-lg ${value == 'pending' ? 'text-yellowColor border-yellowColor bg-yellowbg' : value == 'requested-cancellation' || value == 'inactive' ? 'text-redColor border-redColor bg-redbg' : 'text-greenColor bg-greenbg border-greenColor'} font-semibold  capitalize`}>
                                    {value}
                                </p>
                            </span>
                        )
                    }
                }
                if (item.columnName === "Role") {
                    return {
                        Header: item.columnName,
                        accessor: item.fieldName,
                        Cell: ({ value, row }) => {
                            // Define role mappings
                            const roleMappings = {
                                super_admin: "Super Admin",
                                support_manager: "Support Manager",
                            };

                            // Format the value based on predefined mappings or capitalize dynamically
                            const formattedValue =
                                roleMappings[value] ||
                                value
                                    .replace(/_/g, " ") // Replace underscores with spaces
                                    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter

                            return (
                                <p className="flex items-center justify-center gap-2 text-sm text-text">
                                    {formattedValue}
                                </p>
                            );
                        },
                    };
                }
                else {
                    return {
                        Header: item.columnName,
                        accessor: item.fieldName,
                        Cell: ({ value }) => (
                            <span className="text-sm text-text">
                                {value}
                            </span>
                        )
                    }
                }


            }
            )


    const columns = React.useMemo(() => [
        {
            id: 'no',
            Header: "No.",
            accessor: (row, i) => i + 1, // Row index starting from 1
            Cell: ({ row }) => (
                <span className="text-sm text-text">{row.index + 1}</span>
            )
        },
        ...(tableData.some(item => 'origin' in item || 'destination' in item) ? [
            {

                Header: "Route",
                Cell: ({ row }) => (
                    <span className="flex items-center justify-center gap-2 text-sm text-text">
                        {row.original.origin}
                        <div className='flex items-center gap-1'>
                            <span className="h-0.5 w-3 bg-primary"></span>
                            <IoIosAirplane className="text-lg text-primary" />
                            <span className="h-0.5 w-3 bg-primary"></span>
                        </div>
                        {row.original.destination}
                    </span>
                )

            }

        ] : []),

        ...columnsView,

        // ...(tableData.some(item => 'role' in item || 'company_id' in item) ? [
        //     {

        //         Header: "Actions",
        //         id: 'actions2',
        //         Cell: ({ row }) => (
        //             <span className="flex items-center justify-center gap-2 text-sm text-text">
        //                 {row.original.role == "super_admin" &&
        //                     <div>
        //                         <FaEdit className='text-primary' onClick={() => setModal((prev) => !prev) & setEditIdx(row.index)} />
        //                         <MdDelete className='text-redColor' onClick={() => setModal(true)} />
        //                     </div>
        //                 }

        //             </span>
        //         )

        //     }

        // ] : []),

        // ...(downloadBtn ? [{
        //     Header: "Download Ticket",
        //     id: "Download",
        //     Cell: ({ row }) => (
        //         <span className="flex items-center justify-center gap-2 text-sm text-text">
        //                 <div>
        //                     <DownloadButton/>
        //                 </div>
                    

        //         </span>
        //     )

        // }]:[]

        // )
        ,
        ...(actions ? [{
            Header: 'Actions',
            // id: 'actions',
            Cell: ({ row }) => (
                <span className="relative flex items-center justify-center gap-2 text-lg text-text">
                    {
                        row.original.role ? row.original.role == 'Admin' && actions.map((action, idx) => (
                            <CustomTooltip key={idx} content={action.name}>
                                <div
                                    className="cursor-pointer "
                                    onClick={() => action.handler(row.index, tableData[row.index])}
                                >
                                    <div className=''>
                                        {action.icon}

                                    </div>
                                </div>
                            </CustomTooltip>
                        )) :
                            actions.map((action, idx) => (
                                <CustomTooltip key={idx} content={action.name}>
                                    <div
                                        className="cursor-pointer "
                                        onClick={() => action.handler(row.index, tableData[row.index])}
                                    >
                                        <div className='ml-2'>
                                            {action.icon}

                                        </div>


                                    </div>
                                </CustomTooltip>))}
                    {/* {activeIndex != null & activeIndex === row.index ?
                        <p className='absolute z-10 right-0 text-sm top-6 w-56 bg-white border-gray border-[1px] rounded-lg text-text px-3 py-1 shadow-lg font-semibold'>
                            {tableData[activeIndex].roleRights}
                        </p> : ''} */}
                </span>
            )

        }] : [])
    ], [activeIndex, tableData]);

    // [
    //     {
    //         Header: "No.",
    //         accessor: (row, i) => i + 1, // Row index starting from 1
    //         Cell: ({ row }) => (
    //             <span className="text-sm text-text">{row.index + 1}</span>
    //         )
    //     },
    //     {
    //         Header: "Booking ID",
    //         accessor: "booking_reference_id",
    //         Cell: ({ value }) => (
    //             <span className="text-sm font-semibold text-primary">
    //                 {value}
    //             </span>
    //         )
    //     },
    //     {
    //         Header: "Origin",
    //         accessor: "origin",
    //         Cell: ({ value }) => (
    //             <span className='text-xs text-text'>
    //                 {value}
    //             </span>
    //         )
    //     },
    //     {
    //         Header: "Destination",
    //         accessor: "destination",
    //         Cell: ({ value }) => (
    //             <span className='text-xs text-text'>
    //                 {value}
    //             </span>
    //         )
    //     },
    //     {
    //         Header: "Status",
    //         accessor: "booking_status",
    //         Cell: ({ value }) => (
    //             <span className={`text-sm   border-[1px]  tracking-tight the rows value should be center align with heading  px-2 py-1  rounded-lg ${value == 'pending' ? 'text-yellowColor border-yellowColor bg-yellowbg' : 'text-greenColor bg-greenbg border-greenColor'} font-semibold  capitalize`}>
    //                 {value}
    //             </span>
    //         )
    //     },
    //     {
    //         Header: "Fare",
    //         accessor: "total_fare",
    //         Cell: ({ value }) => (
    //             <span className='text-sm font-semibold text-text'>
    //                 {value}
    //             </span>
    //         )
    //     },
    //     {
    //         Header: "Created At",
    //         accessor: "created_at",
    //         Cell: ({ value }) => {
    //             const formattedDate = format(new Date(value), 'dd-MMM-yyyy');
    //             return (
    //                 <span className='text-sm text-text'>
    //                     {formattedDate}
    //                 </span>
    //             );
    //         }
    //     },
    //     {
    //         Header: "Rate",
    //         accessor: "rate",
    //         Cell: ({ value }) => (
    //             <span className='text-xs text-text'>
    //                 {value}
    //             </span>
    //         )
    //     },
    //     {
    //         Header: 'Currency',
    //         accessor: 'currency',
    //         Cell: ({ value }) => (
    //             <span className='text-xs text-text'>
    //                 {value}
    //             </span>
    //         )
    //     }
    // ]


    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,

        prepareRow,
        state: { pageIndex },
        setPageSize
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0, pageSize: finalRowsPerPage }
        },
        usePagination
    );
    useEffect(() => {
        setPageSize(Number(finalRowsPerPage)); // Ensure it's a number
    }, [finalRowsPerPage, setPageSize]);
    // console.log('headers', headerGroups)
    return (
        <div className="">

            <div className="container mx-auto overflow-x-auto shadow-md max-w- scrollbar-hide">
                <table className="min-w-full overflow-hidden bg-white rounded-lg " {...getTableProps()}>
                    {columnsToView.length > 0 && <thead className="bg-primary">
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => {
                                    // if (column == "Route")
                                    //     return <th
                                    //         colSpan={columns.length - 4}
                                    //         {...column.getHeaderProps()}
                                    //         className="py-4 text-sm font-bold tracking-wider text-center text-white uppercase px-7"
                                    //     >
                                    //         {column.render("Header")}
                                    //     </th>
                                    // else

                                    return <th
                                        {...column.getHeaderProps()}
                                        className="px-4 py-5 mx-5 text-sm font-bold tracking-wider text-center text-white uppercase"
                                    >
                                        {column.render("Header")}
                                    </th>
                                }
                                )}
                            </tr>
                        ))}
                    </thead>}
                    {tableData.length > 0 ?
                        <tbody {...getTableBodyProps()}>
                            {page.map((row) => {
                                prepareRow(row);
                                return (
                                    <>
                                        <tr {...row.getRowProps()} className="transition-colors hover:bg-slate-50">
                                            {row.cells.map((cell) => (
                                                <>
                                                    <td
                                                        {...cell.getCellProps()}
                                                        className="px-4 py-5 text-lg text-center border-t lg:px-6 text-text border-slate-100 "
                                                    >
                                                        {cell.render("Cell")}
                                                    </td>

                                                </>
                                            ))}
                                        </tr>
                                        {activeIndex !== null && extraRow != null && activeIndex === row.index ? (
                                            <tr className="w-full h-10 transition-colors bg-slate-200 text-text ">
                                                <td colSpan={columns.length} className="w-full p-10">
                                                    <div className='flex flex-col lg:justify-between lg:flex-row max-lg:items-center'>
                                                        <div className='lg:w-1/2'>
                                                            {extraRow.length > 1 ?
                                                                extraRow.map(([key, value], i) => (
                                                                    key == 'document_url' ?
                                                                        ''
                                                                        :
                                                                        <div key={i} className='flex gap-2 pb-2 text-sm'>
                                                                            <span className='font-semibold underline capitalize w-44 text-primary'>
                                                                                {key.replaceAll('_', ' ')}:
                                                                            </span>
                                                                            <span>{
                                                                                value && value.length > maxLength ?
                                                                                    <span className='flex items-end gap-1 font-semibold'>
                                                                                        <span className='font-semibold'>{value.slice(0, maxLength)}</span>
                                                                                        <BsThreeDots />
                                                                                    </span> :
                                                                                    value}
                                                                            </span>
                                                                        </div>
                                                                )) :
                                                                <div className='flex gap-3'>
                                                                    <span className='font-semibold underline capitalize text-primary'>
                                                                        {extraRow[0][0].replaceAll('_', ' ')}:
                                                                    </span>
                                                                    <span>{
                                                                        extraRow && extraRow[0][1].length > maxLength ?
                                                                            <span className='flex items-end gap-1 font-semibold'>
                                                                                <span className='font-semibold'>{extraRow[0][1].slice(0, maxLength)}</span><BsThreeDots />
                                                                            </span>
                                                                            :
                                                                            extraRow[0][1]}
                                                                    </span>
                                                                </div>
                                                            }
                                                        </div>
                                                        <div className='flex flex-col items-center px-10 lg:w-1/2 lg:items-end'>
                                                            <button className='border-[1px] border-primary text-primary capitalize bg-bluebg hover:text-secondary px-3 py-1  rounded-lg cursor-pointer w-fit max-lg:mt-4' onClick={() => setToggle((prev) => !prev)}>view Full Info</button>
                                                            {extraRow.filter(([key, value]) => (
                                                                key == 'document_url'
                                                            )).map(([key, value]) => (
                                                                <div className='flex items-center justify-center w-full my-4 lg:self-end '>
                                                                    <img className='lg:w-60 w-52 ' src={value} alt="" />
                                                                </div>
                                                            ))

                                                            }
                                                        </div>

                                                    </div>


                                                </td>
                                            </tr>
                                        ) : ''}
                                    </>
                                );
                            })}
                        </tbody> :


                        <tbody>
                            <tr>
                                <td colSpan={columns.length} className="w-full py-5 ">
                                    {loader ?

                                        <Spinner className={'text-primary mx-auto'} />
                                        :
                                        <h2 className='text-center capitalize text-text'>No Data Found</h2>
                                    }
                                </td>
                            </tr>

                        </tbody>


                    }
                </table>
            </div>
            {

            }

            {/* Paginaion  */}
            <div className="flex flex-wrap items-center justify-end gap-2 mx-6 my-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-text">Rows per page:</span>
                    <input
                        type="number" value={rowsPerPage} onChange={(e) => setRowsPerPage(e.target.value)}
                        className="flex items-center justify-center w-12 h-8 text-sm text-center border rounded-md text-text border-gray focus:border-primary focus:outline-none"
                    />{
                        rowsPerPage !== finalRowsPerPage &&
                        <TbCheck className='text-primary' onClick={() => setfinalRowsPerPage(rowsPerPage)} />
                    }
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-text">
                        Page{" "}
                        <strong>
                            {pageIndex + 1} of {pageOptions.length}
                        </strong>
                    </span>
                    <button
                        onClick={() => gotoPage(0)}
                        disabled={!canPreviousPage}
                        className="px-3 py-1 cursor-pointer rounded-md text-sm font-semibold text-text bg-white hover:bg-slate-50 border-[1px] border-gray disabled:opacity-50 hover:text-primary disabled:hover:text-text focus:outline-none focus:border-primary"
                    >
                        {<TbChevronLeftPipe size={20} />}
                    </button>
                    <button
                        onClick={() => previousPage()}
                        disabled={!canPreviousPage}
                        className="px-3 py-1 cursor-pointer rounded-md text-sm font-semibold text-text bg-white hover:bg-slate-50 border-[1px] border-gray disabled:opacity-50 hover:text-primary disabled:hover:text-text focus:outline-none focus:border-primary"
                    >
                        {<TbChevronLeft size={20} />}
                    </button>
                    <button
                        onClick={() => nextPage()}
                        disabled={!canNextPage}
                        className="px-3 py-1 cursor-pointer rounded-md text-sm font-semibold text-text bg-white hover:bg-slate-50 border-[1px] border-gray disabled:opacity-50 hover:text-primary disabled:hover:text-text focus:outline-none focus:border-primary"
                    >
                        {<TbChevronRight size={20} />}
                    </button>
                    <button
                        onClick={() => gotoPage(pageCount - 1)}
                        disabled={!canNextPage}
                        className="px-2 py-1 cursor-pointer rounded-md text-sm font-semibold text-text bg-white hover:bg-slate-50 border-[1px] border-gray disabled:opacity-50 hover:text-primary disabled:hover:text-text focus:outline-none focus:border-primary"
                    >
                        {<TbChevronRightPipe size={20} />}
                    </button>
                </div>
            </div>
            <Modal active={modal} imgsrc={logo} title={'Edit'} Message={
                <Input label={'Role'} name={'Role'} value={editIdx != null && tableData[editIdx].role} />
            } toggle={true} btnText={'update'} onClose={() => setModal(false)} />
        </div>
    );
};

export default TableNew;