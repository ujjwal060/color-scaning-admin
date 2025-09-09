import { Form, Input, Button } from "antd";
import AuthLayout from "../components/AuthLayout";
import { resetPasswordApi } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { notify } from "../components/notification";

export default function ResetPassword() {
  const navigate = useNavigate()
  const token = new URLSearchParams(window.location.search).get("token");
  const onFinish = async(values) => {
    try {
      const response = await resetPasswordApi(token, values.password);
      if (response?.status === 200) {
        notify("success", "Password reset successfully!");
        navigate("/login");
      }
    } catch (error) {
      notify("error", error);
    }
  };

  return (
    <AuthLayout title="Reset Password">
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="password" label="New Password" rules={[{ required: true }]}>
          <Input.Password placeholder="Enter new password" />
        </Form.Item>

        <Form.Item name="confirmPassword" label="Confirm Password" rules={[{ required: true }]}>
          <Input.Password placeholder="Confirm new password" />
        </Form.Item>

        <Button type="primary" htmlType="submit" block>
          Reset Password
        </Button>
      </Form>
    </AuthLayout>
  );
}
