import React, { useEffect } from "react";
import { Form, Input, Button, DatePicker, Select, Space, Row, Col } from "antd";
import moment from "moment";

const { Option } = Select;

const PurchaseForm = ({ initialValues, onFinish, onCancel }) => {
  const [form] = Form.useForm();

  // Convert the purchaseDate to a moment object if it's provided
  const initialFormValues = {
    ...initialValues,
    purchaseDate: initialValues?.purchaseDate ? moment(initialValues.purchaseDate) : null,
  };

  // Reset form fields when the modal is closed
  useEffect(() => {
    form.resetFields();
  }, [initialValues, form]);

  return (
    <Form
      form={form}
      initialValues={initialFormValues}
      onFinish={onFinish}
      layout="vertical"
    >
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item 
            name="itemName" 
            label="Item Name" 
            rules={[{ required: true, message: "Please input the item name!" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item 
            name="quantity" 
            label="Quantity" 
            rules={[{ required: true, message: "Please input the quantity!" }]}
          >
          
            <Input type="number" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={12}>
          <Form.Item 
            name="unit" 
            label="Unit of Measure" 
            rules={[{ required: true, message: "Please select the unit of measure!" }]}
          >
            <Select placeholder="Select a unit">
              <Option value="Kg">Kg</Option>
              <Option value="Liter">Liter</Option>
              <Option value="pieces">Pieces</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item 
            name="unitPrice" 
            label="Unit Price" 
            rules={[{ required: true, message: "Please input the unit price!" }]}
          >
            <Input type="number" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={12}>
          <Form.Item 
            name="supplier" 
            label="Supplier" 
            rules={[{ required: true, message: "Please input the supplier!" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item 
            name="purchaseDate" 
            label="Purchase Date" 
            rules={[{ required: true, message: "Please input the purchase date!" }]}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item wrapperCol={{ span: 24 }}>
        <Space>
         <Button type="primary" htmlType="submit">
          Add
        </Button>

          <Button
            onClick={() => {
              form.resetFields();
              onCancel();
            }}
          >
            Cancel
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default PurchaseForm;
