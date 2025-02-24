import axios from "axios";
import toast from "react-hot-toast";

export const baseUrl = import.meta.env.VITE_API_URL;

export const getToken = () => {
  return localStorage.getItem("auth_token");
};

//! Login
export const login = async (payload) => {
  try {
    let response = await axios({
      method: "POST",
      url: `${baseUrl}/api/login`,
      data: payload,
    });
    console.log(response);
    if (response.status === 200) {
      localStorage.setItem("auth_token", response.data.data.token);
      //! temproary...
      if (navigator.clipboard.writeText(response.data.data.token)) {
        toast.success("Token Coppied to Clipboard");
      }
      return {
        status: true,
        message: "Login Successfully",
      };
    }
  } catch (error) {
    console.log("Failed while trying to login account: ", error);
    if (error.response) {
      if (error.response.data.data.errors) {
        const errors = Object.keys(error.response.data.data.errors);
        const errorMessages = [];

        for (let i = 0; i < errors.length; i++) {
          errorMessages.push(error.response.data.data.errors[errors[i]]);
        }
        return {
          status: false,
          message: errorMessages,
        };
      } else {
        if (error.response.data.message) {
          toast.error(error.response.data.message);
        }
      }
    } else {
      return {
        status: false,
        message: "Server Connection Error",
      };
    }
  }
};

//! Settings
export const getSetting = async () => {
  try {
    let response = await axios({
      method: "GET",
      url: `${baseUrl}/api/setting`,
      headers: {
        Authorization: getToken(),
      },
    });
    console.log(response);
    if (response.status === 200) {
      const {
        AED,
        EUR,
        IQD,
        IRR,
        PKR,
        SAR,
        TRY,
        USD,
        commission,
        status = "active",
      } = response.data.data;
      return {
        status: true,
        data: { AED, EUR, IQD, IRR, PKR, SAR, TRY, USD, commission, status },
      };
    }
  } catch (error) {
    console.log("Failed while calling setting api: ", error);
  }
};

export const updateSetting = async (payload) => {
  try {
    let response = await axios({
      method: "POST",
      url: `${baseUrl}/api/setting`,
      data: payload,
      headers: {
        Authorization: getToken(),
      },
    });
    console.log(response);
    if (response.status === 200) {
      return {
        status: true,
        message: "Setting Updated Successfully",
      };
    }
  } catch (error) {
    console.log("Failed while updating settings: ", error);
    if (error.response) {
      const commissionErr = error.response.data.data.errors.commission;
      const rateErr = error.response.data.data.errors.rate;
      if (commissionErr) {
        return {
          status: false,
          message: commissionErr,
        };
      }
      if (rateErr) {
        return {
          status: false,
          message: rateErr,
        };
      }
    } else {
      return {
        status: false,
        message: "Server Connection Error",
      };
    }
  }
};

//! Reasons
export const getReasons = async () => {
  try {
    let response = await axios({
      method: "GET",
      url: `${baseUrl}/api/reason`,
      headers: {
        Authorization: getToken(),
      },
    });
    console.log(response);
    if (response.status === 200) {
      if (response.data.data.length > 0) {
        const extractedData = response.data.data.map(
          ({ id, reason, status }) => ({ id, reason, status })
        );
        return { status: true, data: extractedData };
      }
    }
  } catch (error) {
    console.log("Failed while getting reasons: ", error);
  }
};

export const deleteReason = async (id) => {
  try {
    let response = await axios({
      method: "DELETE",
      url: `${baseUrl}/api/reason?reason_id=${id}`,
      headers: {
        Authorization: getToken(),
      },
    });
    console.log(response);
    if (response.status === 200) {
      return { status: true, message: "Record has been deleted" };
    }
  } catch (error) {
    console.log("Failed while deleting reason: ", error);
    return { status: false, message: "Failed while deleting this record" };
  }
};

