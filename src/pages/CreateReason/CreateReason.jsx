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
import { Navigate, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { createReason } from "../../utils/api_handler";

const CreateReason = () => {
  const navigate = useNavigate();

  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  const createReasonHandler = async (payload, resetForm) => {
    try {
      setLoading(true);

      const response = await createReason(payload);
      if (response) {
        if (response.status) {
          toast.success(response.message);
          resetForm();
          setTimeout(() => {
            navigate("/dashboard/reasons");
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
    reason: Yup.string().required("Please enter reason"),
    status: Yup.string().required("Status Required"),
  });

  const formik = useFormik({
    initialValues: {
      reason: "",
      status: isActive ? "active" : "inactive",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      const payload = {
        reason: values.reason,
        status: isActive ? "active" : "inactive",
      };
      createReasonHandler(payload, resetForm);
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
          heading="Create Reason"
          className={"flex items-center justify-between"}>
          <span
            onClick={() => {
              setIsActive(!isActive);
            }}>
            <Switch switchStatus={isActive} />
          </span>
        </CardLayoutHeader>
        <form onSubmit={handleFormSubmit} noValidate>
          <CardLayoutBody>
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5 mb-7">
                <div
                  className={`relative ${
                    formik.touched.reason && formik.errors.reason ? "mb-5" : ""
                  }`}>
                  <Input
                    placeholder={"Enter Reason"}
                    id={"reason"}
                    name={"reason"}
                    label={"Reason*"}
                    type={"text"}
                    value={formik.values.reason}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.reason && formik.errors.reason && (
                    <div className="text-red-500 text-sm mt-2 absolute left-0">
                      {formik.errors.reason}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardLayoutBody>
          <CardLayoutFooter className={"flex gap-1"}>
            <div
              onClick={() => {
                navigate(-1);
              }}>
              <SecondaryButton text="Cancel" />
            </div>
            <div>
              <Button
                text={loading ? <Spinner /> : "Create Reason"}
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

export default CreateReason;
