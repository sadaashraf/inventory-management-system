import React, { useState, useEffect } from "react";
import { Table, Input, Button, Space, Modal, Form } from "antd";
import Highlighter from "react-highlight-words";

import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";

const Purchase = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [dataSource, setDataSource] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/purchases");
      setDataSource(response.data);
    } catch (error) {
      console.error("Error fetching purchases", error);
    }
  };

  const addPurchase = async (purchaseData) => {
    try {
      const response = await axios.post("http://localhost:8000/api/purchases", purchaseData);
      setDataSource((prevData) => [...prevData, response.data]);
    } catch (error) {
      console.error("Error adding purchase", error);
    }
  };

  const updatePurchase = async (id, purchaseData) => {
    try {
      const response = await axios.put(`http://localhost:8000/api/purchases/${id}`, purchaseData);
      setDataSource((prevData) =>
        prevData.map((item) => (item._id === id ? response.data : item))
      );
    } catch (error) {
      console.error("Error updating purchase", error);
    }
  };

  const deletePurchase = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/purchases/${id}`);
      setDataSource((prevData) => prevData.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting purchase", error);
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
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
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
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : "",
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
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

  const handleAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingItem(record);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    deletePurchase(id);
  };

  const handleOk = (values) => {
    if (editingItem) {
      updatePurchase(editingItem._id, values);
    } else {
      addPurchase(values);
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
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
      title: "Supplier",
      dataIndex: "supplier",
      key: "supplier",
      ...getColumnSearchProps("supplier"),
    },
    {
      title: "Purchase Date",
      dataIndex: "purchaseDate",
      key: "purchaseDate",
      sorter: (a, b) => new Date(a.purchaseDate) - new Date(b.purchaseDate),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record._id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const calculateTotalPurchase = () => {
    return dataSource.reduce((total, item) => total + item.quantity * item.unitPrice, 0);
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Add Purchase
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey={(record) => record._id}
        pagination={false}
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={4} />
            <Table.Summary.Cell index={1}>Total</Table.Summary.Cell>
            <Table.Summary.Cell index={2} colSpan={2}>
              <strong>${calculateTotalPurchase().toFixed(2)}</strong>
            </Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />

      <Modal
        title={editingItem ? "Edit Purchase" : "Add Purchase"}
        open={isModalOpen} // updated prop
        onCancel={handleCancel}
        footer={null}
      >
        <PurchaseForm
          initialValues={editingItem || { itemName: "", quantity: "", unitPrice: "", supplier: "", purchaseDate: "" }}
          onFinish={handleOk}
        />
      </Modal>
    </div>
  );
};

const PurchaseForm = ({ initialValues, onFinish }) => {
  const [form] = Form.useForm();
  
  return (
    <Form form={form} initialValues={initialValues} onFinish={onFinish} layout="vertical">
      <Form.Item name="itemName" label="Item Name" rules={[{ required: true, message: "Please input the item name!" }]}>
        <Input />
      </Form.Item>
      <Form.Item name="quantity" label="Quantity" rules={[{ required: true, message: "Please input the quantity!" }]}>
        <Input type="number" />
      </Form.Item>
      <Form.Item name="unitPrice" label="Unit Price" rules={[{ required: true, message: "Please input the unit price!" }]}>
        <Input type="number" />
      </Form.Item>
      <Form.Item name="supplier" label="Supplier" rules={[{ required: true, message: "Please input the supplier!" }]}>
        <Input />
      </Form.Item>
      <Form.Item name="purchaseDate" label="Purchase Date" rules={[{ required: true, message: "Please input the purchase date!" }]}>
        <Input type="date" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {initialValues ? "Update" : "Add"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Purchase;
