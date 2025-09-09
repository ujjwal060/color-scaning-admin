import { Form, Input, Button } from "antd";
import AuthLayout from "../components/AuthLayout";
import { loginApi } from "../api/auth";
import { notify } from "../components/notification";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  // const [notify, setNotify] = useState(null);
  const navigate = useNavigate();
  const onLogin = async (values) => {
    if (!loginApi(values.email, values.password)) return;

    try {
      const response = await loginApi(values.email, values.password);
      if (response?.status !== 200) return;
      if (response?.status === 200) {
        notify("success", "Login successful!");
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthLayout title="Login">
      <Form layout="vertical" onFinish={onLogin}>
        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
          <Input placeholder="Enter your email" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true }]}
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>

        <Button type="primary" htmlType="submit" block>
          Login
        </Button>

        <div className="flex justify-start mt-4 text-sm">
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>
      </Form>
    </AuthLayout>
  );
}
