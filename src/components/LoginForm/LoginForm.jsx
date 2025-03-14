import React, { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../_core/features/authSlice";

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userData) {
      navigate("/dashboard");
    }
  }, [userData, navigate]);

  const loginHandler = async (payload, resetForm) => {
    dispatch(login(payload)).then(() => {
      resetForm();
    });
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
    if (!isLoading) {
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
                  }`}>
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
                  }`}>
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
                text={isLoading ? <Spinner /> : "Login"}
                disabled={isLoading}
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
