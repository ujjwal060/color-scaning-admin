import { Form, Input, Button, Flex } from "antd";
import AuthLayout from "../components/AuthLayout";
import { verifyOtpApi } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { notify } from "../components/notification";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const email = new URLSearchParams(window.location.search).get("email");
  const onFinish = async (values) => {
    try {
      const response = await verifyOtpApi(email, values.otp);
      if (response?.status === 200) {
        notify("success", "OTP verified successfully!");
        navigate("/reset-password?token=" + response?.resetToken);
      }
    } catch (error) {
      notify("error", error);
    }
  };

  return (
    <AuthLayout title="Verify OTP">
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="otp" label="Enter OTP" rules={[{ required: true }]}>
          <Flex gap="middle" align="center" vertical>
            <Input.OTP formatter={(str) => str.toUpperCase()} maxLength={6} />
          </Flex>
        </Form.Item>

        <Button type="primary" htmlType="submit" block>
          Verify
        </Button>
      </Form>
    </AuthLayout>
  );
}
