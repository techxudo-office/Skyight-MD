import { useRef, useState, useEffect } from "react";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
} from "../../components/CardLayout/CardLayout";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import Loader from "../../components/Loader/Loader";
import Switch from "../../components/Switch/Switch";
import { MdEdit } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { updateAccountValidation } from "../../utils/validations";
import { profileSettingsFields } from "../../utils/InputFields";
import Profileimage from "../../components/ProfileImage/Profileimage";
import { uploadImage, updateAccount } from "../../_core/features/persistSlice";

const Settings = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null); // To programmatically trigger hidden file input
  const [editingField, setEditingField] = useState(null); // Tracks which field is in “edit” mode
  const { roles, isLoadingRoles } = useSelector((state) => state.role);
  const { adminData, isUpdatingAccount, isLoadingUserInfo } = useSelector(
    (state) => state.auth
  );

  // Toggle state for admin’s active/inactive status, initialized from Redux
  const [toggle, setToggle] = useState(adminData?.admin?.is_active);

  // Local form state for profile fields
  const [profileData, setProfileData] = useState({
    full_name: "",
    email: "",
    password: "",
    is_active: true,
  });

  useEffect(() => {
    if (adminData) {
      // Populate local form state when admin data is available or changes
      setProfileData({
        full_name: adminData.admin.full_name || "",
        email: adminData.admin.email || "",
        mobile_number: adminData.admin.mobile_number || "",
        is_active: adminData.admin.is_active || "",
      });
    }
  }, [adminData, roles]);

  const handleChange = (e, field) => {
    // Generic handler updates specific field in profileData
    setProfileData({ ...profileData, [field]: e.target.value });
  };

  const handleSave = () => {
    // Validate password (and any related rules) before sending update request
    const passwordError = updateAccountValidation(
      profileData.password,
      profileData.full_name
    );
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    // Construct FormData for multipart/form-data (for potential image upload)
    const formData = new FormData();
    formData.append("full_name", profileData.full_name);
    formData.append("password", profileData.password);
    formData.append("is_active", toggle);
    // Note: image appending happens in handleImageChange

    dispatch(
      updateAccount({
        data: formData,
        token: adminData.token,
        id: adminData.admin.id,
      })
    );

    // Exit editing mode after dispatch
    setEditingField(null);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0]; // Grab selected file
    // Dispatch uploadImage to send file and token to backend
    dispatch(uploadImage({ img: file, token: adminData?.token }));
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
          profile={true} // Indicates this input is in profile settings context
          placeholder={placeholder}
          value={profileData[field]}
          disabled={editingField !== field} // Only enable input if it’s the one being edited
          setEditingField={setEditingField} // Pass setter so Input can signal entering edit mode
          isSelected={editingField === field} // Highlight or style if currently selected
          onEditClick={() => setEditingField(field)} // Clicking edit icon switches to edit mode
          onChange={(e) => handleChange(e, field)} // Update profileData on change
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
            <Profileimage />
            <div
              className="absolute inset-0 flex items-center justify-center transition-opacity bg-black bg-opacity-50 opacity-0 group-hover:opacity-100"
              onClick={() => fileInputRef.current.click()}
              // Clicking overlay triggers file input due to ref
            >
              <MdEdit className="text-xl text-white" />
            </div>

            {/* Hidden file input to handle image selection */}
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
        // Show loader while fetching roles or user info
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
            {/* Switch toggles account active/inactive, updates local state */}
            <Switch onChange={setToggle} value={toggle} label={"Status:"} />
          </CardLayoutHeader>

          <CardLayoutBody removeBorder={true}>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 md:gap-5 mb-7">
              {profileSettingsFields.map(
                ({ label, field, type, edit, placeholder }, index) => (
                  <div key={index}>
                    {/* Render each profile field with ability to enter edit mode */}
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
              loading={isUpdatingAccount} // Show spinner while update is in progress
              disabled={isUpdatingAccount}
            />
          </CardLayoutBody>
        </CardLayoutContainer>
      )}
    </div>
  );
};

export default Settings;
