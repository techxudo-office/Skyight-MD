import { useState } from "react";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
  CardLayoutFooter,
} from "../../components/CardLayout/CardLayout";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import Spinner from "../../components/Spinner/Spinner";
import SecondaryButton from "../../components/SecondaryBtn/SecondaryBtn";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { createOffer } from "../../_core/features/offerSlice";

const CreateOffer = () => {
  const navigate = useNavigate();
  const [modalstatus, setModalstatus] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const dispatch = useDispatch();
  const { adminData } = useSelector((state) => state.persist);
  const { isCreatingOffer } = useSelector((state) => state.offer);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Please enter title");
    if (!description.trim()) return toast.error("Please enter description");
    if (!image) return toast.error("Please upload an image");

    setModalstatus(true);
  };

  const handleAddOffer = () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", image);

    setModalstatus(false);
    dispatch(createOffer({ token: adminData?.token, data: formData }))
      .unwrap()
      .then(() => {
        navigate("/dashboard/offers");
      });
  };

  return (
    <CardLayoutContainer>
      <ConfirmModal
        text={"Is the information you provide correct?"}
        loading={isCreatingOffer}
        onConfirm={handleAddOffer}
        onAbort={() => setModalstatus(false)}
        status={modalstatus}
      />

      <CardLayoutHeader
        heading="Create Offer"
        className="flex items-center justify-between"
      />

      <CardLayoutBody>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 md:gap-5 mb-7">
          <Input
            label="Title*"
            value={title}
            className={"mt-4"}
            placeholder="Enter Title"
            onChange={(e) => setTitle(e.target.value)}
          />

          <Input
            label="Description*"
            value={description}
            className={"mt-4"}
            placeholder="Enter Description"
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="">
            <p className="text-sm font-medium text-gray-700 ">Image*</p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full px-3 py-2 text-sm border rounded-md"
            />
            {image && (
              <p className="mt-1 text-xs text-green-600">
                Selected: {image.name}
              </p>
            )}
          </div>
        </div>
      </CardLayoutBody>

      <CardLayoutFooter className="flex gap-1">
        <SecondaryButton text="Cancel" onClick={() => navigate(-1)} />
        <Button
          text={isCreatingOffer ? <Spinner /> : "Create Offer"}
          disabled={isCreatingOffer}
          onClick={handleSubmit}
        />
      </CardLayoutFooter>
    </CardLayoutContainer>
  );
};

export default CreateOffer;
