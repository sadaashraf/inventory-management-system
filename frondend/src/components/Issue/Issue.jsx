import React, { useEffect, useState } from "react";
import { Table, Input, Button, Space, Modal, message } from "antd";
import Highlighter from "react-highlight-words";
import {SearchOutlined, PlusOutlined, EditOutlined,DeleteOutlined,EyeOutlined,
} from "@ant-design/icons"; // Keeping only relevant icon imports
import axios from "axios";
import moment from "moment";
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';
import ModeIcon from '@mui/icons-material/Mode';
import VisibilityIcon from '@mui/icons-material/Visibility';
import IssueForm from "./IssueForm"; // Assuming you have an IssueForm component
import { useDepartments } from "../Department/departmentsContext";
import { Dialog, DialogContent,DialogTitle,IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../invatory.css";
const Issue = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [dataSource, setDataSource] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const Navigate = useNavigate();
  const { departments, } = useDepartments();
  useEffect(() => {
    fetchIssues(); // Fetching issues instead of sales
  }, []);

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/api/sales"); // Assuming 'issues' endpoint
      console.log("response", response.data);
      setDataSource(response.data);
    } catch (error) {
      message.error("Error fetching issues");
    } finally {
      setLoading(false);
    }
  };

  const addIssue = async (issueData) => {
    
    const deptId = departments.find((dept) => dept.name === issueData.department)._id;

    try {
      const response = await axios.post(
        `http://localhost:8000/api/sales/${deptId}`, // Assuming 'issues' endpoint for adding
        issueData
      );
      setDataSource((prevData) => [...prevData, response.data]);
      message.success("Issue added successfully");
    } catch (error) {
      message.error("Error adding issue");
      console.log('error', error)
    }
  };

  const updateIssue = async (id, issueData) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/sales/${id}`, // Assuming 'issues' endpoint for updating
        issueData
      );
      setDataSource((prevData) =>
        prevData.map((item) => (item._id === id ? response.data : item))
      );
      message.success("Issue updated successfully");
    } catch (error) {
      message.error("Error updating issue");
    }
  };

  const deleteIssue = async (props) => {
    const { _id, department } = props;
    const deptId = departments.find((dept) => dept.name === department)._id;
    try {
      await axios.delete(`http://localhost:8000/api/sales/${_id}/${deptId}`); // Assuming 'issues' endpoint for deletion
      setDataSource((prevData) => prevData.filter((item) => item._id !== _id));
      message.success("Issue deleted successfully");
    } catch (error) {
      message.error("Error deleting issue");
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
  const handleView = (record) => {
    Navigate(`/issue-detail/${record._id}`);
  };

  const handleDelete = (item) => {
    deleteIssue(item);
  };

  const handleOk = (values) => {
    if (editingItem) {
      updateIssue(editingItem._id, values);
    } else {
      addIssue(values);
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: "Department",
      dataIndex: "department",
      ...getColumnSearchProps("department"), // Search feature for department
    },
    {
      title: "Issue Date",
      dataIndex: "issueDate",
      key: "issueDate",
      sorter: (a, b) => new Date(a.issueDate) - new Date(b.issueDate),
      render: (date) => moment(date).format("YYYY-MM-DD"),
    },
    {
      title: "Total Price",
      key: "total",
      render: (text, record) => {
        const total = record.items.reduce(
          (acc, item) => acc + item.quantity * item.unitPrice,
          0
        );
        return total;
      },
    },
    {
      title: "Actions",
      render: (text, record) => (
        <Space size="left">
          <IconButton color="secondary" onClick={() => handleEdit(record)}>
            <ModeIcon />
          </IconButton>
          <IconButton color="primary" onClick={() => handleView(record)}>
            <VisibilityIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(record)} color="error">
            <DeleteSharpIcon />
          </IconButton>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h3 style={{ marginTop: 20 ,marginLeft:5}}>Issue List</h3>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Add Issue
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey={(record) => record._id}
        pagination={false}
        loading={loading}
        className="css-table"
      />
      <Dialog
        fullWidth={true}
        maxWidth={"md"}
        open={isModalOpen}
        onClose={handleCancel}
      >
        <DialogTitle>{editingItem ? "Edit Issue" : "Add Issue"}</DialogTitle>
        <DialogContent>
          <IssueForm
            editingItem={editingItem}
            initialValues={
              editingItem || {
                items: [
                  {
                    itemName: "",
                    quantity: "",
                    unit: "",
                    unitPrice: "",
                    total: 0,
                  },
                ],
                department: "",
                issueDate: "",
                total: 0,
              }
            }
            onFinish={handleOk}
            onCancel={handleCancel}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Issue;
