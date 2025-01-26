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
import { updateBank } from "../../utils/api_handler";

const UpdateBank = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [updateId, setUpdateId] = useState(null);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  const updateBankHandler = async (payload, resetForm) => {
    try {
      setLoading(true);

      const response = await updateBank(payload);
      if (response) {
        if (response.status) {
          toast.success(response.message);
          resetForm();
          setTimeout(() => {
            navigate("/dashboard/banks");
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
    bank: Yup.string().required("Please enter bank"),
    // status: Yup.string().required("Status Required"),
  });

  const formik = useFormik({
    initialValues: {
      bank: "",
    //   status: isActive ? "active" : "inactive",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      const payload = {
        bank_id: updateId,
        bank: values.bank,
        // status: isActive ? "active" : "inactive",
      };
      updateBankHandler(payload, resetForm);
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
      formik.values.bank = preData.bank;
      setIsActive(preData.status === "active" ? true : false);
    }
  }, [location]);

  return (
    <>
      <Toaster />
      <CardLayoutContainer>
        <CardLayoutHeader
          heading="Update Bank"
          className={"flex items-center justify-between"}
        >
          {/* <span
            onClick={() => {
              setIsActive(!isActive);
            }}
          >
            <Switch switchStatus={isActive} />
          </span> */}
        </CardLayoutHeader>
        <form onSubmit={handleFormSubmit} noValidate>
          <CardLayoutBody>
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5 mb-7">
                <div
                  className={`relative ${
                    formik.touched.bank && formik.errors.bank ? "mb-5" : ""
                  }`}
                >
                  <Input
                    placeholder={"Enter Bank"}
                    id={"bank"}
                    name={"bank"}
                    label={"Bank*"}
                    type={"text"}
                    value={formik.values.bank}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.bank && formik.errors.bank && (
                    <div className="text-red-500 text-sm mt-2 absolute left-0">
                      {formik.errors.bank}
                    </div>
                  )}
                </div>
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
                text={loading ? <Spinner /> : "Update Bank"}
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

export default UpdateBank;