export const createReason = async (payload) => {
  try {
    let response = await axios({
      method: "POST",
      url: `${baseUrl}/api/reason`,
      data: payload,
      headers: {
        Authorization: getToken(),
      },
    });
    console.log(response);
    if (response.status === 200) {
      return {
        status: true,
        message: "New Reason Created",
      };
    }
  } catch (error) {
    console.log("Failed while creating reason: ", error);
    if (error.response) {
      if (error.response.data.data.errors) {
        const errors = Object.keys(error.response.data.data.errors);
        const errorMessages = [];

        for (let i = 0; i < errors.length; i++) {
          errorMessages.push(error.response.data.data.errors[errors[i]]);
        }
        return {
          status: false,
          message: errorMessages,
        };
      }
    } else {
      return {
        status: false,
        message: "Server Connection Error",
      };
    }
  }
};

export const updateReason = async (payload) => {
  try {
    let response = await axios({
      method: "PUT",
      url: `${baseUrl}/api/reason`,
      data: payload,
      headers: {
        Authorization: getToken(),
      },
    });
    console.log(response);
    if (response.status === 200) {
      return {
        status: true,
        message: "Reason Updated Successfully",
      };
    }
  } catch (error) {
    console.log("Failed while updating reason: ", error);
    if (error.response) {
      if (error.response.data.data.errors) {
        const errors = Object.keys(error.response.data.data.errors);
        const errorMessages = [];

        for (let i = 0; i < errors.length; i++) {
          errorMessages.push(error.response.data.data.errors[errors[i]]);
        }
        return {
          status: false,
          message: errorMessages,
        };
      }
    } else {
      return {
        status: false,
        message: "Server Connection Error",
      };
    }
  }
};

//! Banks
// export const getBanks = async () => {
//   try {
//     let response = await axios({
//       method: "GET",
//       url: `${baseUrl}/api/bank`,
//       headers: {
//         Authorization: getToken(),
//       },
//     });
//     console.log("responsebnak", response);
//     if (response.status === 200) {
//       if (response.data.data[0].length > 0) {
//         const extractedData = response.data.data[0].map(({ id, bank }) => ({
//           id,
//           bank,
//           status: "active",
//         }));
//         return { status: true, data: extractedData };
//       }
//     }
//   } catch (error) {
//     console.log("Failed while getting banks: ", error);
//   }
// };
export const getBanks = async () => {
  let response = await axios({
    method: "GET",
    url: `${baseUrl}/api/bank`,
    headers: {
      Authorization: getToken(),
    },
  });
  return response.data;
};

export const createBank = async (payload) => {
  try {
    let response = await axios({
      method: "POST",
      url: `${baseUrl}/api/bank`,
      data: payload,
      headers: {
        Authorization: getToken(),
      },
    });
    console.log(response);
    if (response.status === 200) {
      return {
        status: true,
        message: "New Bank Created",
      };
    }
  } catch (error) {
    console.log("Failed while creating bank: ", error);
    if (error.response) {
      if (error.response.data.data.errors) {
        const errors = Object.keys(error.response.data.data.errors);
        const errorMessages = [];

        for (let i = 0; i < errors.length; i++) {
          errorMessages.push(error.response.data.data.errors[errors[i]]);
        }
        return {
          status: false,
          message: errorMessages,
        };
      } else {
        return {
          status: false,
          message: "Failed while creating new bank",
        };
      }
    } else {
      return {
        status: false,
        message: "Server Connection Error",
      };
    }
  }
};

export const deleteBank = async (id) => {
  try {
    let response = await axios({
      method: "DELETE",
      url: `${baseUrl}/api/bank?bank_id=${id}`,
      headers: {
        Authorization: getToken(),
      },
    });
    console.log(response);
    if (response.status === 200) {
      return { status: true, message: "Record has been deleted" };
    }
  } catch (error) {
    console.log("Failed while deleting bank: ", error);
    return { status: false, message: "Failed while deleting this record" };
  }
};

export const updateBank = async (payload) => {
  try {
    let response = await axios({
      method: "PUT",
      url: `${baseUrl}/api/bank`,
      data: payload,
      headers: {
        Authorization: getToken(),
      },
    });
    console.log(response);
    if (response.status === 200) {
      return {
        status: true,
        message: "Bank Updated Successfully",
      };
    }
  } catch (error) {
    console.log("Failed while updating bank: ", error);
    if (error.response) {
      if (error.response.data.data.errors) {
        const errors = Object.keys(error.response.data.data.errors);
        const errorMessages = [];

        for (let i = 0; i < errors.length; i++) {
          errorMessages.push(error.response.data.data.errors[errors[i]]);
        }
        return {
          status: false,
          message: errorMessages,
        };
      }
    } else {
      return {
        status: false,
        message: "Server Connection Error",
      };
    }
  }
};

