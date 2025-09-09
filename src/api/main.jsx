import axiosInstance from "../components/axiosInstance";
import { notify } from "../components/notification";

const token = localStorage.getItem("token");

export const getAllUser = async (offset = 0, limit = 10, filter) => {
  try {
    const response = await axiosInstance.post(
      "/users/getUsers",
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
      return response?.data;
    }
  } catch (error) {
    notify("error", error?.response?.data?.message);
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await axiosInstance.delete(`/users/deleteUser/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response?.data?.status === 200) {
      return response?.data;
    }
  } catch (error) {
    notify("error", error?.response?.data?.message);
  }
};
