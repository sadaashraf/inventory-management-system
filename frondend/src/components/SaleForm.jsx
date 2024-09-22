

import React, { useEffect, useState } from "react";
import { Form, Input, Button, DatePicker, Select, Space, Row, Col, AutoComplete } from "antd";
import axios from "axios";
import moment from "moment";

const { Option } = Select;

const SaleForm = ({ initialValues, onFinish, onCancel }) => {
  const [form] = Form.useForm();
  const [purchaseItems, setPurchaseItems] = useState([]);

  // Fetch purchase items
  useEffect(() => {
    const fetchPurchaseItems = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/purchases");
        setPurchaseItems(response.data.map(purchase => purchase.itemName)); // Extract item names
      } catch (error) {
        console.error("Error fetching purchase items:", error);
      }
    };
    fetchPurchaseItems();
  }, []);

  // Convert the saleDate to a moment object if it's provided
  const initialFormValues = {
    ...initialValues,
    saleDate: initialValues?.saleDate ? moment(initialValues.saleDate) : null,
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
            <AutoComplete
              options={purchaseItems.map(item => ({ value: item }))}
              placeholder="Select or type item name"
              filterOption={(inputValue, option) =>
                option.value.toLowerCase().includes(inputValue.toLowerCase())
              }
            >
              <Input />
            </AutoComplete>
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

      {/* Other form fields */}
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item name="unit" label="Unit of Measure" rules={[{ required: true, message: "Please select the unit of measure!" }]}>
            <Select placeholder="Select a unit">
              <Option value="Kg">Kg</Option>
              <Option value="Liter">Liter</Option>
              <Option value="pieces">Pieces</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="unitPrice" label="Unit Price" rules={[{ required: true, message: "Please input the unit price!" }]}>
            <Input type="number" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={12}>
          <Form.Item name="customer" label="Customer" rules={[{ required: true, message: "Please input the customer!" }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="saleDate" label="Sale Date" rules={[{ required: true, message: "Please input the sale date!" }]}>
            <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item wrapperCol={{ span: 24 }}>
        <Space>
          <Button type="primary" htmlType="submit">
            Add
          </Button>
          <Button onClick={onCancel}>Cancel</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default SaleForm;
