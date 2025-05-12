// utils/apiClient.js
import axios from 'axios';
import { BASE_URL } from "../../utils/ApiBaseUrl";
import toast from 'react-hot-toast';

// Create Axios instance with default config
const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
});

// Helper function to handle API requests
const makeRequest = async (method, endpoint, { data = null, token = null, successMessage = null, errorMessage = null, headers = {} }) => {
    try {
        const config = {
            method,
            url: endpoint,
            ...(data && { data }),
            headers: {
                ...(token && { Authorization: token }),
                ...headers
            }
        };

        const response = await apiClient(config);

        if (successMessage) {
            toast.success(successMessage);
        }

        return response;
    } catch (error) {
        const errorMsg = error.response?.data?.message ||
            error.response?.data?.errors ||
            errorMessage ||
            'Something went wrong. Please try again.';

        if (typeof errorMsg === 'object') {
            toast.error(Object.values(errorMsg).join(', '));
        } else {
            toast.error(errorMsg);
        }

        throw errorMsg;
    }
};

export default makeRequest;