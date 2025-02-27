import React, { useEffect, useState } from "react";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
  CardLayoutFooter,
} from "../../components/CardLayout/CardLayout";
import {
  Input,
  Button,
  Spinner,
} from "../../components/components";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { createUser, getRoles } from "../../utils/api_handler";
import { FaCaretDown } from "react-icons/fa";

let inputFields = [
  {
    name: "first_name",
    label: "First Name*",
    type: "text",
    placeholder: "Enter First Name",
  },
  {
    name: "last_name",
    label: "Last Name*",
    type: "text",
    placeholder: "Enter Last Name",
  },
  { name: "email", label: "Email*", type: "email", placeholder: "Enter Email" },
  {
    name: "mobile_number",
    label: "Mobile Number*",
    type: "text",
    placeholder: "Enter Mobile Number",
  },
  {
    name: "password",
    label: "Password*",
    type: "password",
    placeholder: "Enter Password",
  },
];
const CreateUser = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    mobile_number: "",
    password: "",
    role_id: "",
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const validateForm = () => {
    let newErrors = {};

    if (!formData.first_name.trim())
      newErrors.first_name = "First name is required";
    if (!formData.last_name.trim())
      newErrors.last_name = "Last name is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.mobile_number.trim()) {
      newErrors.mobile_number = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobile_number)) {
      newErrors.mobile_number = "Mobile number must be 10 digits";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.role_id) newErrors.role_id = "Role is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true);
      try {
        const response = await getRoles();
        if (response.status) {
          setRoles(response.data.roles);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
        toast.error("Failed to fetch roles.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setFormData((prev) => ({
      ...prev,
      role_id: role.id,
    }));
    setDropdownOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    try {
      setLoading(true);
      console.log("Submitting Payload:", formData);
      const response = await createUser(JSON.stringify(formData));

      if (response?.status) {
        toast.success(response.message);
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          mobile_number: "",
          password: "",
          role_id: "",
        });
        setSelectedRole(null);
        setErrors({});
        setTimeout(() => navigate("/dashboard/users"), 1000);
      } else {
        Array.isArray(response.message)
          ? response.message.forEach((error) => toast.error(error))
          : toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      <CardLayoutContainer>
        <CardLayoutHeader heading="Create User" />
        <form onSubmit={handleSubmit} noValidate>
          <CardLayoutBody>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 md:gap-5 mb-7">
              {inputFields.map(({ name, label, type }) => (
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
                  {errors[name] && (
                    <p className="mt-1 text-sm text-red-500">{errors[name]}</p>
                  )}
                </div>
              ))}
              <div className="relative">
                {/* <label className="block mb-2 font-medium text-md">Role</label> */}
                <div
                  className="relative flex items-center justify-between w-full p-3 bg-white border border-gray-300 rounded-md cursor-pointer"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <span>
                    {selectedRole ? selectedRole.name : "Select a Role"}
                  </span>
                  <FaCaretDown className="text-gray-500" />
                </div>
                {dropdownOpen && (
                  <ul className="absolute z-10 w-full mt-1 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-md max-h-40">
                    {roles.length > 0 ? (
                      roles.map((role) => (
                        <li
                          key={role.id}
                          className="p-3 cursor-pointer hover:bg-gray-100"
                          onClick={() => handleRoleSelect(role)}
                        >
                          {role.name}
                        </li>
                      ))
                    ) : (
                      <li className="p-3 text-gray-500">No roles found</li>
                    )}
                  </ul>
                )}
                {errors.role_id && (
                  <p className="mt-1 text-sm text-red-500">{errors.role_id}</p>
                )}
              </div>
            </div>
          </CardLayoutBody>

          <CardLayoutFooter>
            <Button
              text={loading ? <Spinner /> : "Create User"}
              disabled={loading}
              type="submit"
            />
          </CardLayoutFooter>
        </form>
      </CardLayoutContainer>
    </>
  );
};

export default CreateUser;
