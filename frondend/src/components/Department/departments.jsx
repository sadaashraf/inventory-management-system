import React, { useState } from "react";
import { Table, Input, Button, Space, Modal } from "antd";
import Highlighter from "react-highlight-words";
import {
  SearchOutlined,PlusOutlined, EditOutlined,DeleteOutlined,EyeOutlined,
} from "@ant-design/icons";
import axios from "axios";
import DepartmentForm from "./depermentForm";
import { useDepartments } from "./departmentsContext";
import { useNavigate } from "react-router-dom";
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';
import ModeIcon from '@mui/icons-material/Mode';
import VisibilityIcon from '@mui/icons-material/Visibility';
import "../invatory.css";

const Departments = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const navigate = useNavigate();

  const { departments, updateDepartment, deleteDepartment, addDepartment } = useDepartments();

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

  const handleAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingItem(record);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    deleteDepartment(id);
  };

  const handleOk = (values) => {
    if (editingItem) {
      updateDepartment(editingItem._id, values);
    } else {
      addDepartment(values);
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: "Department",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Manager",
      dataIndex: "manager",
      key: "manager",
      ...getColumnSearchProps("manager"),
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
        <Space size="middle">
          <Button
        type="primary"
        style={{
          backgroundColor: "#FFB300", // Yellow color (for Edit)
          color: "#fff",
          borderColor: "#FFB300",
        }}
        icon={<EditOutlined />} // Edit icon
        onClick={() => handleEdit(record)}
      >
        Edit
      </Button>

      <Button
        type="primary"
        danger
        style={{
          backgroundColor: "#F44336", // Red color (for Delete)
          color: "#fff",
          borderColor: "#F44336",
        }}
        icon={<DeleteOutlined />} // Delete icon
        onClick={() => handleDelete(record._id)}
      >
        Delete
      </Button>
    
      <Button
        type="primary"
        style={{
          backgroundColor: "#00ACC1", // Teal color (for Details)
          color: "#fff", // White text
          borderColor: "#00ACC1", // Match border with background
        }}
        icon={<SearchOutlined />}
        
            onClick={() => navigate(`/department-detail/${record._id}`)}
            >
            Details
          </Button>
        </Space>
      ),
    }
    
  ];

  return (
    <div>
      <h3 style={{ marginTop: 20 ,marginLeft:5}}>Department List</h3>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Add Department
        </Button>
      </Space>
      <Table columns={columns}
       dataSource={departments} 
       rowKey={(record) => record._id}
       pagination={true} 
       className="css-table"
        />

      <Modal
        title={editingItem ? "Edit Department" : "Add Department"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <DepartmentForm
          initialValues={
            editingItem || {
              name: "",
              manager: "",
              phoneNo: "",
            }
          }
          onFinish={handleOk}
          onCancel={handleCancel}
        />
      </Modal>
    </div>
  );
};

export default Departments;
