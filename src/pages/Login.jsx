import { Form, Input, Button } from "antd";
import AuthLayout from "../components/AuthLayout";

export default function Login() {
  const onFinish = (values) => {
    console.log("Login Success:", values);
  };

  return (
    <AuthLayout title="Login">
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
          <Input placeholder="Enter your email" />
        </Form.Item>

        <Form.Item name="password" label="Password" rules={[{ required: true }]}>
          <Input.Password placeholder="Enter your password" />
        </Form.Item>

        <Button type="primary" htmlType="submit" block>
          Login
        </Button>

        <div className="flex justify-start mt-4 text-sm">
          <a href="/forgot-password">Forgot Password?</a>
        </div>
      </Form>
    </AuthLayout>
  );
}
