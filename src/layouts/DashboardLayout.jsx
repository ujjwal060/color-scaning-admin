import { Layout, Menu, Button, Dropdown, Space, Modal } from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  LogoutOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
const { Header, Content, Footer, Sider } = Layout;
const { confirm } = Modal;

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("1");
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const showLogoutConfirm = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogoutOk = () => {
    // Perform logout actions here (clear tokens, etc.)
    localStorage.removeItem("authToken"); // Example: remove token from storage
    sessionStorage.removeItem("userData"); // Example: remove user data

    // Then navigate to login page
    navigate("/login");
    setIsLogoutModalOpen(false);
  };

  const handleLogoutCancel = () => {
    console.log("Cancelled logout");
    setIsLogoutModalOpen(false);
  };

  const DropdownItems = [
    {
      key: "1",
      label: (
        <span onClick={showLogoutConfirm}>
          <LogoutOutlined /> Logout
        </span>
      ),
    },
  ];

  const items = [
    {
      key: "1",
      icon: <UserOutlined />,
      label: "Dashboard",
      path: "/",
    },
    {
      key: "2",
      icon: <UserOutlined />,
      label: "Users",
      path: "/users",
    },
    {
      key: "3",
      icon: <VideoCameraOutlined />,
      label: "Payment",
      path: "/payment",
    },
    {
      key: "4",
      icon: <UploadOutlined />,
      label: "Subscription",
      path: "/subscription",
    },
  ];

  // Set the selected menu based on current path
  useEffect(() => {
    const currentPath = location.pathname;
    const currentItem = items.find((item) => item.path === currentPath);
    if (currentItem) {
      setSelectedMenu(currentItem.key);
    }
  }, [location.pathname]);

  const handleMenuClick = (item) => {
    const menuItem = items.find((i) => i.key === item.key);
    if (menuItem && menuItem.path) {
      navigate(menuItem.path);
      setSelectedMenu(item.key);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <div
          style={{
            height: 32,
            margin: 16,
            background: "rgba(255, 255, 255, 0.2)",
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
          }}
        >
          {collapsed ? "App" : "Application"}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedMenu]}
          items={items.map((item) => ({
            key: item.key,
            icon: item.icon,
            label: item.label,
          }))}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header
          className="flex justify-between items-center"
          style={{ padding: "0px 20px", background: "#fff" }}
        >
          <div onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? (
              <MenuUnfoldOutlined
                className="text-xl"
                style={{ cursor: "pointer" }}
              />
            ) : (
              <MenuFoldOutlined
                style={{ cursor: "pointer" }}
                className="text-xl"
              />
            )}
          </div>
          <Dropdown
            menu={{ items: DropdownItems }}
            placement="bottomLeft"
            arrow={{ pointAtCenter: true }}
            trigger={["click"]}
          >
            <Button type="text" icon={<UserOutlined />} />
          </Dropdown>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: "#fff",
          }}
        >
          <Outlet />
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Color Scanning App ©{new Date().getFullYear()}
        </Footer>
      </Layout>

      {/* Logout Confirmation Modal */}
      <Modal
        title="Confirm Logout"
        open={isLogoutModalOpen}
        onOk={handleLogoutOk}
        onCancel={handleLogoutCancel}
        okText="Yes, Logout"
        cancelText="Cancel"
        okType="danger"
      >
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: 16 }}
        >
          <ExclamationCircleOutlined
            style={{ color: "#faad14", fontSize: 22, marginRight: 8 }}
          />
          <p style={{ margin: 0 }}>Are you sure you want to logout?</p>
        </div>
        <p>You will need to login again to access your account.</p>
      </Modal>
    </Layout>
  );
};

export default DashboardLayout;
