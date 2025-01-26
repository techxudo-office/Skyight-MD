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
  SecondaryButton,
  Spinner,
} from "../../components/components";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { updateSetting } from "../../utils/api_handler";

const UpdateSetting = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [updateId, setUpdateId] = useState(null);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  const updateSettingHandler = async (payload) => {
    setLoading(true);

    const response = await updateSetting(payload);
    if (response) {
      setLoading(false);
      if (response.status) {
        toast.success(response.message);
        setTimeout(() => {
          navigate("/dashboard/setting");
        }, 1000);
      } else {
        toast.error(response.message);
      }
    }
  };

  const validationSchema = Yup.object({
    AED: Yup.string().required("Please update AED rate"),
    EUR: Yup.string().required("Please update EUR rate"),
    IQD: Yup.string().required("Please update IQD rate"),
    IRR: Yup.string().required("Please update IRR rate"),
    PKR: Yup.string().required("Please update PKR rate"),
    SAR: Yup.string().required("Please update SAR rate"),
    TRY: Yup.string().required("Please update TRY rate"),
    USD: Yup.string().required("Please update USD rate"),
    commission: Yup.string().required("Please update commission"),
  });

  const formik = useFormik({
    initialValues: {
      AED: "",
      EUR: "",
      IQD: "",
      IRR: "",
      PKR: "",
      SAR: "",
      TRY: "",
      USD: "",
      commission: "",
      status: isActive ? "active" : "inactive",
    },
    validationSchema,
    onSubmit: (values) => {
      const payload = {
        AED: Number(values.AED),
        EUR: Number(values.EUR),
        IQD: Number(values.IQD),
        IRR: Number(values.IRR),
        PKR: Number(values.PKR),
        SAR: Number(values.SAR),
        TRY: Number(values.TRY),
        USD: Number(values.USD),
        commission: Number(values.commission),
        // status: values.status,
      };
      updateSettingHandler(payload);
    },
  });

  const enterKeyHandler = (e) => {
    if (e.key === "Enter") {
      formik.submitForm();
    }
  };

  useEffect(() => {
    const preData = location.state;

    if (preData) {
      setUpdateId(preData.id);
      formik.values.commission = preData.commission;
      formik.values.AED = preData.AED;
      formik.values.EUR = preData.EUR;
      formik.values.IQD = preData.IQD;
      formik.values.IRR = preData.IRR;
      formik.values.PKR = preData.PKR;
      formik.values.SAR = preData.SAR;
      formik.values.TRY = preData.TRY;
      formik.values.USD = preData.USD;
    }
  }, [location]);

  return (
    <>
      <Toaster />
      <CardLayoutContainer>
        <CardLayoutHeader
          heading="Update Setting"
          className={"flex items-center justify-between"}
        >
          <span
            onClick={() => {
              setIsActive(!isActive);
            }}
          >
            <Switch switchStatus={isActive} />
          </span>
        </CardLayoutHeader>
        <CardLayoutBody>
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5 mb-7">
              <div
                className={`relative ${
                  formik.touched.commission && formik.errors.commission
                    ? "mb-5"
                    : ""
                }`}
              >
                <Input
                  placeholder={"Enter Commission"}
                  id={"commission"}
                  name={"commission"}
                  label={"Commission*"}
                  type={"number"}
                  value={formik.values.commission}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  onKeyPressHandler={enterKeyHandler}
                />
                {formik.touched.commission && formik.errors.commission && (
                  <div className="text-red-500 text-sm mt-2 absolute left-0">
                    {formik.errors.commission}
                  </div>
                )}
              </div>
              <div
                className={`relative ${
                  formik.touched.AED && formik.errors.AED ? "mb-5" : ""
                }`}
              >
                <Input
                  placeholder={"Enter AED Rate"}
                  id={"AED"}
                  name={"AED"}
                  label={"AED*"}
                  type={"number"}
                  value={formik.values.AED}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  onKeyPressHandler={enterKeyHandler}
                />
                {formik.touched.AED && formik.errors.AED && (
                  <div className="text-red-500 text-sm mt-2 absolute left-0">
                    {formik.errors.AED}
                  </div>
                )}
              </div>
              <div
                className={`relative ${
                  formik.touched.EUR && formik.errors.EUR ? "mb-5" : ""
                }`}
              >
                <Input
                  placeholder={"Enter EUR Rate"}
                  id={"EUR"}
                  name={"EUR"}
                  label={"EUR*"}
                  type={"number"}
                  value={formik.values.EUR}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  onKeyPressHandler={enterKeyHandler}
                />
                {formik.touched.EUR && formik.errors.EUR && (
                  <div className="text-red-500 text-sm mt-2 absolute left-0">
                    {formik.errors.EUR}
                  </div>
                )}
              </div>
              <div
                className={`relative ${
                  formik.touched.IQD && formik.errors.IQD ? "mb-5" : ""
                }`}
              >
                <Input
                  placeholder={"Enter IQD Rate"}
                  id={"IQD"}
                  name={"IQD"}
                  label={"IQD*"}
                  type={"number"}
                  value={formik.values.IQD}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  onKeyPressHandler={enterKeyHandler}
                />
                {formik.touched.IQD && formik.errors.IQD && (
                  <div className="text-red-500 text-sm mt-2 absolute left-0">
                    {formik.errors.IQD}
                  </div>
                )}
              </div>
              <div
                className={`relative ${
                  formik.touched.IRR && formik.errors.IRR ? "mb-5" : ""
                }`}
              >
                <Input
                  placeholder={"Enter IRR Rate"}
                  id={"IRR"}
                  name={"IRR"}
                  label={"IRR*"}
                  type={"number"}
                  value={formik.values.IRR}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  onKeyPressHandler={enterKeyHandler}
                />
                {formik.touched.IRR && formik.errors.IRR && (
                  <div className="text-red-500 text-sm mt-2 absolute left-0">
                    {formik.errors.IRR}
                  </div>
                )}
              </div>
              <div
                className={`relative ${
                  formik.touched.PKR && formik.errors.PKR ? "mb-5" : ""
                }`}
              >
                <Input
                  placeholder={"Enter PKR Rate"}
                  id={"PKR"}
                  name={"PKR"}
                  label={"PKR*"}
                  type={"number"}
                  value={formik.values.PKR}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  onKeyPressHandler={enterKeyHandler}
                />
                {formik.touched.PKR && formik.errors.PKR && (
                  <div className="text-red-500 text-sm mt-2 absolute left-0">
                    {formik.errors.PKR}
                  </div>
                )}
              </div>
              <div
                className={`relative ${
                  formik.touched.SAR && formik.errors.SAR ? "mb-5" : ""
                }`}
              >
                <Input
                  placeholder={"Enter SAR Rate"}
                  id={"SAR"}
                  name={"SAR"}
                  label={"SAR*"}
                  type={"number"}
                  value={formik.values.SAR}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  onKeyPressHandler={enterKeyHandler}
                />
                {formik.touched.SAR && formik.errors.SAR && (
                  <div className="text-red-500 text-sm mt-2 absolute left-0">
                    {formik.errors.SAR}
                  </div>
                )}
              </div>
              <div
                className={`relative ${
                  formik.touched.TRY && formik.errors.TRY ? "mb-5" : ""
                }`}
              >
                <Input
                  placeholder={"Enter TRY Rate"}
                  id={"TRY"}
                  name={"TRY"}
                  label={"TRY*"}
                  type={"number"}
                  value={formik.values.TRY}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  onKeyPressHandler={enterKeyHandler}
                />
                {formik.touched.TRY && formik.errors.TRY && (
                  <div className="text-red-500 text-sm mt-2 absolute left-0">
                    {formik.errors.TRY}
                  </div>
                )}
              </div>
              <div
                className={`relative ${
                  formik.touched.USD && formik.errors.USD ? "mb-5" : ""
                }`}
              >
                <Input
                  placeholder={"Enter USD Rate"}
                  id={"USD"}
                  name={"USD"}
                  label={"USD*"}
                  type={"number"}
                  value={formik.values.USD}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  onKeyPressHandler={enterKeyHandler}
                />
                {formik.touched.USD && formik.errors.USD && (
                  <div className="text-red-500 text-sm mt-2 absolute left-0">
                    {formik.errors.USD}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardLayoutBody>
        <CardLayoutFooter className="flex gap-2">
          <div
            onClick={() => {
              navigate(-1);
            }}
          >
            <SecondaryButton text="Cancel" />
          </div>
          <div>
            <Button
              text={loading ? <Spinner /> : "Update Setting"}
              disabled={loading}
              onClick={formik.handleSubmit}
            />
          </div>
        </CardLayoutFooter>
      </CardLayoutContainer>
    </>
  );
};

export default UpdateSetting;
