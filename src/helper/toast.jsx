import toast from "react-hot-toast";

export const successToastify = (message) =>
  toast.success(message, {
    duration: 5000,
  });

export const errorToastify = (message) => toast.error(message);