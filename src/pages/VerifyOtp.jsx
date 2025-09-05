import { Form, Input, Button } from "antd";
import AuthLayout from "../components/AuthLayout";

export default function VerifyOtp() {
  const onFinish = (values) => {
    console.log("OTP Verified:", values);
  };

  return (
    <AuthLayout title="Verify OTP">
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="otp" label="Enter OTP" rules={[{ required: true }]}>
          <Input placeholder="Enter the OTP sent to your email" />
        </Form.Item>

        <Button type="primary" htmlType="submit" block>
          Verify
        </Button>
      </Form>
    </AuthLayout>
  );
}
