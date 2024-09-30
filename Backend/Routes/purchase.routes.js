import express from "express";
import {
  createPurchase,
  getPurchases,
  updatePurchase,
  deletePurchase,
  getPurchase,
} from "../Controller/purchase.controller.js";

const router = express.Router();

// Create a new purchase
router.post("/:supplierId", createPurchase);

// Get all purchases
router.get("/", getPurchases);
router.get("/:id", getPurchase);

// Update a purchase
router.put("/:id", updatePurchase);

// Delete a purchase
router.delete("/:id/:supplierId", deletePurchase);

export default router;
