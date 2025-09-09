import { createBrowserRouter, useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";
import Payment from "../pages/Payment";
import Subscription from "../pages/Subscription";
import Login from "../pages/Login";
import ForgotPassword from "../pages/Forget";
import VerifyOtp from "../pages/VerifyOtp";
import ResetPassword from "../pages/ResetPassword";
import ChangePassword from "../pages/ChangePassword";
import { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // or your specific token key

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [token, navigate]);

  // Optional: Show loading state while checking authentication
  if (!token) {
    return <div>Loading...</div>; // or a proper loading component
  }

  return children;
};

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/verify-otp",
    element: <VerifyOtp />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/change-password",
    element: <ChangePassword />,
  },
  {
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),

    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/users",
        element: <Users />,
      },
      {
        path: "/payment",
        element: <Payment />,
      },
      {
        path: "/subscription",
        element: <Subscription />,
      },

      // Add more routes as needed
    ],
  },
]);

export default router;