//! Transactions
export const getTransactions = async () => {
  try {
    let response = await axios({
      method: "GET",
      url: `${baseUrl}/api/company/all-transactions`,
      headers: {
        Authorization: getToken(),
      },
    });
    console.log(response);
    if (response.status === 200) {
      if (response.data.data[0].length > 0) {
        const extractedData = response.data.data[0].map(
          ({
            id,
            company_id,
            bank_name,
            bank_number,
            account_holder_name,
            document_number,
            payment_date,
            amount,
            document_url,
            comment,
            status,
            reasonIds,
          }) => ({
            id,
            company_id,
            bank_name,
            bank_number,
            account_holder_name,
            document_number,
            payment_date,
            amount,
            document_url,
            comment,
            status,
            reasonIds,
          })
        );
        return { status: true, data: extractedData };
      }
    }
  } catch (error) {
    console.log("Failed while getting transactions: ", error);
  }
};

export const approvedTransaction = async (payload) => {
  try {
    let response = await axios({
      method: "PUT",
      url: `${baseUrl}/api/company/approved-transaction`,
      data: payload,
      headers: {
        Authorization: getToken(),
      },
    });
    console.log(response);
    if (response.status === 200) {
      return { status: true, message: "Transaction Approved" };
    }
  } catch (error) {
    console.log("Failed while approving transaction: ", error);
  }
};

//! Tickets
export const getTickets = async () => {
  try {
    let response = await axios({
      method: "GET",
      url: `${baseUrl}/api/ticket/all`,
      headers: {
        Authorization: getToken(),
      },
    });
    console.log(response);
    if (response.status === 200) {
      if (response.data.data.length > 0) {
        const extractedData = response.data.data.map(
          ({ id, title, description, status }) => ({
            id,
            title,
            description,
            status,
          })
        );
        return { status: true, data: extractedData };
      }
    }
  } catch (error) {
    console.log("Failed while getting tickets: ", error);
  }
};

export const deleteTicket = async (id) => {
  try {
    let response = await axios({
      method: "DELETE",
      url: `${baseUrl}/api/ticket?ticket_id=${id}`,
      headers: {
        Authorization: getToken(),
      },
    });
    console.log(response);
    if (response.status === 200) {
      return { status: true, message: "Record has been deleted" };
    }
  } catch (error) {
    console.log("Failed while deleting ticket: ", error.message);
    return { status: false, message: "Failed while deleting this record" };
  }
};

//! Admins
export const getAdmins = async () => {
  try {
    let response = await axios({
      method: "GET",
      url: `${baseUrl}/api/admin`,
      headers: {
        Authorization: getToken(),
      },
    });
    console.log(response);
    if (response.status === 200) {
      if (response.data.data.admins.length > 0) {
        const extractedData = response.data.data.admins.map(
          ({ id, full_name, email, role, is_active }) => ({
            id,
            full_name,
            email,
            role,
            is_active,
          })
        );
        return { status: true, data: extractedData };
      }
    }
  } catch (error) {
    console.log("Failed while getting admins: ", error);
  }
};

export const deleteAdmin = async (id) => {
  try {
    let response = await axios({
      method: "DELETE",
      url: `${baseUrl}/api/admin/${id}`,
      headers: {
        Authorization: getToken(),
      },
    });
    console.log(response);
    if (response.status === 200) {
      return { status: true, message: "Admin has been deleted" };
    }
  } catch (error) {
    console.log("Failed while deleting admin: ", error);
    return { status: false, message: "Failed while deleting this admin" };
  }
};

