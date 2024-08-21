import express from "express";
import { 
  createPurchase, 
  getPurchases, 
  updatePurchase, 
  deletePurchase 
} from "../Controller/purchase.controller.js";

const router = express.Router();

// Create a new purchase
router.post("/", createPurchase);

// Get all purchases
router.get("/", getPurchases);

// Update a purchase
router.put("/:id", updatePurchase);

// Delete a purchase
router.delete("/:id", deletePurchase);

export default router;
