import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { message } from "antd";

// Create the Stock context
const StockContext = createContext();

// Create a custom hook to use Stock context
const useStocks = () => {
  const context = useContext(StockContext);
  if (!context) {
    throw new Error("useStocks must be used within a StockProvider");
  }
  return context;
};

const StockProvider = ({ children }) => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all stock items from the server
  const fetchAllStocks = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/api/stock");
      setStockData(response.data);
    } catch (error) {
      message.error("Error fetching stock data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch stock data when the component mounts
  useEffect(() => {
    fetchAllStocks();
  }, []);

  // Add new stock item
  const addStock = async (newStock) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/stock",
        newStock
      );
      setStockData((prevData) => [...prevData, response.data]);
      message.success("Stock added successfully");
    } catch (error) {
      message.error("Error adding stock");
    }
  };

  // Update stock item
  const updateStock = async (id, updatedStock) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/stock/${id}`,
        updatedStock
      );
      setStockData((prevData) =>
        prevData.map((stock) => (stock._id === id ? response.data : stock))
      );
      message.success("Stock updated successfully");
    } catch (error) {
      message.error("Error updating stock");
    }
  };

  // Delete stock item
  const deleteStock = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/stock/${id}`);
      setStockData((prevData) => prevData.filter((stock) => stock._id !== id));
      message.success("Stock deleted successfully");
    } catch (error) {
      message.error("Error deleting stock");
    }
  };

  // Update stock quantity (specific function for purchase and issue)
  const updateStockQuantity = async (id, actionType, quantity) => {
    try {
      const stockItem = stockData.find((item) => item._id === id);

      if (!stockItem) {
        message.error("Stock item not found");
        return;
      }

      // Increase quantity for purchase, decrease for issue
      const updatedQuantity =
        actionType === "purchase"
          ? stockItem.quantity + quantity
          : stockItem.quantity - quantity;

      // Ensure quantity doesn't go below zero during issue
      if (updatedQuantity < 0) {
        message.error("Cannot issue more than available stock");
        return;
      }

      const updatedStock = {
        ...stockItem,
        quantity: updatedQuantity,
      };

      await updateStock(id, updatedStock);
    } catch (error) {
      message.error("Error updating stock quantity");
    }
  };

  return (
    <StockContext.Provider
      value={{
        stockData,
        loading,
        fetchAllStocks,
        addStock,
        updateStock,
        deleteStock,
        updateStockQuantity, // This function will be used in purchase and issue components
      }}
    >
      {children}
    </StockContext.Provider>
  );
};

export { useStocks, StockProvider };
