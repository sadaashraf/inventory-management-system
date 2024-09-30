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
router.post("/", createSale);

// Get all sales
router.get("/", getSales);

router.get("/:id", getSale);

// Update a sale
router.put("/:id", updateSale);

// Delete a sale
router.delete("/:id", deleteSale);

export default router;
