import React, { useRef, useState, useEffect } from "react";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
} from "../../components/CardLayout/CardLayout";
import { Button, Input, Loader, Switch } from "../../components/components";
import { MdEdit } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { updateAccount } from "../../_core/features/authSlice";
import toast from "react-hot-toast";
import { updateAccountValidation } from "../../utils/validations";

const Settings = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const [base64IMG, setBase64IMG] = useState()
  const [toggle, setToggle] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const { roles, isLoadingRoles } = useSelector((state) => state.role);
  const { userData, isUpdatingAccount, isLoadingUserInfo } = useSelector(
    (state) => state.auth
  );
  const [profileImage, setProfileImage] = useState(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjUuYcnZ-xqlGZiDZvuUy_iLx3Nj6LSaZSzQ&s"
  );
  const [profileData, setProfileData] = useState({
    full_name: "",
    email: "",
    password: "",
    is_active: true,
  });

  useEffect(() => {
    if (userData) {
      console.log(userData, "UserData");
      setProfileData({
        full_name: userData.admin.full_name || "",
        email: userData.admin.email || "",
        mobile_number: userData.admin.mobile_number || "",
        is_active: userData.admin.is_active || "",
        // password: userData.admin.password || "",
      });
    }
  }, [userData, roles]);

  // useEffect(() => {
  //   // dispatch(getUserInfo(userData?.token));
  // }, []);

  const handleChange = (e, field) => {
    setProfileData({ ...profileData, [field]: e.target.value });
  };

  const handleSave = () => {
    const passwordError = updateAccountValidation(
      profileData.password,
      profileData.full_name
    );
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    const payload = {
      full_name: profileData.full_name,
      password: profileData.password,
      is_active: toggle,
    };

    dispatch(
      updateAccount({
        data: payload,
        token: userData.token,
        id: userData.admin.id,
      })
    );

    setEditingField(null);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader()

      reader.readAsDataURL(file)

      reader.onload = () => {
        console.log('called: ', reader)
        setBase64IMG(reader.result)
      }
    }
  };
  console.log("base64IMG", base64IMG)
  const profileFields = [
    {
      label: "Full Name",
      field: "full_name",
      type: "text",
      edit: true,
      placeholder: "Enter your first name",
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
          removeBorder={true}
        >
          <div className="relative w-16 h-16 overflow-hidden rounded-full cursor-pointer group">
            <img
              src={base64IMG || profileImage}
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
          <h3 className="text-lg font-semibold text-text">
            {profileData.full_name}
          </h3>
        </CardLayoutHeader>
      </CardLayoutContainer>
      {isLoadingRoles || isLoadingUserInfo ? (
        <Loader />
      ) : (
        <CardLayoutContainer className="w-full mb-5">
          <CardLayoutHeader
            className="flex items-center justify-between gap-5 py-3"
            removeBorder={true}
          >
            <h2 className="text-2xl font-semibold text-text">
              Personal Information
            </h2>
            <Switch onChange={setToggle} value={toggle} label={"Status:"} />
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
            </div>
          </CardLayoutBody>
          <CardLayoutBody>
            <Button
              text="Update Account"
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
