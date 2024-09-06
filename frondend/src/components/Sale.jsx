import React, { useState, useEffect } from "react";
import { Table, Input, Button, Space, Modal, message } from "antd";
import Highlighter from "react-highlight-words";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import moment from "moment";
import SaleForm from "./SaleForm";

const Sale = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [dataSource, setDataSource] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/api/sales");
      setDataSource(response.data);
    } catch (error) {
      message.error("Error fetching sales");
    } finally {
      setLoading(false);
    }
  };

  const addSale = async (saleData) => {
    try {
      const response = await axios.post("http://localhost:8000/api/sales", saleData);
      setDataSource((prevData) => [...prevData, response.data]);
      message.success("Sale added successfully");
    } catch (error) {
      message.error("Error adding sale");
    }
  };

  const updateSale = async (id, saleData) => {
    try {
      const response = await axios.put(`http://localhost:8000/api/sales/${id}`, saleData);
      setDataSource((prevData) =>
        prevData.map((item) => (item._id === id ? response.data : item))
      );
      message.success("Sale updated successfully");
    } catch (error) {
      message.error("Error updating sale");
    }
  };

  const deleteSale = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/sales/${id}`);
      setDataSource((prevData) => prevData.filter((item) => item._id !== id));
      message.success("Sale deleted successfully");
    } catch (error) {
      message.error("Error deleting sale");
    }
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
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
            style={{ width: 80 }}
          >
            Search
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 80 }}>
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
    deleteSale(id);
  };

  const handleOk = (values) => {
    if (editingItem) {
      updateSale(editingItem._id, values);
    } else {
      addSale(values);
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: "Sale Date",
      dataIndex: "saleDate",
      key: "saleDate",
      sorter: (a, b) => new Date(a.saleDate) - new Date(b.saleDate),
      render: (date) => moment(date).format("YYYY-MM-DD"),
    },
    {
      title: "Item Name",
      dataIndex: "itemName",
      key: "itemName",
      ...getColumnSearchProps("itemName"),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      sorter: (a, b) => a.quantity - b.quantity,
      render: (text, record) => (
        <span>{text} {record.unit}</span>
      ),
    },
    {
      title: 'Unit Price',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      sorter: (a, b) => a.unitPrice - b.unitPrice,
    },
    {
      title: 'Total Price',
      key: 'totalPrice',
      render: (text, record) => (record.quantity * record.unitPrice),
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
      ...getColumnSearchProps("customer"),
    },
 
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button type="link" icon={<DeleteOutlined />} danger onClick={() => handleDelete(record._id)} />
        </Space>
      ),
    },
  ];

  const calculateTotalSale = () => {
    return dataSource.reduce((total, item) => total + item.quantity * item.unitPrice, 0);
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Add Sale
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey={(record) => record._id}
        pagination={false}
        loading={loading}
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={5} />
            <Table.Summary.Cell index={1}>Total Sale</Table.Summary.Cell>
            <Table.Summary.Cell index={2} colSpan={1}>
              <strong>{calculateTotalSale()}</strong>
            </Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />

      <Modal
        title={editingItem ? "Edit Sale" : "Add Sale"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <SaleForm
          initialValues={editingItem || { itemName: "", quantity: "", unitPrice: "", customer: "", saleDate: "" }}
          onFinish={handleOk}
          onCancel={handleCancel}
        />
      </Modal>
    </div>
  );
};

export default Sale;
