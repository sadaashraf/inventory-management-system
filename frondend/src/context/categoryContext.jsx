import React, { createContext, useState, useEffect, useContext } from "react";
import { notification } from "antd";
import axios from "axios";

// Create context
const CategoryContext = createContext();

//use context
export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useStocks must be used within a StockProvider");
  }
  return context;
};

// Category provider component
export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch categories from backend
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/api/categories");
      setCategories(response.data);
    } catch (error) {
      notification.error({
        message: "Error",
        description: "An error occurred while fetching categories.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Add new category
  const addCategory = async (categoryData) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/categories",
        categoryData
      );
      setCategories([...categories, response.data]);
      notification.success({
        message: "Success",
        description: "Category added successfully!",
      });
    } catch (error) {
      notification.error({
        message: "Error",
        description: "An error occurred while adding the category.",
      });
    }
  };

  // Update existing category
  const updateCategory = async (id, updatedData) => {
    try {
      await axios.put(
        `http://localhost:8000/api/categories/${id}`,
        updatedData
      );
      setCategories(
        categories.map((category) =>
          category._id === id ? { ...category, ...updatedData } : category
        )
      );
      notification.success({
        message: "Success",
        description: "Category updated successfully!",
      });
    } catch (error) {
      notification.error({
        message: "Error",
        description: "An error occurred while updating the category.",
      });
    }
  };

  // Delete category
  const deleteCategory = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/categories/${id}`);
      setCategories(categories.filter((category) => category._id !== id));
      notification.success({
        message: "Success",
        description: "Category deleted successfully!",
      });
    } catch (error) {
      notification.error({
        message: "Error",
        description: "An error occurred while deleting the category.",
      });
    }
  };

  // Provide the state and functions to children components
  return (
    <CategoryContext.Provider
      value={{
        categories,
        loading,
        addCategory,
        updateCategory,
        deleteCategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};
