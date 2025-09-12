import {
  Breadcrumb,
  Layout,
  Menu,
  theme,
  Button,
  Modal,
  Flex,
  Form,
  Input,
  Select,
  Popconfirm,
  Switch,
} from "antd";
import TableReUsable from "../components/Table";
import { useState, useEffect } from "react";
import {
  createSubscription,
  getSubscription,
  deletePlan,
  updatePlan,
} from "../api/main";
import { notify } from "../components/notification";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const Subscription = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const [data, setData] = useState([]);
  const handleSubscriptionData = async (params) => {
    try {
      setLoading(true);
      const response = await getSubscription(
        params.pagination.current - 1,
        params.pagination.pageSize,
        params
      );
      console.log("response", response);
      if (response) {
        setData(response);
        setTotalCount(response.length);
        notify("success", "Plans Fetched Successfully");
      }
    } catch (error) {
      console.error(error);
      notify("error", "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSubscriptionData(tableParams);
  }, [tableParams]);

  const onChange = (value) => {
    console.log(`selected ${value}`);
  };

  const showModal = () => {
    setOpen(true);
  };

  const showEditModal = (plan) => {
    setEditingPlan(plan);
    editForm.setFieldsValue({
      planName: plan.planName,
      planPrice: plan.planPrice,
      validityDuration: plan.validityDuration.toString(),
      activeStatus: plan.activeStatus,
    });
    setEditOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleEditCancel = () => {
    setEditOpen(false);
    setEditingPlan(null);
    editForm.resetFields();
  };

  const handleReset = () => {
    form.resetFields();
  };

  const handleEditReset = () => {
    if (editingPlan) {
      editForm.setFieldsValue({
        planName: editingPlan.planName,
        planPrice: editingPlan.planPrice,
        validityDuration: editingPlan.validityDuration.toString(),
        activeStatus: editingPlan.activeStatus,
      });
    }
  };

  const handleSubmit = async () => {
    try {
      // Convert values to numbers before sending to API
      const planName = form.getFieldValue("planName");
      const validityDuration = Number(form.getFieldValue("validityDuration"));
      const planPrice = Number(form.getFieldValue("planPrice"));

      const response = await createSubscription(
        planName,
        validityDuration,
        planPrice
      );
      console.log("response", response);
      if (response?.success === true) {
        setOpen(false);
        form.resetFields();
        notify("success", "Subscription created successfully!");
        handleSubscriptionData(tableParams); // Refresh the table
      }
    } catch (error) {
      // Extract error message from error object
      const errorMessage =
        error.response?.data?.message || error.message || "An error occurred";
      notify("error", errorMessage);
    }
  };

  const handleEditSubmit = async () => {
    try {
      setConfirmLoading(true);
      // Get values from form
      const planName = editForm.getFieldValue("planName");
      const validityDuration = Number(
        editForm.getFieldValue("validityDuration")
      );
      const planPrice = Number(editForm.getFieldValue("planPrice"));
      const activeStatus = editForm.getFieldValue("activeStatus");

      const response = await updatePlan(
        editingPlan._id,
        planName,
        validityDuration,
        planPrice,
        activeStatus
      );

      console.log("response update", response);
      if (response?.success === true) {
        setEditOpen(false);
        setEditingPlan(null);
        editForm.resetFields();
        notify("success", "Plan updated successfully!");
        handleSubscriptionData(tableParams); // Refresh the table
      }
    } catch (error) {
      // Extract error message from error object
      const errorMessage =
        error.response?.data?.message || error.message || "An error occurred";
      notify("error", errorMessage);
    } finally {
      setConfirmLoading(false);
    }
  };

  const validateNumber = (_, value) => {
    if (!value) {
      return Promise.reject(new Error("Please enter an amount"));
    }

    // Check if value is a valid number
    if (isNaN(Number(value))) {
      return Promise.reject(new Error("Please enter a valid number"));
    }

    // Check if value is positive
    if (Number(value) <= 0) {
      return Promise.reject(new Error("Amount must be greater than zero"));
    }

    return Promise.resolve();
  };

  const handleDelete = async (id) => {
    try {
      const response = await deletePlan(id);
      console.log("response delete", response);
      if (response?.success === true) {
        notify("success", "Plan deleted successfully!");
        handleSubscriptionData(tableParams);
      }
    } catch (error) {
      notify("error", error);
    }
  };

  const handleTableChange = (params) => {
    setTableParams(params);
    handleSubscriptionData(params);
  };

  // Custom footer with three buttons for create modal
  const modalFooter = (
    <Flex gap="small" justify="end">
      <Button danger onClick={handleReset}>
        Reset
      </Button>
      <Button onClick={handleCancel}>Cancel</Button>
      <Button type="primary" loading={confirmLoading} onClick={handleSubmit}>
        Submit
      </Button>
    </Flex>
  );

  // Custom footer with three buttons for edit modal
  const editModalFooter = (
    <Flex gap="small" justify="end">
      <Button danger onClick={handleEditReset}>
        Reset
      </Button>
      <Button onClick={handleEditCancel}>Cancel</Button>
      <Button
        type="primary"
        loading={confirmLoading}
        onClick={handleEditSubmit}
      >
        Update
      </Button>
    </Flex>
  );

  const handleStatusChange = async (id, status) => {
    try {
      // Find the current plan data
      const plan = data.find((item) => item._id === id);
      if (!plan) return;
      // Update only the activeStatus field
      const response = await updatePlan(
        id,
        plan.planName,
        plan.validityDuration,
        plan.planPrice,
         status // This is the new status from the switch
      );

      if (response?.success === true) {
        notify("success", "Plan status updated successfully!");
        // Refresh the table data
        handleSubscriptionData(tableParams);
      }
    } catch (error) {
      // Extract error message from error object
      const errorMessage =
        error.response?.data?.message || error.message || "An error occurred";
      notify("error", errorMessage);
      // Revert the switch in case of error
      handleSubscriptionData(tableParams);
    }
  };

  const columns = [
    {
      title: "Plan Name",
      dataIndex: "planName",
      sorter: true,
      width: "20%",
    },
    {
      title: "Plan Price",
      dataIndex: "planPrice",
      sorter: true,
      width: "20%",
    },
    {
      title: "Validity Duration",
      dataIndex: "validityDuration",
      sorter: true,
      width: "20%",
      render: (duration) => `${duration} days`,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      sorter: true,
      render: (date) => new Date(date).toLocaleDateString(),
      width: "20%",
    },
    {
      title: "Active Status",
      dataIndex: "activeStatus",
      render: (status , record) => (
        <Switch
          checked={status}
          onChange={(checked) => handleStatusChange(record._id, checked)}
        />
      ),
      width: "15%",
    },
    {
      title: "Action",
      key: "action",
      width: "20%",
      render: (_, record) => (
        <Flex gap="small">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
          />

          <Popconfirm
            title="Delete this Plan?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Flex>
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-between align-center mb-4">
        <Breadcrumb items={[{ title: "Home" }, { title: "Subscription" }]} />
        <Button type="primary" onClick={showModal}>
          Add Subscription
        </Button>
      </div>
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
          data={data}
          totalCount={totalCount}
          loading={loading}
          onTableChange={handleTableChange}
        />

        {/* Create Plan Modal */}
        <Modal
          title="Add Subscription"
          open={open}
          onCancel={handleCancel}
          width={500}
          footer={modalFooter}
        >
          <Form
            form={form}
            scrollToFirstError={{
              behavior: "instant",
              block: "end",
              focus: true,
            }}
            style={{ paddingBlock: 32 }}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}
          >
            <Form.Item
              name="planName"
              label="Plan Name"
              rules={[{ required: true, message: "Please enter a plan name" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="planPrice"
              label="Amount"
              rules={[
                { required: true, message: "Please enter an amount" },
                { validator: validateNumber },
              ]}
            >
              <Input type="number" min="0" step="0.01" />
            </Form.Item>

            <Form.Item
              name="validityDuration"
              label="Duration"
              rules={[{ required: true, message: "Please select a duration" }]}
            >
              <Select
                placeholder="Select Day or Year"
                optionFilterProp="label"
                onChange={onChange}
                options={[
                  {
                    value: "30",
                    label: "30 days",
                  },
                  {
                    value: "365",
                    label: "1 year",
                  },
                ]}
              />
            </Form.Item>
          </Form>
        </Modal>

        {/* Edit Plan Modal */}
        <Modal
          title="Edit Subscription Plan"
          open={editOpen}
          onCancel={handleEditCancel}
          width={500}
          footer={editModalFooter}
        >
          <Form
            form={editForm}
            scrollToFirstError={{
              behavior: "instant",
              block: "end",
              focus: true,
            }}
            style={{ paddingBlock: 32 }}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}
          >
            <Form.Item
              name="planName"
              label="Plan Name"
              rules={[{ required: true, message: "Please enter a plan name" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="planPrice"
              label="Amount"
              rules={[
                { required: true, message: "Please enter an amount" },
                { validator: validateNumber },
              ]}
            >
              <Input type="number" min="0" step="0.01" />
            </Form.Item>

            <Form.Item
              name="validityDuration"
              label="Duration"
              rules={[{ required: true, message: "Please select a duration" }]}
            >
              <Select
                placeholder="Select Day or Year"
                optionFilterProp="label"
                onChange={onChange}
                options={[
                  {
                    value: "30",
                    label: "30 days",
                  },
                  {
                    value: "365",
                    label: "1 year",
                  },
                ]}
              />
            </Form.Item>

            <Form.Item
              name="activeStatus"
              label="Active Status"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default Subscription;
