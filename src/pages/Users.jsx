import { Breadcrumb, Button, Layout, Menu, theme, Modal } from "antd";
import TableReUsable from "../components/Table";

const Users = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <>
      <Breadcrumb
        style={{ marginBottom: "16px" }}
        items={[{ title: "Home" }, { title: "Users" }]}
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

export default Users;
