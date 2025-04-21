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
import { profileSettingsFields } from "../../utils/InputFields";

const Settings = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [editingField, setEditingField] = useState(null);
  const { roles, isLoadingRoles } = useSelector((state) => state.role);
  const { adminData, isUpdatingAccount, isLoadingUserInfo } = useSelector(
    (state) => state.auth
  );
  const [toggle, setToggle] = useState(adminData?.admin?.is_active);
  const [profileImage, setProfileImage] = useState(
    "https://crs-backend-dev.s3.ap-south-1.amazonaws.com/company/1745022158015_46?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAWOAVSLEDKUUOYT4U%2F20250419%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250419T002240Z&X-Amz-Expires=300&X-Amz-Signature=e0c2cf66a37bb8904694f1b6477230d6bc2775955c487bb0ccd4bf556384c9cb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject"
  );
  const [profileData, setProfileData] = useState({
    full_name: "",
    email: "",
    password: "",
    is_active: true,
  });

  useEffect(() => {
    if (adminData) {
      setProfileData({
        full_name: adminData.admin.full_name || "",
        email: adminData.admin.email || "",
        mobile_number: adminData.admin.mobile_number || "",
        is_active: adminData.admin.is_active || "",
      });
    }
  }, [adminData, roles]);

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

    const formData = new FormData();
    formData.append("full_name", profileData.full_name);
    formData.append("password", profileData.password);
    formData.append("is_active", toggle);
    if (profileImage) {
      formData.append("image", profileImage);
    }

    dispatch(
      updateAccount({
        data: formData,
        token: adminData.token,
        id: adminData.admin.id,
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
              {profileSettingsFields.map(
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
