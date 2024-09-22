import express from "express";

import {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplierById,
  deleteSupplierById,
} from "../Controller/Supplier.js";

const router = express.Router();

// Route to create a new supplier
router.post("/", createSupplier);

// Route to get all suppliers
router.get("/", getAllSuppliers);

// Route to get a single supplier by ID
router.get("/:id", getSupplierById);

// Route to update a supplier by ID
router.put("/:id", updateSupplierById);

// Route to delete a supplier by ID
router.delete("/:id", deleteSupplierById);

export default router;
