import React, { useState, useEffect, useCallback } from "react";
import { Table, Input, Button, Space, Modal, notification, Select } from "antd";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";

const { Option } = Select;

const Stock = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [stockData, setStockData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false); // Loader state

  // Fetch stock data from API with error handling
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loader when fetching data
      try {
        const purchasesResponse = await axios.get("http://localhost:8000/api/purchases");
        const salesResponse = await axios.get("http://localhost:8000/api/sales");

        setStockData(calculateStock(purchasesResponse.data, salesResponse.data));

      } catch (error) {
        notification.error({
          message: "Error Loading Data",
          description: "An error occurred while fetching stock data."
        });
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Stop loader once the data is fetched
      }
    };

    fetchData();
  }, []);

  // Calculate stock based on purchase and sales data
  const calculateStock = (purchaseData, saleData) => {
    const updatedStock = purchaseData.reduce((acc, purchase) => {
      const existingItem = acc.find(item => item.itemName === purchase.itemName);
      if (existingItem) {
        existingItem.purchaseQuantity += purchase.quantity;
        existingItem.availableQuantity += purchase.quantity;
        existingItem.unit = purchase.unit; // Ensure unit of measure is consistent
      } else {
        acc.push({
          itemName: purchase.itemName,
          purchaseQuantity: purchase.quantity,
          saleQuantity: 0,
          availableQuantity: purchase.quantity,
          unit: purchase.unit,
        });
      }
      return acc;
    }, []);

    saleData.forEach(sale => {
      const existingItem = updatedStock.find(item => item.itemName === sale.itemName);
      if (existingItem) {
        existingItem.saleQuantity += sale.quantity;
        existingItem.availableQuantity -= sale.quantity;
      } else {
        updatedStock.push({
          itemName: sale.itemName,
          purchaseQuantity: 0,
          saleQuantity: sale.quantity,
          availableQuantity: -sale.quantity,
          unit: sale.unit,
        });
      }
    });

    return updatedStock;
  };

  // Handle item selection in the modal
  const handleItemSelect = (value) => {
    const selectedItem = stockData.find(item => item.itemName === value);
    setSelectedItem(selectedItem);
  };

  // Search functionalities
  const getColumnSearchProps = useCallback((dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
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
  }), [searchedColumn, searchText]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedItem(null); // Reset selected item when closing the modal
  };

  const columns = [
    {
      title: "Item Name",
      dataIndex: "itemName",
      key: "itemName",
      ...getColumnSearchProps("itemName"),
    },
    {
      title: "Purchase Quantity",
      dataIndex: "purchaseQuantity",
      key: "purchaseQuantity",
      sorter: (a, b) => a.purchaseQuantity - b.purchaseQuantity,
      render: (text, record) => (
        <span>{text} {record.unit}</span>
      ),
    },
    {
      title: "Sale Quantity",
      dataIndex: "saleQuantity",
      key: "saleQuantity",
      sorter: (a, b) => a.saleQuantity - b.saleQuantity,
      render: (text, record) => (
        <span>{text} {record.unit}</span>
      ),
    },
    {
      title: "Available Quantity",
      dataIndex: "availableQuantity",
      key: "availableQuantity",
      sorter: (a, b) => a.availableQuantity - b.availableQuantity,
      render: (text, record) => (
        <span>{text} {record.unit}</span>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={showModal} style={{ marginBottom: 16 }}>
        Search Item
      </Button>
      <Table
        columns={columns}
        dataSource={stockData}
        rowKey="itemName"
        pagination={{ pageSize: 10 }} // Enable pagination with page size of 10
        loading={loading} // Add loader when data is fetching
      />

      <Modal
        title="Search Stock Item"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <div>
          <Select
            showSearch
            placeholder="Select an item"
            onSelect={handleItemSelect}
            style={{ width: '100%', marginBottom: 16 }}
          >
            {stockData.map(item => (
              <Option key={item.itemName} value={item.itemName}>
                {item.itemName}
              </Option>
            ))}
          </Select>

          {selectedItem && (
            <div>
              <p><strong>Sale Quantity:</strong> {selectedItem.saleQuantity} {selectedItem.unit}</p>
              <p><strong>Available Quantity:</strong> {selectedItem.availableQuantity} {selectedItem.unit}</p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Stock;
