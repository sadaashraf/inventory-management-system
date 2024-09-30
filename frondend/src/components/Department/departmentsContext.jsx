import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
const globalConstantUtil = {
  baseUrl: "http://localhost:8000/api",
};

const DepartmentsContext = createContext();

export const useDepartments = () => {
  return useContext(DepartmentsContext);
};

export const DepartmentsProvider = ({ children }) => {
  const [departments, setDepartments] = useState([]);

  const getData = async () => {
    try {
      const res = await axios.get(globalConstantUtil.baseUrl + "/department/");
      setDepartments(res.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const addDepartment = async (newDepartment) => {
    try {
      const res = await axios.post(globalConstantUtil.baseUrl + "/department/", newDepartment);
      setDepartments((prevDepartments) => [...prevDepartments, res.data]);
    } catch (error) {
      console.error("Error adding department:", error);
    }
  };

  const updateDepartment = async (id, updatedDepartment) => {
    try {
      await axios.put(`${globalConstantUtil.baseUrl}/department/${id}`, updatedDepartment);
      setDepartments((prevDepartments) =>
        prevDepartments.map((department) => (department._id === id ? updatedDepartment : department))
      );
    } catch (error) {
      console.error("Error updating department:", error);
    }
  };

  const deleteDepartment = async (id) => {
    try {
      await axios.delete(`${globalConstantUtil.baseUrl}/department/${id}`);
      setDepartments((prevDepartments) =>
        prevDepartments.filter((department) => department._id !== id)
      );
    } catch (error) {
      console.error("Error deleting department:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <DepartmentsContext.Provider value={{ departments, addDepartment, updateDepartment, deleteDepartment }}>
      {children}
    </DepartmentsContext.Provider>
  );
};
