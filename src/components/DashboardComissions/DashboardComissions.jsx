import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import {
    CardLayoutContainer,
    CardLayoutHeader,
    CardLayoutBody,
    CardLayoutFooter,
} from "../CardLayout/CardLayout";
import {
    Input,
    Button,
    Spinner,
    ModalWrapper,
} from "../components";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { editcommision } from "../../_core/features/commisionSlice";

Modal.setAppElement("#root");

const DashboardComission = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const { adminData } = useSelector((state) => state.auth);
    const { commisions, isEditingcommision } = useSelector(
        (state) => state.commision
    );
    const [penalty, setPenalty] = useState(0);
    const [formData, setFormData] = useState({
        PKR: 0,
        IRR: 0,
        AED: 0,
        SAR: 0,
        TRY: 0,
        USD: 0,
        EUR: 0,
        IQD: 0,
        commission: 0,
    });

    useEffect(() => {
        if (commisions) {
            setFormData({
                PKR: commisions.PKR || 0,
                IRR: commisions.IRR || 0,
                AED: commisions.AED || 0,
                SAR: commisions.SAR || 0,
                TRY: commisions.TRY || 0,
                USD: commisions.USD || 0,
                EUR: commisions.EUR || 0,
                IQD: commisions.IQD || 0,
                commission: commisions.commission || 0,
            });
        }
    }, [commisions]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: Number(value),
        }));
    };

    const handleSubmit = () => {
        dispatch(editcommision({ data: formData, token: adminData?.token })).then(
            () => {
                onClose();
            }
        );
    };

    return (

        <CardLayoutContainer className={"w-2/3"} >
            <div className="flex items-center gap-3">
                <CardLayoutHeader heading="Edit Commision" removeBorder={true} />

                <Button
                    text={isEditingcommision ? <Spinner /> : "Update Commission"}
                    onClick={handleSubmit}
                    disabled={isEditingcommision}
                />
            </div>
            <CardLayoutBody>
                <div className="grid grid-cols-3 gap-5 ">
                    {Object.keys(formData).map((key) => (
                        <div key={key}>
                            <Input
                                label={key.toUpperCase()}
                                name={key}
                                type="number"
                                value={formData[key]}
                                onChange={handleChange}
                                min=""
                                placeholder={`Enter ${key.toUpperCase()}`}
                            />
                        </div>
                    ))}
                </div>
            </CardLayoutBody>
            <CardLayoutFooter >

            </CardLayoutFooter>
        </CardLayoutContainer>

    );
};

export default DashboardComission;
