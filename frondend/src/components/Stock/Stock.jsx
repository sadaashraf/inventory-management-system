import React, { useEffect, useState } from "react";
import { Table, Button, Space, Modal, message } from "antd";
import axios from "axios";
import StockForm from "./StockForm"; // Assuming StockForm is the form component
import { useStocks } from "../../context/stocksContext";
import moment from "moment";
import { Delete, DeleteOutline, EditOutlined } from "@mui/icons-material";
import { IconButton } from "@mui/material";

const Stock = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStock, setEditingStock] = useState(null); // To track editing stock

  const { stockData, loading, addStock, updateStock, deleteStock } =
    useStocks();

  // Handle form submission to add a new stock item
  const handleAddStock = async (values) => {
    try {
      if (editingStock) {
        // If editing, update the existing stock
        updateStock(editingStock._id, values);
        setIsModalVisible(false);
        setEditingStock(null);
      } else {
        // If not editing, create a new stock
        const existingItem = stockData.find(
          (item) => item.itemName === values.itemName
        );

        if (existingItem) {
          // If the item exists, update the quantity and price
          const updatedValues = {
            ...existingItem,
            quantity: existingItem.quantity + values.quantity, // Update quantity as needed
            price: values.price, // Update price from the input values
          };
          updateStock(existingItem._id, updatedValues);
          setIsModalVisible(false);
          setEditingStock(null);
        } else {
          addStock(values);
          setIsModalVisible(false);
        }
      }
    } catch (error) {
      message.error("Error adding/updating stock", error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingStock(null);
  };

  const handleEdit = (record) => {
    setEditingStock(record);
    setIsModalVisible(true); // Open modal with editing data
  };

  const columns = [
    { title: "Item Name", dataIndex: "itemName", key: "itemName" },
    { title: "Category", dataIndex: "category", key: "category" },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    { title: "Unit", dataIndex: "unit", key: "unit" },
    { title: "Price", dataIndex: "price", key: "price" },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="small">
          <IconButton color="secondary" onClick={() => handleEdit(updateStock)}>
            <EditOutlined />
          </IconButton>
          <IconButton color="error" onClick={() => deleteStock(record._id)}>
            <DeleteOutline />
          </IconButton>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Add Button to show the form modal */}
      <Button type="primary" onClick={() => setIsModalVisible(true)}>
        Add Stock
      </Button>

      {/* Stock Table */}
      <Table
        dataSource={stockData}
        columns={columns}
        rowKey={(record) => record._id}
        loading={loading}
        style={{ marginTop: 16 }}
      />

      {/* Stock Form Modal */}
      <Modal
        title={editingStock ? "Edit Stock" : "Add Stock"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null} // Disable default footer buttons
      >
        <StockForm
          initialValues={
            editingStock || {
              itemName: "",
              category: "",
              quantity: 0,
              unit: "",
              price: 0,
              expiredDate: null,
            }
          }
          onFinish={handleAddStock}
          onCancel={handleCancel}
        />
      </Modal>
    </div>
  );
};

export default Stock;
