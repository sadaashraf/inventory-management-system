import React, { useState, useEffect } from "react";
import { Table, Button, Space, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import DeleteSharpIcon from "@mui/icons-material/DeleteSharp";
import ModeIcon from "@mui/icons-material/Mode";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";
import moment from "moment";
import BillingForm from "./BillingForm";
import { useSuppliers } from "../../context/supplierContext";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../invatory.css";
const Purchase = () => {
  const [dataSource, setDataSource] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);

  const Navigate = useNavigate();

  const { suppliers } = useSuppliers();

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/api/purchases");
      setDataSource(response.data);
    } catch (error) {
      message.error("Error fetching purchases");
    } finally {
      setLoading(false);
    }
  };

  const addPurchase = async (purchaseData) => {
    const supplierId = suppliers.find(
      (item) => item.shopName === purchaseData.supplier
    )._id;
    try {
      const response = await axios.post(
        `http://localhost:8000/api/purchases/${supplierId}`,
        purchaseData
      );
      setDataSource((prevData) => [...prevData, response.data]);
      message.success("Purchase added successfully");
    } catch (error) {
      message.error("Error adding purchase");
    }
  };

  const updatePurchase = async (id, purchaseData) => {
    const supplierId = suppliers.find(
      (item) => item.shopName === purchaseData.supplier
    )._id;
    try {
      const response = await axios.put(
        `http://localhost:8000/api/purchases/${supplierId}/${id}`,
        purchaseData
      );
      setDataSource((prevData) =>
        prevData.map((item) => (item._id === id ? response.data : item))
      );
      message.success("Purchase updated successfully");
    } catch (error) {
      message.error("Error updating purchase");
    }
  };

  const deletePurchase = async (purchaseData) => {
    const supplierId = suppliers.find(
      (item) => item.shopName === purchaseData.supplier
    )._id;
    
    try {
      await axios.delete(
        `http://localhost:8000/api/purchases/${supplierId}/${purchaseData._id}`
      );
      setDataSource((prevData) =>
        prevData.filter((item) => item._id !== purchaseData._id)
      );
      message.success("Purchase deleted successfully");
    } catch (error) {
      message.error("Error deleting purchase");
    }
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
    Navigate(`/purchase-detail/${record._id}`);
    console.log("record", record);
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
      title: "Purchase Date",
      dataIndex: "purchaseDate",
      key: "purchaseDate",
      sorter: (a, b) => new Date(a.purchaseDate) - new Date(b.purchaseDate),
      render: (date) => moment(date).format("YYYY-MM-DD"),
    },
    {
      title: "Supplier",
      dataIndex: "supplier",
      key: "supplier",
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
      title: "Paid",
      dataIndex: "paid",
      key: "paid",
      render: (text, record) => record.paid || 0, // Display the paid amount or 0 if not available
    },
    {
      title: "Balance",
      key: "balance",
      render: (text, record) => {
        const total = record.items.reduce(
          (acc, item) => acc + item.quantity * item.unitPrice,
          0
        );
        const prevBalance = record.supplierBalance || 0; // Assuming supplier balance is stored in the record
        const paid = record.paid || 0;
        const balance = total + prevBalance - paid;
        return balance;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="primary"
            style={{
              backgroundColor: "#FFB300",
              color: "#fff",
              borderColor: "#FFB300",
            }}

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
            
            onClick={() => handleDelete(record)}
          >
            Delete
          </Button>
          <Button
            type="primary"
            style={{
              backgroundColor: "#00ACC1", 
              color: "#fff", 
              borderColor: "#00ACC1",
            }}
            onClick={() => handleView(record)}
            >
            Details
          </Button>
  
        </Space>
      ),
    },
  ];
  

  return (
    <div>
      <h3 style={{ marginTop: 20, marginLeft: 5 }}>Purchase List</h3>
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
        loading={loading}
        className="css-table"
      />
      <Dialog
        fullWidth={true}
        maxWidth={"md"}
        open={isModalOpen}
        onClose={handleCancel}
      >
        <DialogTitle>
          {editingItem ? "Edit Purchase" : "Add Purchase"}
        </DialogTitle>
        <DialogContent>
          <BillingForm
            editingItem={editingItem}
            initialValues={
              editingItem || {
                items: [
                  {
                    purchaseDate: "",
                    itemName: "",
                    category: "",
                    quantity: "",
                    unit: "",
                    unitPrice: "",
                    total: 0,
                  },
                ],
                supplier: "",
                purchaseDate: Date.now(),
                total: 0,
                balance: 0,
                paymentMethod: "",
                chequeNo: 0,
                paid: 0,
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

export default Purchase;
