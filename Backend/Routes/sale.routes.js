import express from "express";
import { 
  createSale, 
  getSales, 
  updateSale, 
  deleteSale 
} from "../Controller/sale.controlller.js";

const router = express.Router();

// Create a new sale
router.post("/", createSale);

// Get all sales
router.get("/", getSales);

// Update a sale
router.put("/:id", updateSale);

// Delete a sale
router.delete("/:id", deleteSale);

export default router;
