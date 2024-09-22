import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
const globalConstantUtil = {
  baseUrl: "http://localhost:8000/api",
};

// Create context
const SuppliersContext = createContext();

// Provide context hook
export const useSuppliers = () => {
  return useContext(SuppliersContext);
};

// Suppliers Provider component
export const SuppliersProvider = ({ children }) => {
  const [suppliers, setSuppliers] = useState([]);

  // Function to fetch Suppliers
  const getData = async () => {
    try {
      const res = await axios.get(globalConstantUtil.baseUrl + "/suppliers/");
      setSuppliers(res.data);
    } catch (error) {
      console.error("Error fetching Suppliers:", error);
    }
  };

  // Function to add Supplier
  const addSupplier = async (newSupplier) => {
    try {
      const res = await axios.post(
        globalConstantUtil.baseUrl + "/suppliers/",
        newSupplier
      );
      setSuppliers((prevSuppliers) => [...prevSuppliers, res.data]);
    } catch (error) {
      console.error("Error adding Supplier:", error);
    }
  };

  // Function to update Supplier
  const updateSupplier = async (id, updatedSupplier) => {
    try {
      await axios.put(
        `${globalConstantUtil.baseUrl}/suppliers/${id}`,
        updatedSupplier
      );
      setSuppliers((prevSuppliers) =>
        prevSuppliers.map((Supplier) =>
          Supplier._id === id ? updatedSupplier : Supplier
        )
      );
    } catch (error) {
      console.error("Error updating Supplier:", error);
    }
  };

  // Function to delete Supplier
  const deleteSupplier = async (id) => {
    try {
      await axios.delete(`${globalConstantUtil.baseUrl}/suppliers/${id}`);
      setSuppliers((prevSuppliers) =>
        prevSuppliers.filter((Supplier) => Supplier._id !== id)
      );
    } catch (error) {
      console.error("Error deleting Supplier:", error);
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    getData();
  }, []);

  return (
    <SuppliersContext.Provider
      value={{ suppliers, addSupplier, updateSupplier, deleteSupplier }}
    >
      {children}
    </SuppliersContext.Provider>
  );
};
