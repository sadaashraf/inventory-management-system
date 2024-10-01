import React from "react";
import {
  Form,
  Input,
  Button,
  Space,
  DatePicker,
  InputNumber,
  Select,
} from "antd";

const { Option } = Select;

const StockForm = ({ initialValues, onFinish, onCancel }) => {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={(values) => {
        onFinish(values);
        form.resetFields(); // Reset fields after form submission
      }}
    >
      {/* Item Name */}
      <Form.Item
        label="Item Name"
        name="itemName"
        rules={[{ required: true, message: "Please input the item name!" }]}
      >
        <Input />
      </Form.Item>

      {/* Category */}
      <Form.Item
        label="Category"
        name="category"
        rules={[{ required: true, message: "Please select a category!" }]}
      >
        <Select placeholder="Select Category">
          <Option value="Food">Food</Option>
          <Option value="Beverage">Beverage</Option>
          <Option value="Cleaning">Cleaning</Option>
          <Option value="Others">Others</Option>
        </Select>
      </Form.Item>

      {/* Quantity */}
      <Form.Item
        label="Quantity"
        name="quantity"
        rules={[{ required: true, message: "Please input the quantity!" }]}
      >
        <InputNumber min={1} />
      </Form.Item>
      <Form.Item
        label="Unit"
        name="unit"
        rules={[{ required: true, message: "Please input the unit!" }]}
      >
        <Select placeholder="Select Unit">
          <Option value="kg">KG</Option>
          <Option value="ltr">Ltr</Option>
          <Option value="pcs">Pcs</Option>
          <Option value="Others">Others</Option>
        </Select>
      </Form.Item>
      <Form.Item
        label="Price"
        name="price"
        rules={[{ required: true, message: "Please input the price!" }]}
      >
        <InputNumber min={1} />
      </Form.Item>



      {/* Submit and Cancel buttons */}
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            {initialValues.itemName ? "Update" : "Add"}
          </Button>
          <Button
            onClick={() => {
              form.resetFields(); // Reset form when cancel is clicked
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

export default StockForm;
