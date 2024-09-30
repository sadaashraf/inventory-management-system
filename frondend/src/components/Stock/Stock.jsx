
// Stock.jsx
import React, { useState, useEffect } from "react";
import { notification } from "antd";
import axios from "axios";
import StockDetails from "./StockDetails";

const Stock = () => {
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
    purchaseData.forEach(purchase => {
      const existingItem = updatedStock.find(item => item.itemName === purchase.itemName);
      if (existingItem) {
        existingItem.purchaseQuantity += purchase.quantity;
        existingItem.availableQuantity += purchase.quantity;
      } else {
        updatedStock.push({
          itemName: purchase.itemName,
          purchaseQuantity: purchase.quantity,
          saleQuantity: 0,
          availableQuantity: purchase.quantity,
          unit: purchase.unit || '',
        });
      }
    });

    saleData.forEach(sale => {
      const existingItem = updatedStock.find(item => item.itemName === sale.itemName);
      if (existingItem) {
        existingItem.saleQuantity += sale.quantity;
        existingItem.availableQuantity = Math.max(0, existingItem.availableQuantity - sale.quantity);
      } else {
        updatedStock.push({
          itemName: sale.itemName,
          purchaseQuantity: 0,
          saleQuantity: sale.quantity,
          availableQuantity: Math.max(0, -sale.quantity),
          unit: sale.unit || '',
        });
      }
    });

    return updatedStock;
  };

  return (
    <div>
      <StockDetails 
        stockData={stockData} 
        loading={loading} 
        searchText={searchText} 
        setSearchText={setSearchText} 
      />
    </div>
  );
};

export default Stock;
