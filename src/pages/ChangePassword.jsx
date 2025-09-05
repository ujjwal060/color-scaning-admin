import { Form, Input, Button } from "antd";
import AuthLayout from "../components/AuthLayout";

export default function ChangePassword() {
  const onFinish = (values) => {
    console.log("Change Password:", values);
  };

  return (
    <AuthLayout title="Change Password">
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="currentPassword"
          label="Current Password"
          rules={[{ required: true }]}
        >
          <Input.Password placeholder="Enter current password" />
        </Form.Item>

        <Form.Item
          name="newPassword"
          label="New Password"
          rules={[{ required: true }]}
        >
          <Input.Password placeholder="Enter new password" />
        </Form.Item>

        <Form.Item
          name="confirmNewPassword"
          label="Confirm New Password"
          rules={[{ required: true }]}
        >
          <Input.Password placeholder="Confirm new password" />
        </Form.Item>

        <Button type="primary" htmlType="submit" block>
          Change Password
        </Button>
      </Form>
    </AuthLayout>
  );
}
