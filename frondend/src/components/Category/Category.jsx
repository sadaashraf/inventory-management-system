import React, { useState } from "react";
import { Table, Button, Form, Input, Modal, Popconfirm } from "antd";
import { useCategory } from "../../context/categoryContext";
import { DeleteOutline, EditOutlined } from "@mui/icons-material";

const Categories = () => {
  const { categories, loading, addCategory, updateCategory, deleteCategory } =
    useCategory();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();

  // Handle Add/Edit form submission
  const handleFormSubmit = (values) => {
    if (editingCategory) {
      updateCategory(editingCategory._id, values);
    } else {
      addCategory(values);
    }
    setIsModalVisible(false);
    form.resetFields();
    setEditingCategory(null);
  };

  // Handle edit category
  const handleEditCategory = (category) => {
    setEditingCategory(category);
    form.setFieldsValue(category);
    setIsModalVisible(true);
  };

  // Handle add category
  const handleAddCategory = () => {
    setEditingCategory(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <>
          <Button
            onClick={() => handleEditCategory(record)}
            type="text"
            color="primary"
            style={{ marginRight: 8 }}
            icon={<EditOutlined />}
          />

          <Popconfirm
            title="Are you sure to delete this category?"
            onConfirm={() => deleteCategory(record._id)}
            okText="Yes"
            cancelText="No"
            
          >
            <Button type="text" danger icon={<DeleteOutline />} />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      <h3 style={{ marginTop: 20 ,marginLeft:5}}>Category</h3>
      <Button
        type="primary"
        onClick={handleAddCategory}
        style={{ marginBottom: 16 }}
      >
        Add Category
      </Button>
      <Table
        columns={columns}
        dataSource={categories}
        loading={loading}
        rowKey="_id"
      />

      <Modal
        title={editingCategory ? "Edit Category" : "Add Category"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleFormSubmit}>
          <Form.Item
            name="name"
            label="Category Name"
            rules={[
              { required: true, message: "Please enter a category name" },
            ]}
          >
            <Input placeholder="Enter category name" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingCategory ? "Update" : "Add"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Categories;
