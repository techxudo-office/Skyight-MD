import React, { useRef, useState, useEffect } from "react";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
} from "../../components/CardLayout/CardLayout";
import {
  Button,
  Input,
  Loader,
  PhoneNumberInput,
  Select,
} from "../../components/components";
import { MdEdit } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
// import { getUserInfo, updateAccount } from "../../_core/features/authSlice";
import { getRoles } from "../../_core/features/roleSlice";

const Settings = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [editingField, setEditingField] = useState(null);
  const { roles, isLoadingRoles } = useSelector((state) => state.role);
  const { userData, isUpdatingAccount, isLoadingUserInfo } = useSelector(
    (state) => state.auth
  );
  const [profileImage, setProfileImage] = useState(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjUuYcnZ-xqlGZiDZvuUy_iLx3Nj6LSaZSzQ&s"
  );
  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    city: "",
    country: "",
    role_id: "",
    role_name: "",
    mobile_number: "",
    password: "",
  });

  useEffect(() => {
    if (userData) {
      console.log(userData, "UserData");
      setProfileData({
        first_name: userData.user.first_name || "",
        last_name: userData.user.last_name || "",
        email: userData.user.email || "",
        mobile_number: userData.user.mobile_number || "",
        city: userData.user.company.city || "",
        country: userData.user.company.country || "",
        role_id: userData.user.role_id || "",
        role_name: userData?.user?.role?.name || "Select a Role",
        // password: userData.user.password || "",
      });
    }
  }, [userData, roles]);

  useEffect(() => {
    dispatch(getUserInfo(userData?.token));
    dispatch(getRoles(userData?.token));
  }, []);

  const handleChange = (e, field) => {
    setProfileData({ ...profileData, [field]: e.target.value });
  };

  const handleRoleSelect = (role) => {
    setProfileData((prev) => ({
      ...prev,
      role_id: role.value,
      role_name: role.label,
    }));
  };

  const handleSave = () => {
    const payload = {
      first_name: profileData.first_name,
      last_name: profileData.last_name,
      mobile_number: profileData.mobile_number,
      role_id: Number(profileData.role_id),
      password: profileData.password,
    };
    dispatch(
      updateAccount({
        data: payload,
        token: userData.token,
        id: userData.user.id,
      })
    );
    setEditingField(null);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const profileFields = [
    {
      label: "First Name",
      field: "first_name",
      type: "text",
      edit: true,
      placeholder: "Enter your first name",
    },
    {
      label: "Last Name",
      field: "last_name",
      type: "text",
      edit: true,
      placeholder: "Enter your last name",
    },
    {
      label: "Email Address",
      field: "email",
      type: "email",
      edit: false,
      placeholder: "example@email.com",
    },
    {
      label: "Password",
      field: "password",
      type: "password",
      edit: true,
      placeholder: "Enter new password",
    },
  ];

  const addressFields = [
    { label: "City", field: "city", type: "text", edit: false },
    { label: "Country", field: "country", type: "text", edit: false },
  ];

  const renderEditableField = (
    label,
    field,
    type = "text",
    edit,
    placeholder
  ) => (
    <div className="flex flex-col w-full">
      <h4 className="mb-1 text-xs font-medium text-slate-500">{label}</h4>
      <div className="flex items-center gap-x-2">
        <Input
          edit={edit}
          type={type}
          profile={true}
          placeholder={placeholder}
          value={profileData[field]}
          disabled={editingField !== field}
          setEditingField={setEditingField}
          isSelected={editingField === field}
          onEditClick={() => setEditingField(field)}
          onChange={(e) => handleChange(e, field)}
        />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <CardLayoutContainer className="w-full mb-5">
        <CardLayoutHeader
          className="flex flex-wrap items-center justify-start gap-5 py-3"
          removeBorder={true}>
          <div className="relative w-16 h-16 overflow-hidden rounded-full cursor-pointer group">
            <img
              src={profileImage}
              alt="profile-img"
              className="object-cover w-full h-full rounded-full"
            />
            <div
              className="absolute inset-0 flex items-center justify-center transition-opacity bg-black bg-opacity-50 opacity-0 group-hover:opacity-100"
              onClick={() => fileInputRef.current.click()}>
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
            <h3 className="text-lg font-semibold text-text">{`${profileData.first_name} ${profileData.last_name}`}</h3>
            <h4 className="mb-0 text-sm text-text">{`${profileData.city}, ${profileData.country}`}</h4>
          </div>
        </CardLayoutHeader>
      </CardLayoutContainer>
      {isLoadingRoles || isLoadingUserInfo ? (
        <Loader />
      ) : (
        <CardLayoutContainer className="w-full mb-5">
          <CardLayoutHeader
            className="flex items-center justify-between gap-5 py-3"
            removeBorder={true}>
            <h2 className="text-2xl font-semibold text-text">
              Personal Information
            </h2>
          </CardLayoutHeader>
          <CardLayoutBody removeBorder={true}>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 md:gap-5 mb-7">
              {profileFields.map(
                ({ label, field, type, edit, placeholder }, index) => (
                  <div key={index}>
                    {renderEditableField(label, field, type, edit, placeholder)}
                  </div>
                )
              )}
              <PhoneNumberInput
                id={1}
                name={"Phone Number"}
                label={"Phone Number"}
                className="self-end"
                value={profileData.mobile_number}
                onChange={(number) =>
                  handleChange(
                    {
                      target: {
                        value:
                          number.country_code +
                          number.area_code +
                          number.number,
                      },
                    },
                    "mobile_number"
                  )
                }
                placeholder={"Phone Number"}
              />
              <Select
                id="roles"
                label="Role"
                value={profileData.role_name}
                onChange={(role) => handleRoleSelect(role)}
                options={roles.map((role) => ({
                  value: role.id,
                  label: role.role,
                }))}
                placeholder="Select a role"
                disabled={false}
                isLoading={isLoadingRoles}
                className="self-end w-full"
              />
            </div>
          </CardLayoutBody>
          <CardLayoutHeader
            className="flex items-center justify-between gap-5 py-3"
            removeBorder={true}>
            <h2 className="text-2xl font-semibold text-text">Address</h2>
          </CardLayoutHeader>
          <CardLayoutBody>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 md:gap-5 mb-7">
              {addressFields.map(({ label, field, type, edit }, index) => (
                <div key={index}>
                  {renderEditableField(label, field, type, edit)}
                </div>
              ))}
            </div>
            <Button
              text="Save Changes"
              onClick={handleSave}
              loading={isUpdatingAccount}
              disabled={isUpdatingAccount}
            />
          </CardLayoutBody>
        </CardLayoutContainer>
      )}
    </div>
  );
};

export default Settings;
