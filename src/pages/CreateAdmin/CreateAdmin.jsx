import { useEffect, useState } from "react";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
  CardLayoutFooter,
} from "../../components/CardLayout/CardLayout";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import Spinner from "../../components/Spinner/Spinner";
import Select from "../../components/Select/Select";
import Switch from "../../components/Switch/Switch";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { adminValidation } from "../../utils/validations";
import { getRoles } from "../../_core/features/roleSlice";
import { createAdmin } from "../../_core/features/adminSlice";
import { createAdminInpFields } from "../../utils/InputFields";

const initialState = {
  full_name: "",
  email: "",
  password: "",
  role_id: "",
};

const CreateAdmin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const [active, setActive] = useState(true); // Tracks the active status toggle of the new admin
  const [formData, setFormData] = useState(initialState);
  const [selectedRole, setSelectedRole] = useState(null); // Keeps selected role object for display and form syncing
  const { adminData } = useSelector((state) => state.persist);
  const { isCreatingAdmin } = useSelector((state) => state.admin);
  const { roles, isLoadingRoles } = useSelector((state) => state.role);

  useEffect(() => {
    // Fetch roles on mount if token is available — needed to populate role dropdown options
    if (adminData?.token) {
      dispatch(getRoles(adminData?.token));
    }
  }, [dispatch, adminData?.token]);

  const handleChange = (e) => {
    // Generic form input handler to update formData state dynamically based on input name attribute
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleSelect = (role) => {
    // When a role is selected from dropdown, save its id and label to state
    let data = {
      id: role.value,
      role: role.label,
    };
    setSelectedRole(data); // for displaying selected role name in Select component
    setFormData((prev) => ({ ...prev, role_id: data.id })); // sync role_id with form data for submission
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data using external validation utility
    if (!adminValidation(formData, setErrors)) {
      toast.error("Please fix the errors before submitting.");
      return; // Stop submission if validation fails
    }

    // Prepare payload with normalized types (e.g., role_id as number)
    const payload = {
      full_name: formData.full_name,
      email: formData.email,
      password: formData.password,
      role_id: Number(formData.role_id),
      is_active: active, // Include toggle status for admin activation
    };

    // Dispatch createAdmin async thunk with token and payload
    dispatch(createAdmin({ data: payload, token: adminData?.token }))
      .unwrap()
      .then(() => {
        // Reset form and navigate to admin list page on successful creation
        setFormData(initialState);
        setSelectedRole(null);
        navigate("/dashboard/admins");
      });
  };

  return (
    <CardLayoutContainer>
      <CardLayoutHeader
        className="flex items-center justify-between"
        heading="Create Admin"
      >
        {/* Toggle switch to mark the new admin as active/inactive */}
        <Switch label={"Status:"} onChange={setActive} value={active} />
      </CardLayoutHeader>
      <form onSubmit={handleSubmit} noValidate>
        <CardLayoutBody>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 md:gap-5 mb-7">
            {/* Render input fields dynamically based on configuration array */}
            {createAdminInpFields.map(({ name, label, type }) => (
              <div key={name} className="relative">
                <Input
                  id={name}
                  name={name}
                  label={label}
                  type={type}
                  placeholder={`Enter ${label}`}
                  value={formData[name]}
                  onChange={handleChange}
                />
                {/* Show field-specific validation error messages */}
                {errors[name] && (
                  <p className="mt-1 text-sm text-red-500">{errors[name]}</p>
                )}
              </div>
            ))}

            {/* Role dropdown with loading indicator and selection handler */}
            <Select
              id="adminRoles"
              label="Role"
              height="h-12"
              value={selectedRole ? selectedRole.role : ""}
              onChange={handleRoleSelect}
              options={roles?.map((role) => ({
                value: role.id,
                label: role.role,
              }))}
              placeholder="Select a Role"
              isLoading={isLoadingRoles}
            />
          </div>
        </CardLayoutBody>

        <CardLayoutFooter>
          {/* Submit button disables and shows spinner while creating admin */}
          <Button
            text={isCreatingAdmin ? <Spinner /> : "Create Admin"}
            disabled={isCreatingAdmin}
            type="submit"
          />
        </CardLayoutFooter>
      </form>
    </CardLayoutContainer>
  );
};

export default CreateAdmin;
