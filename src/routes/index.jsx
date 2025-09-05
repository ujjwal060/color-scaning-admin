import { createBrowserRouter } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import Dashboard from '../pages/Dashboard';
import Users from '../pages/Users';
import Payment from '../pages/Payment';
import Subscription from '../pages/Subscription';
import Login from "../pages/Login";
import ForgotPassword from "../pages/Forget";
import VerifyOtp from "../pages/VerifyOtp";
import ResetPassword from "../pages/ResetPassword";
import ChangePassword from "../pages/ChangePassword";

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
    element: <DashboardLayout />,
    children: [
      {
        path: '/',
        element: <Dashboard />,
      },
      {
        path: '/users',
        element: <Users />,
      },
      {
        path: '/payment',
        element: <Payment />,
      },
      {
        path: '/subscription',
        element: <Subscription />,
      },

      // Add more routes as needed
    ],
  },
]);

export default router;
