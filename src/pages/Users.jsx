import { Breadcrumb, Button, theme, Popconfirm } from "antd";
import TableReUsable from "../components/Table";
import { deleteUser, getAllUser } from "../api/main";
import { useState, useEffect } from "react";
import { notify } from "../components/notification";
import { DeleteOutlined } from "@ant-design/icons";

const Users = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const handleDelete = async (id) => {
    try {
      const response = await deleteUser(id);
      if (response?.status === 200) {
        notify("success", "User deleted successfully!");
        handleUserData(tableParams);
      }
    } catch (error) {
      notify("error", error);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      width: "20%",
    },
    {
      title: "Email",
      dataIndex: "email",
      width: "25%",
    },
    {
      title: "Phone",
      dataIndex: "phoneNo",
      width: "20%",
    },
    {
      title: "Joined At",
      dataIndex: "createdAt",
      sorter: true,
      render: (date) => new Date(date).toLocaleDateString(),
      width: "20%",
    },
    {
      title: "Action",
      key: "action",
      width: "15%",
      render: (_, record) => (
        <Popconfirm
          title="Delete this user?"
          onConfirm={() => handleDelete(record._id)}
          okText="Yes"
          cancelText="No"
        >
          <Button danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  const handleUserData = async (params) => {
    try {
      setLoading(true);
      const response = await getAllUser(
        (params.pagination.current - 1) * params.pagination.pageSize,
        params.pagination.pageSize,
        params.filters,
        params.sortField,
        params.sortOrder
      );
      if (response?.status === 200) {
        setUsers(response.data);
        setTotalCount(response.totalCount);
      }
    } catch (error) {
      console.error(error);
      notify("error", "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleUserData(tableParams);
  }, [tableParams]);

  const handleTableChange = (newParams) => {
    setTableParams(newParams);
  };

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
        <TableReUsable
          columns={columns}
          data={users}
          totalCount={totalCount}
          loading={loading}
          onTableChange={handleTableChange}
          tableParams={tableParams}
        />
      </div>
    </>
  );
};

export default Users;
