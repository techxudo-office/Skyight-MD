import { useEffect, useState } from "react";
import Input from "../Input/Input";
import Button from "../Button/Button";
import Spinner from "../Spinner/Spinner";
import { useDispatch, useSelector } from "react-redux";
import {
  editcommision,
  getCommision,
} from "../../_core/features/commisionSlice";
import {
  editAdminCredits,
  getAdminCredits,
} from "../../_core/features/bookingSlice";
import { GrDocumentUpdate } from "react-icons/gr";
import { CardLayoutContainer, CardLayoutBody } from "../CardLayout/CardLayout";

const DashboardComission = () => {
  const dispatch = useDispatch();

  const [credits, setCredits] = useState(0); // Admin credit amount
  const [commision, setCommision] = useState(0); // Overall commission value

  const { adminData } = useSelector((state) => state.persist);
  const { isEditingAdminCredits } = useSelector((state) => state.booking);
  const { commisions, isEditingcommision, isLoadingCommision } = useSelector(
    (state) => state.commision
  );

  // Form state for individual currency commission values
  const [formData, setFormData] = useState({
    PKR: 0,
    IRR: 0,
    AED: 0,
    SAR: 0,
    TRY: 0,
    USD: 0,
    EUR: 0,
    IQD: 0,
  });

  useEffect(() => {
    // Fetch commission and admin credits when component mounts
    if (!adminData?.token) return;

    dispatch(getCommision(adminData?.token));

    dispatch(getAdminCredits(adminData.token)).then(
      (resp) => setCredits(resp.payload) // Update local state with fetched credits
    );
  }, []);

  useEffect(() => {
    // Pre-fill form with fetched commission data when available
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
      });
      setCommision(commisions.commission || 0);
    }
  }, [commisions]);

  // Handle individual currency field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: Number(value), // Ensure numeric type
    }));
  };

  // Submit updated commission data to backend
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
      <CardLayoutContainer className={"py-2"}>
        <CardLayoutBody removeBorder={true}>
          <div className="grid w-full grid-cols-3 gap-4">
            <div className="h-full col-span-2 ">
              <div className="flex gap-3 mb-3">
                {/* Grid of currency commission inputs */}
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

                {/* Overall commission section */}
                <div className="w-1/3 text-end text-text">
                  {/* <p className="text-xs">Commisions</p>
                  <p className="text-3xl font-semibold">
                    {commisions.commission || 0}{" "}
                    <span className="text-sm text-gray">$</span>
                  </p> */}
                  <Input
                    // className={"mt-5"}
                    label={"Commision"}
                    name={"commision"}
                    type="number"
                    value={commision}
                    onChange={(e) => setCommision(e.target.value)}
                    placeholder={`Enter Commision`}
                  />
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

              {/* Update button for commission */}
              <Button
                text={"Update"}
                onClick={handleSubmit}
                icon={<GrDocumentUpdate />}
                loading={isEditingcommision}
                disabled={isEditingcommision}
              />
            </div>

            {/* Admin credits section */}
            <div className="flex flex-col items-center justify-center col-span-1 p-6 text-white bg-primary rounded-xl">
              <h3 className="mb-2 text-lg font-semibold">Admin Credits</h3>
              <Input
                name="adminCredits"
                type="number"
                value={credits}
                onChange={(e) => {
                  setCredits(e.target.value);
                }}
                className="mb-3 text-black"
                placeholder="Enter Credits"
              />
              <Button
                text="Save"
                onClick={() => {
                  // Dispatch action to update admin credits
                  dispatch(
                    editAdminCredits({
                      data: { amount: Number(credits) },
                      token: adminData.token,
                    })
                  );
                }}
                loading={isEditingAdminCredits}
                disabled={isEditingAdminCredits}
              />
            </div>
          </div>
        </CardLayoutBody>
      </CardLayoutContainer>
    </>
  );
};

export default DashboardComission;
