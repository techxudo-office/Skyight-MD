import { useEffect, useState } from "react";
import Table from "../../components/Table/Table";
import SecondaryButton from "../../components/SecondaryBtn/SecondaryBtn";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import ModalWrapper from "../../components/ModalWrapper/ModalWrapper";
import TextArea from "../../components/TextArea/TextArea";
import Button from "../../components/Button/Button";
import CustomTooltip from "../../components/CustomTooltip/CustomTooltip";
import Searchbar from "../../components/Searchbar/Searchbar";
import {
  deleteOffer,
  editOffer,
  getOffers,
} from "../../_core/features/offerSlice";
import { useNavigate } from "react-router-dom";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
  CardLayoutFooter,
} from "../../components/CardLayout/CardLayout";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { MdAdd, MdDelete, MdEditSquare } from "react-icons/md";
import toast from "react-hot-toast";
import useLogout from "../../hooks/useLogout";

const Offers = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logoutHandler = useLogout();

  const [filteredOffers, setFilteredOffers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    image: null,
  });

  const { adminData } = useSelector((state) => state.persist);
  const { offers, isLoadingOffers, isDeletingOffer, isEditingOffer } =
    useSelector((state) => state.offer);

  const [modalObject, setModalObject] = useState({
    status: false,
    text: "",
    loading: false,
    onAbort: () => {},
    onConfirm: () => {},
  });
  const [modalWrapper, setModalWrapper] = useState({
    header: null,
    isOpen: false,
    contentLabel: "",
    onRequestClose: () => {},
  });

  useEffect(() => {
    if (adminData?.token) {
      dispatch(getOffers({ token: adminData.token, logoutHandler }));
    }
  }, [adminData?.token, dispatch]);

  useEffect(() => {
    setFilteredOffers(offers);
  }, [offers]);

  const columns = [
    { name: "Title", selector: (row) => row.title, wrap: true, grow: 2 },
    {
      name: "Description",
      selector: (row) => row.description,
      wrap: true,
      grow: 2,
    },
    {
      name: "Date",
      selector: (row) => dayjs(row.created_at).format("DD-MMM-YYYY"),
      grow: 2,
    },
    {
      name: "",
      selector: (row) => (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() =>
              setModalObject({
                status: true,
                text: `Are you sure you want to delete offer id ${row.id}?`,
                onAbort: () => setModalObject((p) => ({ ...p, status: false })),
                onConfirm: () => {
                  dispatch(deleteOffer({ token: adminData.token, id: row.id }))
                    .unwrap()
                    .then(() =>
                      setModalObject((p) => ({ ...p, status: false }))
                    );
                },
              })
            }
          >
            <CustomTooltip content="Delete Offer">
              <MdDelete className="text-lg text-redColor" />
            </CustomTooltip>
          </button>
          <button
            onClick={() => {
              setEditId(Number(row.id));
              setFormValues({
                title: row.title,
                description: row.description,
                image: null,
              });
              setModalWrapper({
                header: `Edit Offer ID ${row.id}`,
                isOpen: true,
                contentLabel: `edit-offer-${row.id}`,
                onRequestClose: () =>
                  setModalWrapper((p) => ({ ...p, isOpen: false })),
              });
            }}
          >
            <CustomTooltip content="Edit Offer">
              <MdEditSquare className="text-lg text-blueColor" />
            </CustomTooltip>
          </button>
        </div>
      ),
      wrap: true,
    },
  ];

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormValues((p) => ({ ...p, image: files[0] }));
    } else {
      setFormValues((p) => ({ ...p, [name]: value }));
    }
  };

  const handleEdit = () => {
    const { title, description, image } = formValues;
    if (title.trim().length < 4) {
      toast.error("Title must be at least 4 characters.");
      return;
    }
    if (description.trim().length < 10) {
      toast.error("Description must be at least 10 characters.");
      return;
    }
    const payload = new FormData();
    payload.append("title", title);
    payload.append("offerId", Number(editId));
    payload.append("description", description);
    if (image) payload.append("image", image);

    dispatch(editOffer({ token: adminData.token, payload }))
      .unwrap()
      .then(() => setModalWrapper((p) => ({ ...p, isOpen: false })));
  };

  return (
    <>
      <ConfirmModal {...modalObject} />
      <ModalWrapper {...modalWrapper}>
        <CardLayoutBody>
          <div className="space-y-4">
            <input
              type="text"
              name="title"
              value={formValues.title}
              onChange={handleFormChange}
              placeholder="Offer Title"
              className="w-full p-2 border rounded"
            />
            <TextArea
              name="description"
              value={formValues.description}
              onChange={handleFormChange}
            />
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFormChange}
              className="w-full p-2"
            />
          </div>
          <CardLayoutFooter>
            <Button
              text="Update"
              onClick={handleEdit}
              loading={isEditingOffer}
            />
          </CardLayoutFooter>
        </CardLayoutBody>
      </ModalWrapper>

      <CardLayoutContainer removeBg>
        <CardLayoutHeader
          removeBorder
          heading="Offers"
          className="flex items-center justify-between"
        >
          <SecondaryButton
            text="Create New Offer"
            onClick={() => navigate("/dashboard/create-offer")}
            icon={<MdAdd />}
          />
        </CardLayoutHeader>
        <CardLayoutBody removeBorder>
          <Searchbar
            data={filteredOffers}
            onFilteredData={setFilteredOffers}
            searchFields={["id", "title", "description"]}
          />
          <Table
            columnsData={columns}
            tableData={filteredOffers}
            pagination
            progressPending={isLoadingOffers}
            paginationTotalRows={filteredOffers.length}
            paginationComponentOptions={{ noRowsPerPage: "10" }}
          />
        </CardLayoutBody>
        <CardLayoutFooter />
      </CardLayoutContainer>
    </>
  );
};

export default Offers;
