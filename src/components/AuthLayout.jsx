import { Card } from "antd";

export default function AuthLayout({ title, children }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-custom">
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <h1 className="text-3xl text-center mb-6">{title}</h1>
        {children}
      </Card>
    </div>
  );
}
