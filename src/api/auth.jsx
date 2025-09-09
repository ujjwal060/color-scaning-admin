import axiosInstance from "../components/axiosInstance";
import { notify } from "../components/notification";

export const loginApi = async (email, password) => {
  try {
    const response = await axiosInstance.post("/login", {
      email: email,
      password: password,
    });

    if (response?.data?.status === 200) {
      localStorage.setItem("token", response?.data?.token);
      localStorage.setItem("userId", response?.data?.admin?.id);
      return response?.data;
    }
  } catch (error) {
    console.log(error?.response?.data?.message);
    notify("error", error?.response?.data?.message);
  }
};

export const forgotApi = async (email) => {
  try {
    const response = await axiosInstance.post("/forgot-password", {
      email: email,
    });
    if (response?.data?.status === 200) {
      return response?.data;
    }
  } catch (error) {
    console.log("error api" , error?.response?.data?.message);
    notify("error", error?.response?.data?.message);
  }
};

export const verifyOtpApi = async (email, otp) => {
  try {
    const response = await axiosInstance.post("/verify-otp", {
      email: email,
      otp: otp,
    });
    if (response?.data?.status === 200) {
      return response?.data;
    }
  } catch (error) {
    console.log("error otp" ,error?.response?.data?.message);
    notify("error", error?.response?.data?.message);
  }
};

export const resetPasswordApi = async (token, password) => {
  try {
    const response = await axiosInstance.post("/set-password", {
      newPassword: password,
    } , {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response?.data?.status === 200) {
      return response?.data;
    }
  } catch (error) {
    console.log(error?.response?.data?.message);
    notify("error", error?.response?.data?.message);
  }
};
