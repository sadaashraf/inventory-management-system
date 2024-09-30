import express from "express";

import {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartmentById,
  deleteDepartmentById,
} from "../Controller/department.controller.js";

const router = express.Router();

// Route to create a new department
router.post("/", createDepartment);

// Route to get all departments
router.get("/", getAllDepartments);

// Route to get a single department by ID
router.get("/:id", getDepartmentById);

// Route to update a department by ID
router.put("/:id", updateDepartmentById);

// Route to delete a department by ID
router.delete("/:id", deleteDepartmentById);

export default router;
