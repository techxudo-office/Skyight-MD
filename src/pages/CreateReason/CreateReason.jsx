import { useState } from "react";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
  CardLayoutFooter,
} from "../../components/CardLayout/CardLayout";
import Button from "../../components/Button/Button";
import Spinner from "../../components/Spinner/Spinner";
import SecondaryButton from "../../components/SecondaryBtn/SecondaryBtn";
import TextArea from "../../components/TextArea/TextArea";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { createReason } from "../../_core/features/reasonsSlice";

const CreateReason = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const { adminData } = useSelector((state) => state.persist);
  const { isCreatingReason, createReasonError } = useSelector(
    (state) => state.reasons
  );
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (reason.trim().length < 4) {
      toast.error("Reason must be at least 4 characters.");
      return;
    } else {
      dispatch(
        createReason({ token: adminData?.token, data: { reason: reason } })
      ).then(() => {
        if (!createReasonError) {
          navigate("/dashboard/reasons");
        }
      });
    }
  };

  return (
    <>
      <CardLayoutContainer>
        <CardLayoutHeader heading="Create Reason" />

        <CardLayoutBody>
          <div className="relative">
            <TextArea
              placeholder="Enter Reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </CardLayoutBody>
        <CardLayoutFooter className="flex gap-1">
          <div onClick={() => navigate(-1)}>
            <SecondaryButton text="Cancel" />
          </div>
          <div>
            <Button
              loading={isCreatingReason}
              onClick={handleSubmit}
              text={loading ? <Spinner /> : "Create Reason"}
              disabled={loading}
            />
          </div>
        </CardLayoutFooter>
      </CardLayoutContainer>
    </>
  );
};

export default CreateReason;
