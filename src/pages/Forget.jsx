import { Form, Input, Button } from "antd";
import AuthLayout from "../components/AuthLayout";

export default function ForgotPassword() {
  const onFinish = (values) => {
    console.log("Forgot Password:", values);
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
