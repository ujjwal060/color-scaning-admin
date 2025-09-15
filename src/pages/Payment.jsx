import { Breadcrumb, theme, Segmented } from "antd";
import TableReUsable from "../components/Table";
import React, { useEffect, useState } from "react";
import { getHistorySubs, getActiveSubs } from "../api/main";
import { notify } from "../components/notification";

const Payment = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [alignValue, setAlignValue] = useState("Active");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
  });

  // Table Columns
  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Plan", dataIndex: "planName", key: "planName" },
    { title: "Start Date", dataIndex: "startDate", key: "startDate" },
    { title: "End Date", dataIndex: "endDate", key: "endDate" },
    { title: "Status", dataIndex: "status", key: "status" },
  ];

  const transformData = (response, type) => {
    if (!response) return [];

    if (type === "Active") {
      return response.users.map((item) => ({
        key: item._id,
        name: item.name,
        email: item.email,
        planName: item.activeSubscription?.plan?.planName,
        startDate: new Date(
          item.activeSubscription?.startDate
        ).toLocaleDateString(),
        endDate: new Date(
          item.activeSubscription?.endDate
        ).toLocaleDateString(),
        status: item.activeSubscription?.isActive ? "Active" : "Expired",
      }));
    } else {
      // History
      return response.users.flatMap((item) =>
        item.subscriptions.map((sub) => ({
          key: sub._id,
          name: item.name,
          email: item.email,
          planName: sub.plan?.planName,
          startDate: new Date(sub.startDate).toLocaleDateString(),
          endDate: new Date(sub.endDate).toLocaleDateString(),
          status: sub.isActive ? "Active" : "Expired",
        }))
      );
    }
  };

  const fetchData = async (type) => {
    setLoading(true);
    try {
      let response;
      if (type === "Active") {
        response = await getActiveSubs();
      } else {
        response = await getHistorySubs();
      }
      setData(transformData(response, type));
      setTableParams({
        pagination: {
          current: response.page,
          pageSize: 10,
          total: response.totalUsers,
        },
      });
      notify("success", "Plans Fetched Successfully");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(alignValue);
  }, [alignValue]);

  const handleTableChange = (newTableParams) => {
    if (newTableParams.pagination.current !== tableParams.pagination.current) {
      fetchData(alignValue, newTableParams.pagination.current);
    }
    setTableParams(newTableParams);
  };

  return (
    <>
      <Breadcrumb
        style={{ marginBottom: "16px" }}
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
        <Segmented
          value={alignValue}
          style={{ marginBottom: 16 }}
          onChange={setAlignValue}
          options={["Active", "Expired"]}
        />

        <TableReUsable
          columns={columns}
          data={data}
          totalCount={data?.length}
          loading={loading}
          onTableChange={handleTableChange}
          tableParams={tableParams}
        />
      </div>
    </>
  );
};

export default Payment;
