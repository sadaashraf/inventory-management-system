import React, { useState, useEffect } from "react";
import { Table, Button, Space, message } from "antd";
import {
  PlusOutlined,
} from "@ant-design/icons";
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';
import ModeIcon from '@mui/icons-material/Mode';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from "axios";
import moment from "moment";
import BillingForm from "./BillingForm";
import { useSuppliers } from "../../context/supplierContext";
import {
  Dialog, DialogContent,  DialogTitle,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Purchase = () => {
  const [dataSource, setDataSource] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const Navigate = useNavigate()

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
    try {
      const response = await axios.put(
        `http://localhost:8000/api/purchases/${id}`,
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
    console.log('pu', purchaseData)
    const supplierId = suppliers.find(
      (item) => item.shopName === purchaseData.supplier
    )._id;
    console.log('supplierId', supplierId)
    try {
      await axios.delete(
        `http://localhost:8000/api/purchases/${purchaseData._id}/${supplierId}`
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
    Navigate(`/purchase-detail/${record._id}`)
    console.log('record', record)
  };
  
  const handleDelete = (id) => {
    deletePurchase(id);
  }
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
            icon={<VisibilityIcon />}
            onClick={() => handleView(record)}
          />
          <Button
            type="link"
            icon={<DeleteSharpIcon />}
            danger
            onClick={() => handleDelete(record)}
          />
        </Space>
      ),
    },
  ];

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
        loading={loading}
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
                    purchaseDate:"",
                    itemName: "",
                    quantity: "",
                    unit: "",
                    unitPrice: "",
                    total: 0,
                  },
                ],
                supplier: "",
                purchaseDate: "",
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

export default Purchase;
