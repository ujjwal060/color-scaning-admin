import axiosInstance from "../components/axiosInstance";
import { notify } from "../components/notification";

const token = localStorage.getItem("token");

export const getAllUser = async (offset = 0, limit = 10, filter) => {
  try {
    const response = await axiosInstance.post(
      "admin/users/getUsers",
      {
        offset: offset,
        limit: limit,
        filter: filter,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response?.data?.status === 200) {
      console.log("response api", response);
      return response?.data;
    }
  } catch (error) {
    notify("error", error?.response?.data?.message);
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await axiosInstance.delete(
      `admin/users/deleteUser/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response?.data?.status === 200) {
      return response?.data;
    }
  } catch (error) {
    notify("error", error?.response?.data?.message);
  }
};

export const createSubscription = async (
  planName,
  validityDuration,
  planPrice
) => {
  try {
    const response = await axiosInstance.post(
      "plan",
      { planName, validityDuration, planPrice },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("response api", response);
    if (response?.data?.success === true) {
      return response?.data;
    }
  } catch (error) {
    notify("error", error?.response?.data?.message);
  }
};

export const getSubscription = async (page, pageSize, sortBy, sortOrder) => {
  try {
    let url = `plan/all?page=${page}&limit=${pageSize}`;

    // Add sorting parameters if provided
    if (sortBy && sortOrder) {
      // Convert Ant Design sortOrder values to API expected values
      const apiSortOrder = sortOrder === "ascend" ? "asc" : "desc";
      url += `&sortBy=${sortBy}&sortOrder=${apiSortOrder}`;
    }

    const response = await axiosInstance.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("response api get", response);
    if (response?.data?.success === true) {
      return response?.data;
    }
  } catch (error) {
    notify("error", error?.response?.data?.message);
  }
};

export const deletePlan = async (id) => {
  try {
    const response = await axiosInstance.delete(`plan/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("response api get", response);
    if (response?.data?.success === true) {
      return response?.data;
    }
  } catch (error) {
    notify("error", error?.response?.data?.message);
  }
};

export const updatePlan = async (
  id,
  planName,
  validityDuration,
  planPrice,
  activeStatus
) => {
  try {
    const response = await axiosInstance.put(
      `plan/${id}`,
      { planName, validityDuration, planPrice, activeStatus },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("response api get plan", response);
    if (response?.data?.success === true) {
      return response?.data;
    }
  } catch (error) {
    notify("error", error?.response?.data?.message);
  }
};

export const getHistorySubs = async () => {
  try {
    const response = await axiosInstance.get("subscription/user-plan-history", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data?.users;
  } catch (error) {
    notify("error", error?.response?.data?.message);
  }
};

export const getActiveSubs = async () => {
  try {
    const response = await axiosInstance.get("subscription/user-active-plan", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    notify("error", error?.response?.data?.message);
  }
};
