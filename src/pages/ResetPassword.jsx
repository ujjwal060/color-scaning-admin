import { Form, Input, Button } from "antd";
import AuthLayout from "../components/AuthLayout";

export default function ResetPassword() {
  const onFinish = (values) => {
    console.log("Reset Password:", values);
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
