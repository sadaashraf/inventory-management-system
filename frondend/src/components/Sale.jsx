import React, { useState, useEffect } from "react";
import { Table, Input, Button, Space, Modal, message, Form } from "antd";
import Highlighter from "react-highlight-words";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from 'dayjs';
import SaleForm from './SaleForm';

const API_URL = "http://localhost:8000/api/sales";

const Sale = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [dataSource, setDataSource] = useState([]);
  const [editingSale, setEditingSale] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm(); // Create the form instance

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await axios.get(API_URL);
        const sales = response.data.map(sale => ({
          ...sale,
          saleDate: sale.saleDate ? dayjs(sale.saleDate) : null
        }));
        setDataSource(sales);
      } catch (error) {
        console.error("Error fetching sales:", error.message);
        message.error("Error fetching sales data");
      }
    };
    fetchSales();
  }, []);

  useEffect(() => {
    if (!editingSale) {
      form.resetFields(); // Reset form fields when no sale is being edited
    }
  }, [editingSale, form]);

  const showModal = () => {
    setEditingSale(null);
    form.resetFields(); // Ensure form is reset for a new sale
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingSale) {
        const updatedSale = await axios.put(`${API_URL}/${editingSale._id}`, {
          ...values,
          saleDate: values.saleDate ? values.saleDate.format('YYYY-MM-DD') : null
        });
        setDataSource(dataSource.map((item) =>
          item._id === editingSale._id ? updatedSale.data : item
        ));
        message.success("Sale updated successfully");
      } else {
        const newSale = await axios.post(API_URL, {
          ...values,
          saleDate: values.saleDate ? values.saleDate.format('YYYY-MM-DD') : null
        });
        setDataSource([...dataSource, newSale.data]);
        message.success("Sale created successfully");
      }
      setIsModalOpen(false);
      form.resetFields(); // Reset form fields after submission
    } catch (error) {
      message.error("Error submitting the form");
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields(); // Reset form fields on cancel
  };

  const editSale = (record) => {
    setEditingSale(record);
    form.setFieldsValue({
      ...record,
      saleDate: record.saleDate ? dayjs(record.saleDate) : null
    });
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
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      sorter: (a, b) => a.quantity - b.quantity,
      render: (text, record) => (
        <span>{text} {record.unit}</span>
      ),
    },
    {
      title: "Unit Price",
      dataIndex: "unitPrice",
      key: "unitPrice",
      sorter: (a, b) => a.unitPrice - b.unitPrice,
      render: (text) => `${text}`,
    },
    {
      title: "Total Price",
      key: "totalPrice",
      render: (text, record) => `${record.quantity * record.unitPrice}`,
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
      render: (date) => dayjs(date).format("YYYY-MM-DD"),
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

      <Modal
        title={editingSale ? "Edit Sale" : "Add Sale"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={editingSale ? "Update" : "Add"}
      >
        <SaleForm form={form} initialValues={editingSale} />
      </Modal>
    </div>
  );
};

export default Sale;
