import axios from "axios";
import { BASE_URL } from "../../utils/ApiBaseUrl";
import toast from "react-hot-toast";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

const makeRequest = async (
  method,
  endpoint,
  {
    data = null,
    token = null,
    successMessage = null,
    errorMessage = null,
    headers = {},
  }
) => {
  try {
    const config = {
      method,
      url: endpoint,
      ...(data && { data }),
      headers: {
        ...(token && { Authorization: token }),
        ...headers,
      },
    };

    const response = await apiClient(config);

    if (successMessage) {
      toast.success(successMessage);
    }

    return (
      response.data?.data || response.data?.message || response.data || response
    );
  } catch (error) {
    const apiErrors = error.response?.data?.data?.errors;
    const errorMsg =
      error.response?.data?.message ||
      errorMessage ||
      "Something went wrong. Please try again.";

    console.log(apiErrors, errorMsg, "CATCH");

    if (apiErrors && typeof apiErrors === "object") {
      const firstError = Object.values(apiErrors)[0];
      toast.error(firstError || errorMsg);
      throw firstError;
    } else {
      toast.error(errorMsg);
      throw errorMsg;
    }
  }
};

export default makeRequest;
