import React, { useRef, useState } from "react";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
} from "../../components/CardLayout/CardLayout";
import { Input } from "../../components/components";
import { MdEdit } from "react-icons/md";

const Profile = () => {
  const [editingField,  setEditingField] = useState(null);
  const [profileData, setProfileData] = useState({
    firstName: "First Name",
    lastName: "Last Name",
    dateOfBirth: "28-11-2024",
    email: "profile.user@gmail.com",
    phoneNumber: "(+00) 001002003004",
    role: "Admin",
    country: "United Kingdom",
    city: "Los Angeles, California",
    postalCode: "PTC 0204",
  });

  const profileFields = [
    { label: "First Name", field: "firstName", type: "text" },
    { label: "Last Name", field: "lastName", type: "text" },
    { label: "Date of Birth", field: "dateOfBirth", type: "date" },
    { label: "Email Address", field: "email", type: "email" },
    { label: "Phone Number", field: "phoneNumber", type: "tel" },
    { label: "User Role", field: "role", type: "text" },
  ];

  const addressFields = [
    { label: "Country", field: "country", type: "text" },
    { label: "City", field: "city", type: "text" },
    { label: "Postal Code", field: "postalCode", type: "text" },
  ];

  const handleChange = (e, field) => {
    setProfileData({ ...profileData, [field]: e.target.value });
  };

  const handleEdit = (field) => {
    setEditingField(field);
  };

  const handleSave = () => {
    setEditingField(null);
    console.log(profileData, "Form Data");
  };

  const [profileImage, setProfileImage] = useState(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjUuYcnZ-xqlGZiDZvuUy_iLx3Nj6LSaZSzQ&s"
  );

  const fileInputRef = useRef(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const renderEditableField = (
    label,
    field,
    profileData,
    handleEdit,
    handleChange,
    editingField,
    type = "text"
  ) => {
    return (
      <div className="flex flex-col w-full">
        <h4 className="mb-1 text-xs font-medium text-slate-500">{label}</h4>
        <div className="flex items-center gap-x-2">
          <Input
            type={type}
            profile={true}
            value={profileData[field]}
            disabled={editingField !== field}
            setEditingField={setEditingField}
            isSelected={editingField === field}
            onEditClick={() => handleEdit(field)}
            onChange={(e) => handleChange(e, field)}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <CardLayoutContainer className="w-full mb-5">
        <CardLayoutHeader
          className="flex flex-wrap items-center justify-start gap-5 py-3"
          removeBorder={true}
        >
          {" "}
          <div className="relative w-16 h-16 overflow-hidden rounded-full cursor-pointer group">
            <img
              src={profileImage}
              alt="profile-img"
              className="object-cover w-full h-full rounded-full"
            />
            <div
              className="absolute inset-0 flex items-center justify-center transition-opacity bg-black bg-opacity-50 opacity-0 group-hover:opacity-100"
              onClick={() => fileInputRef.current.click()}
            >
              <MdEdit className="text-xl text-white" />
            </div>
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageChange}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text">{`${profileData.firstName} ${profileData.lastName}`}</h3>
            <h4 className="mb-0 text-sm text-text">{`${profileData.role}`}</h4>
            <h4 className="mb-0 text-sm text-text">{`${profileData.city}, ${profileData.country}`}</h4>
          </div>
        </CardLayoutHeader>
      </CardLayoutContainer>
      <CardLayoutContainer className="w-full mb-5">
        <CardLayoutHeader
          className="flex items-center justify-between gap-5 py-3"
          removeBorder={true}
        >
          <h2 className="text-2xl font-semibold text-text">
            Personal Information
          </h2>
        </CardLayoutHeader>
        <CardLayoutBody removeBorder={true}>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 md:gap-5 mb-7">
            {profileFields.map(({ label, field, type }, index) => (
              <div key={index}>
                {renderEditableField(
                  label,
                  field,
                  profileData,
                  handleEdit,
                  handleChange,
                  editingField,
                  type
                )}
              </div>
            ))}
          </div>
        </CardLayoutBody>
        <CardLayoutHeader
          className="flex items-center justify-between gap-5 py-3"
          removeBorder={true}
        >
          <h2 className="text-2xl font-semibold text-text">Address</h2>
        </CardLayoutHeader>
        <CardLayoutBody>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 md:gap-5 mb-7">
            {addressFields.map(({ label, field, type }, index) => (
              <div key={index}>
                {renderEditableField(
                  label,
                  field,
                  profileData,
                  handleEdit,
                  handleChange,
                  editingField,
                  type
                )}
              </div>
            ))}
          </div>
          <button
            disabled={!editingField}
            className={`px-4 py-2 mt-3 font-semibold text-white rounded-md 
    bg-primary ${editingField ? "cursor-pointer" : "cursor-not-allowed"}`}
            onClick={handleSave}
          >
            Save Changes
          </button>
        </CardLayoutBody>
      </CardLayoutContainer>
    </div>
  );
};

export default Profile;