export const createAdmin = async (payload) => {
  try {
    let response = await axios({
      method: "POST",
      url: `${baseUrl}/api/admin`,
      data: payload,
      headers: {
        Authorization: getToken(),
      },
    });
    console.log(response);
    if (response.status === 200) {
      return {
        status: true,
        message: "New Admin Created",
      };
    }
  } catch (error) {
    console.log("Failed while creating admin: ", error);
    if (error.response) {
      if (error.response.data.data.errors) {
        const errors = Object.keys(error.response.data.data.errors);
        const errorMessages = [];

        for (let i = 0; i < errors.length; i++) {
          errorMessages.push(error.response.data.data.errors[errors[i]]);
        }
        return {
          status: false,
          message: errorMessages,
        };
      }
    } else {
      return {
        status: false,
        message: "Server Connection Error",
      };
    }
  }
};

export const updateAdmin = async (payload, id) => {
  try {
    let response = await axios({
      method: "PUT",
      url: `${baseUrl}/api/admin/${id}`,
      data: payload,
      headers: {
        Authorization: getToken(),
      },
    });
    console.log(response);
    if (response.status === 200) {
      return {
        status: true,
        message: "Admin Updated Successfully",
      };
    }
  } catch (error) {
    console.log("Failed while updating admin: ", error);
    if (error.response) {
      if (error.response.data.data.errors) {
        const errors = Object.keys(error.response.data.data.errors);
        const errorMessages = [];

        for (let i = 0; i < errors.length; i++) {
          errorMessages.push(error.response.data.data.errors[errors[i]]);
        }
        return {
          status: false,
          message: errorMessages,
        };
      }
    } else {
      return {
        status: false,
        message: "Server Connection Error",
      };
    }
  }
};

//! Bookings
export const getFlightBookings = async () => {
  try {
    let response = await axios({
      method: "GET",
      url: `${baseUrl}/api/booking`,
      headers: {
        Authorization: getToken(),
      },
    });
    console.log("response", response);
    if (response.status === 200) {
      if (response.data.data.length > 0) {
        const extractedData = response.data.data.map(
          ({
            origin,
            destination,
            booking_reference_id,
            total_fare,
            currency,
            booking_status,
            created_at,
            actions,
            updated_at,
            transaction_identifier,
            ticketing_time_limit,
            id,
            rate,
            persantage,
            canceled_at,
          }) => ({
            origin,
            destination,
            booking_reference_id,
            total_fare,
            currency,
            booking_status,
            created_at,
            actions,
            updated_at,
            transaction_identifier,
            ticketing_time_limit,
            id,
            rate,
            persantage,
            canceled_at,
          })
        );
        return { status: true, data: extractedData };
      }
    }
  } catch (error) {
    console.log("Failed while getting bookings: ", error);
  }
};

export const getBookingDetails = async (id) => {
  try {
    let response = await axios({
      method: "POST",
      url: `${baseUrl}/api/booking-issue`,
      data: {
        pnr: id,
      },
      headers: {
        Authorization: getToken(),
      },
    });
    console.log(response);
    if (response.status === 200) {
      return { status: true, data: response.data.data };
    }
  } catch (error) {
    console.log("Failed while getting bookings: ", error);
  }
};

//! Roles...
export const createRole = async (payload) => {
  try {
    const response = await axios.post(`${baseUrl}/api/role`, payload, {
      headers: {
        Authorization: getToken(),
        "Content-Type": "application/json",
      },
    });
    console.log(response, "Create Role");
    return response.data;
  } catch (error) {
    console.error(
      "Error creating user:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getRoles = async (page = 0, limit = 10) => {
  try {
    let response = await axios({
      method: "GET",
      url: `${baseUrl}/api/role?is_deleted=false&page=${page}&limit=${limit}`,
      headers: {
        Authorization: getToken(),
      },
    });

    if (response.status === 200) {
      return {
        status: true,
        data: response.data.data,
        totalPages: response.data.totalPages || 1,
      };
    }
  } catch (error) {
    console.error("Failed to get roles: ", error);
    return { status: false };
  }
};

//! Notifications...
export const getNotifications = async () => {
  try {
    let response = await axios({
      method: "GET",
      url: `${baseUrl}/api/notification/1`,
      headers: {
        Authorization: getToken(),
      },
    });
    console.log(response);
    if (response.status === 200) {
      return {
        status: true,
        data: response.data.data,
      };
    }
  } catch (error) {
    console.log("Failed while getting notifications: ", error);
  }
};
