import React from 'react';
import { Form, Input, Select, DatePicker, Row, Col } from 'antd';
import dayjs from 'dayjs';

const { Option } = Select;

const SaleForm = ({ form, initialValues }) => {
  // Convert saleDate to dayjs object if it's a string or Date object
  const initialFormValues = {
    ...initialValues,
    saleDate: initialValues?.saleDate ? dayjs(initialValues.saleDate) : null,
  };

  return (
    <Form
      form={form} // Ensure the form instance is passed here
      layout="vertical"
      initialValues={initialFormValues}
      style={{ padding: '20px', borderRadius: '8px' }} // Removed backgroundColor
    >
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            name="itemName"
            label="Item Name"
            rules={[{ required: true, message: "Please enter the item name" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[{ required: true, message: "Please enter the quantity" }]}
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
            <Select>
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
            rules={[{ required: true, message: "Please enter the unit price" }]}
          >
            <Input type="number" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            name="customer"
            label="Customer"
            rules={[{ required: true, message: "Please enter the customer name" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="saleDate"
            label="Sale Date"
            rules={[{ required: true, message: "Please enter the sale date" }]}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default SaleForm;
