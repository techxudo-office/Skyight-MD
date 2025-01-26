import React, { useState } from "react";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
  CardLayoutFooter,
} from "../../components/CardLayout/CardLayout";
import {
  Input,
  Button,
  Switch,
  Spinner,
  SecondaryButton,
} from "../../components/components";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { createAdmin } from "../../utils/api_handler";

const CreateAdmin = () => {
  const navigate = useNavigate();

  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  const createAdminHandler = async (payload, resetForm) => {
    try {
      setLoading(true);

      const response = await createAdmin(payload);
      if (response) {
        if (response.status) {
          toast.success(response.message);
          resetForm();
          setTimeout(() => {
            navigate("/dashboard/admins");
          }, 1000);
        } else {
          toast.error(response.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const validationSchema = Yup.object({
    full_name: Yup.string().required("Please enter full name"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Please enter email address"),
    password: Yup.string().required("Please enter password"),
  });

  const formik = useFormik({
    initialValues: {
      full_name: "",
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      const payload = {
        full_name: values.full_name,
        email: values.email,
        password: values.password,
        is_active: isActive,
      };
      createAdminHandler(payload, resetForm);
    },
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!loading) {
      formik.handleSubmit(); 
    }
  };

  return (
    <>
      <Toaster />
      <CardLayoutContainer>
        <CardLayoutHeader
          heading="Create Admin"
          className="flex items-center justify-between"
        >
          <span
            onClick={() => {
              setIsActive(!isActive);
            }}
          >
            <Switch switchStatus={isActive} />
          </span>
        </CardLayoutHeader>
        <form
          onSubmit={handleFormSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault(); 
              formik.handleSubmit();
            }
          }}
          noValidate
        >
          <CardLayoutBody>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5 mb-7">
              <div
                className={`relative ${
                  formik.touched.full_name && formik.errors.full_name
                    ? "mb-5"
                    : ""
                }`}
              >
                <Input
                  placeholder="Enter Full Name"
                  id="full_name"
                  name="full_name"
                  label="Full Name*"
                  type="text"
                  value={formik.values.full_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.full_name && formik.errors.full_name && (
                  <div className="text-red-500 text-sm mt-2 absolute left-0">
                    {formik.errors.full_name}
                  </div>
                )}
              </div>
              <div
                className={`relative ${
                  formik.touched.email && formik.errors.email ? "mb-5" : ""
                }`}
              >
                <Input
                  placeholder="Enter Email Address"
                  id="email"
                  name="email"
                  label="Email Address*"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="text-red-500 text-sm mt-2 absolute left-0">
                    {formik.errors.email}
                  </div>
                )}
              </div>
              <div
                className={`relative ${
                  formik.touched.password && formik.errors.password
                    ? "mb-5"
                    : ""
                }`}
              >
                <Input
                  placeholder="Enter Password"
                  id="password"
                  name="password"
                  label="Password*"
                  type="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.password && formik.errors.password && (
                  <div className="text-red-500 text-sm mt-2 absolute left-0">
                    {formik.errors.password}
                  </div>
                )}
              </div>
            </div>
          </CardLayoutBody>
          <CardLayoutFooter className="flex gap-1">
            <div
              onClick={() => {
                navigate(-1);
              }}
            >
              <SecondaryButton text="Cancel" />
            </div>
            <div>
              <Button
                text={loading ? <Spinner /> : "Create Admin"}
                disabled={loading}
                onClick={formik.handleSubmit}
              />
            </div>
          </CardLayoutFooter>
        </form>
      </CardLayoutContainer>
    </>
  );
};

export default CreateAdmin;
