import React, { useState, useEffect } from "react";
import { Table, Input, Button, Space, Modal, message } from "antd";
import Highlighter from "react-highlight-words";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons"; //
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';
import ModeIcon from '@mui/icons-material/Mode';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SupplierForm from "./SupplierForm";
import { useSuppliers } from "../../context/supplierContext";
import { useNavigate } from "react-router-dom";
import "../invatory.css";

const Supplier = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const Navigate =useNavigate()

  const { suppliers, updateSupplier, deleteSupplier, addSupplier } = useSuppliers();
  // console.log('suppliers', suppliers)
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
            style={{ width: 80 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 80 }}
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
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
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
    deleteSupplier(id);
  };

  const handleOk = (values) => {
    if (editingItem) {
      updateSupplier(editingItem._id, values);
    } else {
      addSupplier(values);
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: "Shop Name",
      dataIndex: "shopName",
      key: "shopName",
      ...getColumnSearchProps("shopName"),
    },
    {
      title: "Supplier Name",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      ...getColumnSearchProps("address"),
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNo",
      key: "phoneNo",
    },

    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="left">
          <Button
            type="link"
            icon={<ModeIcon />}
            onClick={() => handleEdit(record)}
          />
          <Button
            type="link"
            icon={<DeleteSharpIcon/>}
            danger
            onClick={() => handleDelete(record._id)}
          />
          <Button
            type="link"
            icon={<VisibilityIcon />}
            onClick={() => {Navigate(`/supplier-detail/${record._id}`)}}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h3 style={{ marginTop: 20 ,marginLeft:5}}>Supplier List</h3>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Add Supplier
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={suppliers}
        rowKey={(record) => record._id}
        pagination={true}
        className="css-table"
      />

      <Modal
        title={editingItem ? "Edit Supplier" : "Add Supplier"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <SupplierForm
          initialValues={
            editingItem || {
              name: "",
              address: "",
              phoneNo: "",
              shopName: "",
            }
          }
          onFinish={handleOk}
          onCancel={handleCancel}
        />
      </Modal>
    </div>
  );
};

export default Supplier;  
