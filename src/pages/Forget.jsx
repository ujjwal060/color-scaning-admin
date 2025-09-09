import { Form, Input, Button } from "antd";
import AuthLayout from "../components/AuthLayout";
import { forgotApi } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { notify } from "../components/notification";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      const response = await forgotApi(values.email);
      if (response?.status === 200) {
        notify("success", "OTP sent successfully!");
        navigate("/verify-otp?email=" + values.email);
      }
    } catch (error) {
      console.log(error);
      notify("error", error);
    }
  };

  return (
    <AuthLayout title="Forgot Password">
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
          <Input placeholder="Enter your registered email" />
        </Form.Item>

        <Button type="primary" htmlType="submit" block>
          Send OTP
        </Button>
      </Form>
    </AuthLayout>
  );
}
