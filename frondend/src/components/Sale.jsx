import React, { useState, useEffect } from "react";
import { Table, Input, Button, Space, Modal, Form, message } from "antd";
import Highlighter from "react-highlight-words";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";

const API_URL = "http://localhost:8000/api/sales"; // Replace with your backend URL

// Create a new sale
export const createSale = async (saleData) => {
  try {
    const response = await axios.post(API_URL, saleData);
    console.log("Sale Created:", response.data); // Debugging
    return response.data;
  } catch (error) {
    console.error("Error creating sale:", error.response || error.message); // Debugging
    throw new Error(error.response?.data?.message || "Error creating sale");
  }
};

// Get all sales
export const getSales = async () => {
  try {
    const response = await axios.get(API_URL);
    console.log("Sales Fetched:", response.data); // Debugging
    return response.data;
  } catch (error) {
    console.error("Error fetching sales:", error.response || error.message); // Debugging
    throw new Error(error.response?.data?.message || "Error fetching sales");
  }
};

// Update a sale
export const updateSale = async (id, saleData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, saleData);
    console.log("Sale Updated:", response.data); // Debugging
    return response.data;
  } catch (error) {
    console.error("Error updating sale:", error.response || error.message); // Debugging
    throw new Error(error.response?.data?.message || "Error updating sale");
  }
};

// Delete a sale
export const deleteSale = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    console.log("Sale Deleted:", id); // Debugging
  } catch (error) {
    console.error("Error deleting sale:", error.response || error.message); // Debugging
    throw new Error(error.response?.data?.message || "Error deleting sale");
  }
};

const Sale = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [dataSource, setDataSource] = useState([]);
  const [editingSale, setEditingSale] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const sales = await axios.get(API_URL);
        setDataSource(sales.data);
      } catch (error) {
        console.error("Error fetching sales:", error.message);
        message.error("Error fetching sales data");
      }
    };
    fetchSales();
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingSale) {
        // Update sale
        const updatedSale = await axios.put(`${API_URL}/${editingSale._id}`, values);
        setDataSource(dataSource.map((item) => (item._id === editingSale._id ? updatedSale.data : item)));
        message.success("Sale updated successfully");
      } else {
        // Create new sale
        const newSale = await axios.post(API_URL, values);
        setDataSource([...dataSource, newSale.data]);
        message.success("Sale created successfully");
      }
      setIsModalOpen(false);
      form.resetFields();
      setEditingSale(null);
    } catch (error) {
      message.error("Error submitting the form");
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setEditingSale(null);
  };

  const editSale = (record) => {
    setEditingSale(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const deleteSaleHandler = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setDataSource(dataSource.filter((item) => item._id !== id));
      message.success("Sale deleted successfully");
    } catch (error) {
      message.error("Error deleting the sale");
    }
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : "",
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }} searchWords={[searchText]} autoEscape textToHighlight={text ? text.toString() : ""} />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const columns = [
    {
      title: "Item Name",
      dataIndex: "itemName",
      key: "itemName",
      ...getColumnSearchProps("itemName"),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: "Unit Price",
      dataIndex: "unitPrice",
      key: "unitPrice",
      sorter: (a, b) => a.unitPrice - b.unitPrice,
      render: (text) => `$${text}`,
    },
    {
      title: "Total Price",
      key: "totalPrice",
      render: (text, record) => `$${record.quantity * record.unitPrice}`,
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
      ...getColumnSearchProps("customer"),
    },
    {
      title: "Sale Date",
      dataIndex: "saleDate",
      key: "saleDate",
      sorter: (a, b) => new Date(a.saleDate) - new Date(b.saleDate),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => editSale(record)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => deleteSaleHandler(record._id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
        Add Sale
      </Button>
      <Table columns={columns} dataSource={dataSource} rowKey="_id" />

      <Modal title={editingSale ? "Edit Sale" : "Add Sale"} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Form form={form} layout="vertical">
          <Form.Item name="itemName" label="Item Name" rules={[{ required: true, message: "Please enter the item name" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="quantity" label="Quantity" rules={[{ required: true, message: "Please enter the quantity" }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="unitPrice" label="Unit Price" rules={[{ required: true, message: "Please enter the unit price" }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="customer" label="Customer" rules={[{ required: true, message: "Please enter the customer name" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="saleDate" label="Sale Date" rules={[{ required: true, message: "Please enter the sale date" }]}>
            <Input type="date" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Sale;
