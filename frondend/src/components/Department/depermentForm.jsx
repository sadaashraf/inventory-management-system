import React from "react";
import { Form, Input, Button, Space } from "antd";

const departmentForm = ({ initialValues, onFinish, onCancel }) => {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={(values) => {
        onFinish(values);
        form.resetFields();
      }}
    >
      <Form.Item
        label="Department"
        name="name"
        rules={[{ required: true, message: "Please input the department name!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Manager"
        name="manager"
        rules={[{ required: true, message: "Please input the manager's name!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Phone Number"
        name="phoneNo"
        rules={[{ required: true, message: "Please input the phone number!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            {initialValues.departmentName !== "" ? "Update" : "Add"}
          </Button>
          <Button onClick={onCancel}>Cancel</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default departmentForm;
