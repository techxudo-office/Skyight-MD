import React, { useState } from "react";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
  CardLayoutFooter,
} from "../../components/CardLayout/CardLayout";
import { Input, Button, Spinner } from "../../components/components";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { login } from "../../utils/api_handler";

const LoginForm = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const loginHandler = async (payload, resetForm) => {
    try {
      setLoading(true);

      const response = await login(payload);
      if (response) {
        if (response.status) {
          toast.success(response.message);
          resetForm();
          setTimeout(() => {
            navigate("/dashboard");
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
    email: Yup.string().required("Please enter your email"),
    password: Yup.string().required("Please enter your password"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      const payload = {
        email: values.email,
        password: values.password,
      };
      loginHandler(payload, resetForm);
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
      <CardLayoutContainer className={"max-w-md p-3 m-auto shadow-2xl"}>
        <CardLayoutHeader
          heading="Login"
          className={"flex items-center justify-center pt-7 pb-0"}
          removeBorder={true}
        />
        <form onSubmit={handleFormSubmit} noValidate>
          <CardLayoutBody removeBorder={true}>
            <div>
              <div className="flex flex-col gap-5">
                <div
                  className={`relative ${
                    formik.touched.email && formik.errors.email ? "mb-5" : ""
                  }`}
                >
                  <Input
                    placeholder={"abc.xcv@gmail.com"}
                    id={"email"}
                    name={"email"}
                    label={"Email Address*"}
                    type={"email"}
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
                    placeholder={"********"}
                    id={"password"}
                    name={"password"}
                    label={"Password*"}
                    type={"password"}
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
                <div className="w-full flex items-center justify-end">
                  <Link className="hover:text-primary transition-all">
                    Forget Password?
                  </Link>
                </div>
              </div>
            </div>
          </CardLayoutBody>
          <CardLayoutFooter className={"flex items-center justify-center"}>
            <div>
              <Button
                text={loading ? <Spinner /> : "Login"}
                disabled={loading}
                onClick={formik.handleSubmit}
                type="submit"
              />
            </div>
          </CardLayoutFooter>
        </form>
      </CardLayoutContainer>
    </>
  );
};

export default LoginForm;
