import React from 'react';
import { Form, Input, Button, Space } from 'antd';

const SupplierForm = ({ initialValues, onFinish, onCancel }) => {
  const [form] = Form.useForm();
console.log('initialValues', initialValues)
  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={(values)=>{
        onFinish(values)
        form.resetFields();
      }}
    >
      <Form.Item
        label="Supplier Name"
        name="name"
        rules={[{ required: true, message: 'Please input the supplier name!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Shop Name"
        name="shopName"
        rules={[{ required: true, message: 'Please input the Shop Name!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Address"
        name="address"
        rules={[{ required: true, message: 'Please input the address!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Phone Number"
        name="phoneNo"
        rules={[{ required: true, message: 'Please input the phone number!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            {initialValues.name !=="" ? "Update" : "Add"}
          </Button>
          <Button onClick={onCancel}>Cancel</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default SupplierForm;
