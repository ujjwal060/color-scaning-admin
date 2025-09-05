import { Breadcrumb, Layout, Menu, theme } from "antd";
import TableReUsable from "../components/Table";

const Payment = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <>
      <Breadcrumb
        style={{ marginBottom:"16px" }}
        items={[{ title: "Home" }, { title: "Payment" }]}
      />
      <div
        style={{
          padding: 24,
          minHeight: 360,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
       <TableReUsable />
      </div>
    </>
  );
};

export default Payment;
