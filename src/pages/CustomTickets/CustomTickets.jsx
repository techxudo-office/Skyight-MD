import { useEffect, useState } from "react";
import {
    CardLayoutContainer,
    CardLayoutHeader,
    CardLayoutBody,
} from "../../components/CardLayout/CardLayout";
import { MdEditSquare } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import { MdAutoDelete } from "react-icons/md";
import Tag from "../../components/Tag/Tag";
import Table from "../../components/Table/Table";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import SecondaryButton from "../../components/SecondaryBtn/SecondaryBtn";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteCustomTicket, getCustomTickets } from "../../_core/features/bookingSlice";
// import EditCustomTicketModal from "./EditCustomTicketModal/EditCustomTicketModal";
import useLogout from "../../hooks/useLogout";
import toast from "react-hot-toast";

const CustomTickets = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const logoutHandler = useLogout();
    const [deleteId, setDeleteId] = useState(null);
    const [modalStatus, setModalStatus] = useState(false);
    const [editCustomTicketData, setEditCustomTicketData] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const { customTickets, isLoadingCustomTickets, isDeletingCustomTicket } = useSelector((state) => state.booking);
    const { adminData } = useSelector((state) => state.persist);

    useEffect(() => {
        if (!adminData?.token) return;
        dispatch(getCustomTickets({ token: adminData.token, logoutHandler }));
    }, [dispatch, adminData?.token]);

    const customTicketColumns = [
        {   
            name: "ORIGIN",
            selector: (row) => row.origin,
            sortable: false,
        },
        {
            name: "DESTINATION",
            selector: (row) => row.destination,
            sortable: false,
        },
        {
            name: "PRICE",
            selector: (row) => row.price,
            sortable: false,
        },
        {
            name: "",
            selector: (row) => {
                return (
                    <div className="flex items-center gap-x-4">
                        <span
                            className="text-xl cursor-pointer"
                            onClick={() => {
                                setEditCustomTicketData(row);
                                setIsEditModalOpen(true);
                            }}
                        >
                            <MdEditSquare title="Edit" className="text-blue-500" />
                        </span>
                        <span
                            className="text-xl cursor-pointer"
                            onClick={() => {
                                setModalStatus(true);
                                setDeleteId(row.id);
                            }}
                        >
                            <MdAutoDelete title="Delete" className="text-red-500" />
                        </span>
                    </div>
                );
            },
            sortable: false,
        },
    ];

    const deleteUserHandler = () => {
        if (!deleteId) {
            toast.error("Failed to delete this user");
            setModalStatus(false);
            return;
        }

        dispatch(deleteCustomTicket({ id: deleteId, token: adminData?.token })).then(() => {
            setModalStatus(false);
            setDeleteId(null);
        });
    };

    const abortDeleteHandler = () => {
        setModalStatus(false);
        setDeleteId(null);
    };

    return (
        <>
            <ConfirmModal
                status={modalStatus}
                loading={isDeletingCustomTicket}
                onAbort={abortDeleteHandler}
                onConfirm={deleteUserHandler}
                text={"Are you sure you want to delete this custom ticket?"}
            />
            {/* {isEditModalOpen && (
                <EditCustomTicketModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    customTicketData={editCustomTicketData}
                />
            )} */}
            <CardLayoutContainer removeBg={true}>
                <CardLayoutHeader
                    removeBorder={true}
                    heading={"Custom Tickets"}
                    className="flex items-center justify-between"
                >
                    <div className="relative">
                        <SecondaryButton
                            text={"Create New Custom Ticket"}
                            icon={<FaPlus />}
                            onClick={() => {
                                navigate("/dashboard/create-custom-ticket");
                            }}
                            className="mb-4"
                        />
                    </div>
                </CardLayoutHeader>
                <CardLayoutBody removeBorder={true}>
                    <Table
                        pagination={true}
                        columnsData={customTicketColumns}
                        tableData={customTickets || []}
                        progressPending={isLoadingCustomTickets}
                        paginationTotalRows={customTickets?.length}
                        paginationComponentOptions={{ noRowsPerPage: "10" }}
                    />
                </CardLayoutBody>
            </CardLayoutContainer>
        </>
    );
};

export default CustomTickets;
