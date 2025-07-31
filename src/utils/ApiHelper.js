import axios from "axios";
import { BASE_URL } from "./ApiBaseUrl";
import toast from "react-hot-toast";

// Create a reusable axios instance with base URL and default headers
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

/**
 * A generic function to make API requests with toast notifications and error handling
 * @param {string} method - HTTP method (e.g., 'get', 'post')
 * @param {string} endpoint - API endpoint
 * @param {object} options - Additional options like data, token, custom headers, messages, etc.
 */
const makeRequest = async (
  method,
  endpoint,
  {
    data = null,
    token = null,
    successMessage = null,
    errorMessage = null,
    headers = {},
    logoutCallback = null,
  }
) => {
  try {
    const config = {
      method,
      url: endpoint,
      ...(data && { data }), // Only include data if it's provided
      headers: {
        ...(token && { Authorization: token }), // Add Authorization header only if token is passed
        ...headers, // Merge any additional custom headers
      },
    };

    const response = await apiClient(config); // Make the actual API call

    if (successMessage) {
      toast.success(successMessage); // Show success toast if message is provided
    }

    return (
      response.data?.data || // actual payload under `data`
      response.data?.message || // fallback to message field
      response.data || // or return full data object
      response // or full axios response if none of the above
    ); // Return the response to the caller
  } catch (error) {
    const status = error.response?.status;
    const apiErrors = error.response?.data?.data?.errors;

    // Use specific or fallback error message
    const errorMsg =
      error.response?.data?.message ||
      errorMessage ||
      "Something went wrong. Please try again.";

    // Handle 401 Unauthorized error by triggering a logout if callback is given
    if (status === 401 && typeof logoutCallback === "function") {
      logoutCallback();
    }

    // If API returned validation errors, show the first one in toast and throw it
    if (apiErrors && typeof apiErrors === "object") {
      const firstError = Object.values(apiErrors)[0];
      toast.error(firstError || errorMsg);
      throw firstError;
    } else {
      toast.error(errorMsg); // General error toast
      throw errorMsg; // Re-throw error so caller can catch it if needed
    }
  }
};

export default makeRequest;
