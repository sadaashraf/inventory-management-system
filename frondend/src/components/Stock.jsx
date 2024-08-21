import React, { useState, useEffect } from "react";
import { Table, Input, Button, Space } from "antd";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";

const Stock = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [stockData, setStockData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const purchasesResponse = await axios.get("http://localhost:8000/api/purchases");
        const salesResponse = await axios.get("http://localhost:8000/api/sales");

        setStockData(calculateStock(purchasesResponse.data, salesResponse.data));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const calculateStock = (purchaseData, saleData) => {
    const updatedStock = purchaseData.reduce((acc, purchase) => {
      const existingItem = acc.find(item => item.itemName === purchase.itemName);
      if (existingItem) {
        existingItem.purchaseQuantity += purchase.quantity;
        existingItem.availableQuantity += purchase.quantity;
      } else {
        acc.push({
          itemName: purchase.itemName,
          purchaseQuantity: purchase.quantity,
          saleQuantity: 0,
          availableQuantity: purchase.quantity,
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
        });
      }
    });

    return updatedStock;
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
    },
    {
      title: "Sale Quantity",
      dataIndex: "saleQuantity",
      key: "saleQuantity",
      sorter: (a, b) => a.saleQuantity - b.saleQuantity,
    },
    {
      title: "Available Quantity",
      dataIndex: "availableQuantity",
      key: "availableQuantity",
      sorter: (a, b) => a.availableQuantity - b.availableQuantity,
    },
  ];

  return (
    <div>
      <Table columns={columns} dataSource={stockData} pagination={false} />
    </div>
  );
};

export default Stock;
