import React, { useState, useEffect } from "react";
import {
  Card,
  Layout,
  theme,
  Statistic,
  Row,
  Col,
  DatePicker,
  Select,
  Space,
  Table,
  Tag,
  Skeleton,
} from "antd";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { getDashboardData } from "../api/main";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const { Option } = Select;
const { RangePicker } = DatePicker;

const Dashboard = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [timeRange, setTimeRange] = useState("month");
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await getDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get number of days in current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Generate labels for current month (dates 1-31)
  const labels = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Generate dummy payment data for current month
  const generateDummyData = () => {
    return labels.map((day) => {
      // More payments towards the end of the month with some randomness
      const basePayments = Math.floor(Math.random() * 500) + 200;
      const trendBonus = Math.floor(day / 7) * 150;
      const weekendDrop =
        new Date(currentYear, currentMonth, day).getDay() === 0 ||
        new Date(currentYear, currentMonth, day).getDay() === 6
          ? -100
          : 0;
      return basePayments + trendBonus + weekendDrop;
    });
  };

  const paymentData = generateDummyData();
  const totalRevenue = paymentData.reduce((sum, value) => sum + value, 0);
  const averageDaily = Math.round(totalRevenue / daysInMonth);
  const maxDaily = Math.max(...paymentData);

  const planColors = {
    elites: {
      backgroundColor: "rgba(75, 192, 192, 0.6)",
      borderColor: "rgb(75, 192, 192)",
    },
    premium: {
      backgroundColor: "rgba(255, 99, 132, 0.6)",
      borderColor: "rgb(255, 99, 132)",
    },
    // Add more colors for other plans if needed
    default: {
      backgroundColor: "rgba(64, 123, 255, 0.5)",
      borderColor: "rgb(64, 123, 255)",
    },
  };

  // Prepare chart data based on API response
  const getChartData = () => {
    if (!dashboardData) return null;

    const planWiseData = dashboardData.data.planWiseData;

    // Check if we have linear data (more than 1 data point for line chart)
    const hasLinearData = planWiseData.length > 1;

    return {
      labels: planWiseData.map((item) => item._id),
      datasets: [
        {
          label: hasLinearData ? "Revenue by Plan" : "Revenue",
          data: planWiseData.map((item) => item.revenue),
          backgroundColor: planWiseData.map(
            (item) =>
              planColors[item._id]?.backgroundColor ||
              planColors.default.backgroundColor
          ),
          borderColor: planWiseData.map(
            (item) =>
              planColors[item._id]?.borderColor ||
              planColors.default.borderColor
          ),
          borderWidth: 1,
        },
      ],
    };
  };
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text:
          dashboardData && dashboardData.data.planWiseData.length > 1
            ? "Revenue by Subscription Plan"
            : "Revenue Overview",
        font: {
          size: 16,
          weight: "bold",
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        titleColor: "rgb(255, 255, 255)",
        bodyColor: "rgb(255, 255, 255)",
        borderColor: "rgba(255, 255, 255, 0.2)",
        borderWidth: 1,
        callbacks: {
          label: function (context) {
            return ` ${context.dataset.label}: $${context.parsed.y}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Amount ($)",
        },
        ticks: {
          callback: function (value) {
            return "$" + value;
          },
        },
      },
      x: {
        title: {
          display: true,
          text: "Subscription Plan",
        },
      },
    },
    maintainAspectRatio: false,
  };

  // Columns for the subscription table
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Subscription Plan",
      dataIndex: "plan",
      key: "plan",
      render: (plan) => <Tag color="blue">{plan}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status ? "green" : "red"}>
          {status ? "Active" : "Inactive"}
        </Tag>
      ),
    },
  ];

  // Prepare table data from API response
  const getTableData = () => {
    if (!dashboardData) return [];

    return dashboardData.data.lastFiveSubs.map((sub, index) => ({
      key: index,
      name: sub?.user?.name,
      email: sub?.user?.email,
      plan: sub?.plan?.planName,
      status: sub?.isActive,
    }));
  };

  if (loading) {
    return (
      <>
        <div className="grid grid-cols-4 gap-3">
          <Card>
            <Skeleton active paragraph={{ rows: 1 }} />
          </Card>
          <Card>
            <Skeleton active paragraph={{ rows: 1 }} />
          </Card>
          <Card>
            <Skeleton active paragraph={{ rows: 1 }} />
          </Card>
          <Card>
            <Skeleton active paragraph={{ rows: 1 }} />
          </Card>
          <div
            className="col-span-2"
            style={{
              padding: "24px",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Skeleton active paragraph={{ rows: 4 }} />
          </div>
          <Card className="col-span-2">
            <Skeleton active paragraph={{ rows: 6 }} />
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="grid grid-cols-4 gap-3">
        <Card>
          <Statistic
            title="Total Users"
            value={dashboardData?.data.totalUsers || 0}
            precision={0}
            valueStyle={{ color: "#3f8600" }}
          />
        </Card>
        <Card>
          <Statistic
            title="Users with Active Subs"
            value={dashboardData?.data?.usersWithActiveSubs || 0}
            precision={0}
            valueStyle={{ color: "#3f8600" }}
          />
        </Card>
        <Card>
          <Statistic
            title="Total Revenue"
            value={dashboardData?.data?.totalRevenue || 0}
            precision={2}
            valueStyle={{ color: "#3f8600" }}
            prefix="$"
          />
        </Card>
        <Card>
          <Statistic
            title="Today's Revenue"
            value={dashboardData?.data?.todaysRevenue || 0}
            precision={2}
            valueStyle={{ color: "#3f8600" }}
            prefix="$"
          />
        </Card>
        <div
          className="col-span-2"
          style={{
            padding: "24px 12px 24px 0",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <div
            style={{
              marginBottom: "24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2 style={{ margin: 0 }}>Revenue Dashboard</h2>
          </div>

          {/* <Row gutter={16} style={{ marginBottom: "24px" }}>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Total Revenue"
                  value={dashboardData?.data.totalRevenue || 0}
                  precision={2}
                  valueStyle={{ color: "#3f8600" }}
                  prefix="$"
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Average Daily"
                  value={averageDaily}
                  precision={0}
                  valueStyle={{ color: "#1890ff" }}
                  prefix="$"
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Peak Day"
                  value={maxDaily}
                  precision={0}
                  valueStyle={{ color: "#cf1322" }}
                  prefix="$"
                />
              </Card>
            </Col>
          </Row> */}

          <Row gutter={16}>
            <Col span={24}>
              <Card>
                <div style={{ height: "400px" }}>
                  {dashboardData &&
                    <Bar options={chartOptions} data={getChartData()} />
                  }
                </div>
              </Card>
            </Col>
          </Row>
        </div>
        <div
          className="col-span-2"
          style={{
            padding: "24px 24px 24px 0",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <div
            style={{
              marginBottom: "24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2 style={{ margin: 0 }}>Recent Subscription Purchased</h2>
          </div>
          <Card>
            <Table
              columns={columns}
              dataSource={getTableData()}
              pagination={false}
            />
          </Card>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
