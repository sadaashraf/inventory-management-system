import express from "express";
import { 
  createSale, 
  getSales, 
  updateSale, 
  deleteSale, 
  getSale
} from "../Controller/sale.controlller.js";

const router = express.Router();

// Create a new sale
router.post("/:deptId", createSale);

// Get all sales
router.get("/", getSales);

// Get sale
router.get("/:id", getSale);

// Update a sale
router.put("/:id", updateSale);

// Delete a sale
router.delete("/:id/:deptId", deleteSale);

export default router;
