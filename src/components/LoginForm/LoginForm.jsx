import { useEffect } from "react";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
  CardLayoutFooter,
} from "../../components/CardLayout/CardLayout";
import { Input, Button, Spinner } from "../../components/components";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../_core/features/persistSlice";

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { adminData, isLoading } = useSelector((state) => state.persist);

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (adminData) {
      navigate("/dashboard");
    }
  }, [adminData, navigate]);

  const loginHandler = async (payload, resetForm) => {
    // Dispatch Redux login action and handle form reset or password error
    dispatch(login(payload))
      .unwrap()
      .then(() => {
        resetForm(); // Reset form on successful login
      })
      .catch((err) => {
        // Clear password field if login failed due to wrong password
        if (err.message === "Password is incorrect.") {
          formik.setFieldValue("password", "");
        }
      });
  };

  // Form validation schema using Yup
  const validationSchema = Yup.object({
    email: Yup.string().required("Please enter your email"),
    password: Yup.string().required("Please enter your password"),
  });

  // Initialize formik for managing form state, validation, and submission
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
      loginHandler(payload, resetForm); // Submit login request
    },
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Prevent multiple submits while loading
    if (!isLoading) {
      formik.handleSubmit();
    }
  };

  return (
    <>
      {/* Render form only if user is not logged in */}
      {!adminData && (
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
                  {/* Email input with validation error */}
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
                      <div className="absolute left-0 mt-2 text-sm text-red-500">
                        {formik.errors.email}
                      </div>
                    )}
                  </div>

                  {/* Password input with validation error */}
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
                      <div className="absolute left-0 mt-2 text-sm text-red-500">
                        {formik.errors.password}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardLayoutBody>

            <CardLayoutFooter className={"flex items-center justify-center"}>
              <div>
                {/* Show spinner while loading, otherwise show "Login" button */}
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
      )}
    </>
  );
};

export default LoginForm;
