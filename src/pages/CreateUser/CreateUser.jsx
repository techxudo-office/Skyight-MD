import { useEffect, useState } from "react";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
  CardLayoutFooter,
} from "../../components/CardLayout/CardLayout";
import { Input, Button, Spinner, Select } from "../../components/components";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaCaretDown } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { userValidation } from "../../utils/validations";
import { createUser } from "../../_core/features/userSlice";
import { getUserRoles } from "../../_core/features/roleSlice";
import { getCompanies } from "../../_core/features/companySlice";
import { createUserInpFields } from "../../utils/InputFields";

const CreateUser = () => {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});

  // formData holds the input values and selected role/company IDs
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    mobile_number: "",
    password: "",
    role_id: "",
    company_id: "",
  });

  // Separate state for displaying selected role and company labels in the Select components
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const { adminData } = useSelector((state) => state.persist);
  const { userRoles, isLoadingUserRoles } = useSelector((state) => state.role);
  const { isCreatingUser } = useSelector((state) => state.user);
  const { companies, isLoadingCompanies } = useSelector(
    (state) => state.company
  );

  useEffect(() => {
    if (adminData?.token) {
      // Fetch user roles and companies once on component mount (if token available)
      dispatch(getUserRoles(adminData?.token));
      dispatch(getCompanies(adminData?.token));
    }
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Update formData state dynamically for all text inputs by name
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleSelect = (role) => {
    // On role selection, update selectedRole for display and role_id for submission
    let data = {
      id: role.value,
      role: role.label,
    };
    setSelectedRole(data);
    setFormData((prev) => ({ ...prev, role_id: data.id }));
  };

  const handleCompanySelect = (role) => {
    // On company selection, update selectedCompany for display and company_id for submission
    let data = {
      id: role.value,
      name: role.label,
    };
    setSelectedCompany(data);
    setFormData((prev) => ({ ...prev, company_id: data.id }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate inputs using external validation util; show toast if errors found
    if (!userValidation(formData, setErrors)) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    // Prepare payload with proper types before dispatching creation
    const payload = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      mobile_number: formData.mobile_number,
      password: formData.password,
      role_id: Number(formData.role_id),
      company_id: Number(formData.company_id),
    };

    // Dispatch createUser async thunk; on success, close modal/form (onClose assumed external)
    dispatch(createUser({ data: payload, token: adminData?.token })).then(
      () => {
        onClose();
      }
    );
  };

  return (
    <>
      <CardLayoutContainer>
        <CardLayoutHeader heading="Create User" />
        <form onSubmit={handleSubmit} noValidate>
          <CardLayoutBody>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 md:gap-5 mb-7">
              {/* Dynamically render all input fields from createUserInpFields config */}
              {createUserInpFields.map(({ name, label, type }) => (
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
                  {/* Display validation error messages if any */}
                  {errors[name] && (
                    <p className="mt-1 text-sm text-red-500">{errors[name]}</p>
                  )}
                </div>
              ))}
              {/* Role select dropdown: loads options from userRoles, shows loading spinner if fetching */}
              <Select
                id="userRoles"
                label="Role"
                height="h-12"
                value={selectedRole ? selectedRole.role : ""}
                onChange={handleRoleSelect}
                options={userRoles?.map((role) => ({
                  value: role.id,
                  label: role.role,
                }))}
                placeholder="Select a Role"
                isLoading={isLoadingUserRoles}
              />
              {/* Company select dropdown: loads options from companies, shows loading spinner if fetching */}
              <Select
                id="companies"
                label="Company"
                height="h-12"
                value={selectedCompany ? selectedCompany.name : ""}
                onChange={handleCompanySelect}
                options={companies?.map((comp) => ({
                  value: comp.id,
                  label: comp.name,
                }))}
                placeholder="Select a Company"
                isLoading={isLoadingCompanies}
              />
            </div>
          </CardLayoutBody>

          <CardLayoutFooter>
            {/* Submit button shows spinner when user creation is in progress */}
            <Button
              text={isCreatingUser ? <Spinner /> : "Create User"}
              disabled={isCreatingUser}
              type="submit"
            />
          </CardLayoutFooter>
        </form>
      </CardLayoutContainer>
    </>
  );
};

export default CreateUser;
