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

  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
  });

  const [data, setData] = useState([]);
  const handleSubscriptionData = async (params) => {
    try {
      setLoading(true);
      const response = await getSubscription(
        params.pagination.current,
        params.pagination.pageSize,
        params.sortField,
        params.sortOrder
      );
      if (response?.success === true) {
       
        setData(response?.data?.plans || []);
        setTableParams({
          ...params,
          pagination: {
            current: response.page,
            pageSize: params.pagination.pageSize,
            total: response.totalPlans || 0,
          },
        });
        notify("success", "Plans Fetched Successfully");
      }
    } catch (error) {
      console.error(error);
      notify("error", "Failed to fetch plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSubscriptionData({
      pagination: {
        current: 1,
        pageSize: 10,
      },
      sortField: null, // Initial sort field
      sortOrder: null, // Initial sort order
    });
  }, []);

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
      billingCycle: plan.billingCycle.toString(),
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
        billingCycle: editingPlan.billingCycle.toString(),
        activeStatus: editingPlan.activeStatus,
      });
    }
  };

  const handleSubmit = async () => {
    try {
      // Convert values to numbers before sending to API
      const planName = form.getFieldValue("planName");
      const billingCycle = form.getFieldValue("billingCycle");
      const planPrice = Number(form.getFieldValue("planPrice"));

      const response = await createSubscription(
        planName,
        billingCycle,
        planPrice
      );
      
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
      const billingCycle = 
        editForm.getFieldValue("billingCycle"
      );
      const planPrice = Number(editForm.getFieldValue("planPrice"));
      const activeStatus = editForm.getFieldValue("activeStatus");

      const response = await updatePlan(
        editingPlan._id,
        planName,
        billingCycle,
        planPrice,
        activeStatus
      );

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
      if (response?.success === true) {
        notify("success", "Plan deleted successfully!");

        // Check if we're on a page that might now be empty
        const currentPage = tableParams.pagination.current;
        const totalItemsAfterDelete = tableParams.pagination.total - 1;
        const itemsPerPage = tableParams.pagination.pageSize;

        // Calculate the last page after deletion
        const lastPage = Math.ceil(totalItemsAfterDelete / itemsPerPage);

        // If current page is greater than last page, go to last page
        if (currentPage > lastPage) {
          const newTableParams = {
            ...tableParams,
            pagination: {
              ...tableParams.pagination,
              current: lastPage,
              total: totalItemsAfterDelete,
            },
          };
          setTableParams(newTableParams);
          handleSubscriptionData(newTableParams);
        } else {
          // Otherwise, just refresh with current page
          handleSubscriptionData(tableParams);
        }
      }
    } catch (error) {
      notify("error", error);
    }
  };

  const handleTableChange = (newTableParams) => {
    setTableParams(newTableParams);
    handleSubscriptionData(newTableParams);
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
        plan.billingCycle,
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
      dataIndex: "billingCycle",
      width: "20%",
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
      render: (status, record) => (
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
          totalCount={tableParams.pagination.total} // This should now be correct
          loading={loading}
          onTableChange={handleTableChange}
          tableParams={tableParams} // Make sure this is passed
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
              name="billingCycle"
              label="Duration"
              rules={[{ required: true, message: "Please select a duration" }]}
            >
              <Select
                placeholder="Select Tenure"
                optionFilterProp="label"
                onChange={onChange}
                options={[
                  {
                    value: "Monthly",
                    label: "Monthly",
                  },
                   {
                    value: "Quarterly",
                    label: "Quarterly",
                  },
                  {
                    value: "Yearly",
                    label: "Yearly",
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
              name="billingCycle"
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
