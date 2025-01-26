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
  Switch,
  Spinner,
  SecondaryButton,
} from "../../components/components";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { updateAdmin } from "../../utils/api_handler";

const UpdateReason = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [updateId, setUpdateId] = useState(null);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  const updateAdminHandler = async (payload, resetForm) => {
    try {
      setLoading(true);

      const response = await updateAdmin(payload, updateId);
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
  });

  const formik = useFormik({
    initialValues: {
      full_name: "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      const payload = {
        full_name: values.full_name,
        is_active: isActive,
      };
      updateAdminHandler(payload, resetForm);
    },
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!loading) {
      formik.handleSubmit();
    }
  };

  useEffect(() => {
    const preData = location.state;

    if (preData) {
      setUpdateId(preData.id);
      formik.values.full_name = preData.full_name;
      setIsActive(preData.is_active);
    }
  }, [location]);

  return (
    <>
      <Toaster />
      <CardLayoutContainer>
        <CardLayoutHeader
          heading="Update Admin"
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
                text={loading ? <Spinner /> : "Update Admin"}
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

export default UpdateReason;
