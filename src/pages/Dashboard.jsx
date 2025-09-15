import React, { useState } from "react";
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
} from "antd";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const { Option } = Select;
const { RangePicker } = DatePicker;

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Subscription Purchased",
    key: "subscription",
    dataIndex: "subscription",
  },
];

const Dashboard = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [timeRange, setTimeRange] = useState("month");

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const TableData = [
    {
      key: "1",
      name: "John Brown",

      address: "New York No. 1 Lake Park",
      subscription: "10 pics / day",
    },
    {
      key: "2",
      name: "Jim Green",

      address: "London No. 1 Lake Park",
      subscription: "10 pics / day",
    },
    {
      key: "3",
      name: "Joe Black",

      address: "Sydney No. 1 Lake Park",
      subscription: "10 pics / day",
    },
  ];

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

  const data = {
    labels: labels.map((day) => `${day}`),
    datasets: [
      {
        label: "Daily Revenue ($)",
        data: paymentData,
        borderColor: "rgb(64, 123, 255)",
        backgroundColor: "rgba(64, 123, 255, 0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "rgb(64, 123, 255)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(64, 123, 255)",
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Revenue - ${currentDate.toLocaleString("default", {
          month: "long",
          year: "numeric",
        })}`,
        font: {
          size: 16,
          weight: "bold",
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `Revenue: $${context.parsed.y}`;
          },
          title: (context) => {
            return `Day ${labels[context[0].dataIndex]}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Day of Month",
          color: "#666",
          font: {
            weight: "bold",
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        title: {
          display: true,
          text: "Amount ($)",
          color: "#666",
          font: {
            weight: "bold",
          },
        },
        beginAtZero: true,
        min: 0,
        ticks: {
          callback: function (value) {
            return "$" + value;
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <>
      <div className="grid grid-cols-4 gap-3">
        <Card>
          <Statistic
            title="Total Users"
            value={maxDaily}
            precision={0}
            valueStyle={{ color: "#3f8600" }}
          />
        </Card>
        <Card>
          <Statistic
            title="Total Active User"
            value={maxDaily}
            precision={0}
            valueStyle={{ color: "#3f8600" }}
          />
        </Card>
        <Card>
          <Statistic
            title="Total Subscription"
            value={maxDaily}
            precision={0}
            valueStyle={{ color: "#3f8600" }}
          />
        </Card>
        <Card>
          <Statistic
            title="Total Active User"
            value={maxDaily}
            precision={0}
            valueStyle={{ color: "#3f8600" }}
          />
        </Card>
        <div
          className="col-span-2"
          style={{
            padding: "24px",
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
            <div>
              <RangePicker />
            </div>
          </div>

          <Row gutter={16} style={{ marginBottom: "24px" }}>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Total Revenue"
                  value={totalRevenue}
                  precision={0}
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
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Card>
                <div style={{ height: "400px" }}>
                  <Line options={options} data={data} />
                </div>
              </Card>
            </Col>
          </Row>
        </div>
        <Card className="col-span-2">
          <h2 style={{ marginBottom: "15px "}}>Recent Subscription</h2>
          <Table columns={columns} dataSource={TableData} />
        </Card>
      </div>
    </>
  );
};

export default Dashboard;
