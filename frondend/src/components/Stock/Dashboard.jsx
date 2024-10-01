import React, { useState, useEffect } from "react";
import { notification } from "antd";
import axios from "axios";
import DashboardDetail from "./DashboardDetail";

const Dashboard = () => {
  const [searchText, setSearchText] = useState("");
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const purchasesResponse = await axios.get("http://localhost:8000/api/purchases");
        const salesResponse = await axios.get("http://localhost:8000/api/sales");
        setStockData(calculateStock(purchasesResponse.data, salesResponse.data));
      } catch (error) {
        notification.error({
          message: "Error Loading Data",
          description: "An error occurred while fetching stock data.",
        });
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateStock = (purchaseData, saleData) => {
    const updatedStock = [];

    // Process purchase data
    purchaseData.forEach(purchase => {
      purchase.items.forEach(item => {
        const existingItem = updatedStock.find(stockItem => stockItem.itemName === item.itemName);
        if (existingItem) {
          existingItem.purchaseQuantity += item.quantity;
          existingItem.availableQuantity += item.quantity;
        } else {
          updatedStock.push({
            itemName: item.itemName,
            purchaseQuantity: item.quantity,
            saleQuantity: 0,
            availableQuantity: item.quantity,
            unit: item.unit || '',
          });
        }
      });
    });

    // Process sale data
    saleData.forEach(sale => {
      sale.items.forEach(item => {
        const existingItem = updatedStock.find(stockItem => stockItem.itemName === item.itemName);
        if (existingItem) {
          existingItem.saleQuantity += item.quantity;
          existingItem.availableQuantity = Math.max(0, existingItem.availableQuantity - item.quantity);
        } else {
          updatedStock.push({
            itemName: item.itemName,
            purchaseQuantity: 0,
            saleQuantity: item.quantity,
            availableQuantity: Math.max(0, -item.quantity),
            unit: item.unit || '',
          });
        }
      });
    });

    return updatedStock;
  };

  return (
    <div>
      <DashboardDetail stockData={stockData} loading={loading} />
    </div>
  );
};

export default Dashboard;
