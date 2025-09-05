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
} from "antd";
import TableReUsable from "../components/Table";
import { useState } from "react";

const Subscription = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };

  const handleReset = () => {
    form.resetFields();
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        console.log("Form values:", values);
        handleOk(); // Close modal after submission
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
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


  // Custom footer with three buttons
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
        <TableReUsable />
        <Modal
          title="Add Subscription"
          open={open}
          onOk={handleOk}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
          width={500}
          footer={modalFooter} // Use custom footer
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
            <Form.Item name="title" label="Title" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item
              name="amount"
              label="Amount"
               rules={[
                { required: true },
                { validator: validateNumber }
              ]}
            >
              <Input  />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true }]}
            >
              <Input.TextArea rows={6} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default Subscription;
