import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { CardLayoutContainer, CardLayoutBody } from "../CardLayout/CardLayout";
import { Input, Button, Spinner } from "../components";
import { useDispatch, useSelector } from "react-redux";
import {
  editcommision,
  getCommision,
} from "../../_core/features/commisionSlice";
import { getAdminCredits } from "../../_core/features/bookingSlice";
import { GrDocumentUpdate } from "react-icons/gr";
import { Toaster } from "react-hot-toast";

Modal.setAppElement("#root");

const DashboardComission = () => {
  const dispatch = useDispatch();
  const { adminData } = useSelector((state) => state.persist);
  const { adminCredits } = useSelector((state) => state.booking);
  const { commisions, isEditingcommision, isLoadingCommision } = useSelector(
    (state) => state.commision
  );

  useEffect(() => {
    if (!adminData?.token) return;
    dispatch(getCommision(adminData?.token));
    dispatch(getAdminCredits(adminData.token));
  }, []);

  const [commision, setCommision] = useState(0);
  const [formData, setFormData] = useState({
    PKR: 0,
    IRR: 0,
    AED: 0,
    SAR: 0,
    TRY: 0,
    USD: 0,
    EUR: 0,
    IQD: 0,
    // commission: 0,
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
        // commission: commisions.commission || 0,
      });
      setCommision(commisions.commission || 0);
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
    dispatch(
      editcommision({
        data: { ...formData, commission: Number(commision) },
        token: adminData?.token,
      })
    );
  };
  if (isLoadingCommision) return <Spinner className={"text-primary"} />;
  return (
    <>
      <Toaster />
      <CardLayoutContainer className={"py-2"}>
        <CardLayoutBody removeBorder={true}>
          <div className="grid w-full grid-cols-3 gap-4">
            <div className="h-full col-span-2 ">
              <div className="flex gap-3 mb-3">
                <div className="grid w-2/3 grid-cols-4 gap-5 ">
                  {Object.keys(formData).map((key) => (
                    <div key={key}>
                      <Input
                        label={key.toUpperCase()}
                        name={key}
                        type="number"
                        value={formData[key]}
                        onChange={handleChange}
                        placeholder={`Enter ${key.toUpperCase()}`}
                      />
                    </div>
                  ))}
                </div>
                <div className="w-1/3 text-end text-text">
                  <p className="text-xs">Commisions</p>
                  <p className="text-3xl font-semibold">
                    {commisions.commission || 0}{" "}
                    <span className="text-sm text-gray">$</span>
                  </p>
                  <Input
                    className={"mt-5"}
                    label={"Commision"}
                    name={"commision"}
                    type="number"
                    value={commision}
                    onChange={(e) => setCommision(e.target.value)}
                    placeholder={`Enter Commision`}
                  />
                </div>
              </div>
              <Button
                icon={<GrDocumentUpdate />}
                text={isEditingcommision ? <Spinner /> : "Update"}
                onClick={handleSubmit}
                disabled={isEditingcommision}
              />
            </div>
            <div className="relative h-full col-span-1 overflow-hidden bg-primary rounded-xl">
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white">
                <h3 className="mb-2 text-lg font-semibold">Admin Credits</h3>
                <p className="text-3xl font-bold">{adminCredits ?? "—"}</p>
                <p className="mt-1 text-sm opacity-80">Available Balance</p>
              </div>
            </div>
          </div>
        </CardLayoutBody>
      </CardLayoutContainer>
    </>
  );
};

export default DashboardComission;
