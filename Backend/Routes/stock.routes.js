import express from "express";
import {
  createStock,
  getAllStock,
  getStockById,
  updateStock,
  deleteStock,
} from "../Controller/stock.controller.js";

const router = express.Router();

// POST request to create a stock item
router.post("/", createStock);

// GET request to fetch all stock items
router.get("/", getAllStock);

// GET request to fetch a stock item by ID
router.get("/:id", getStockById);

// PUT request to update a stock item by ID
router.put("/:id", updateStock);

// DELETE request to delete a stock item by ID
router.delete("/:id", deleteStock);

export default router;


// import express from 'express';
// import {
//   createStock,
//   getAllStock,
//   getStockById,
//   updateStock,
//   deleteStock,
// } from '../Controller/stock.controller.js';

// const router = express.Router();

// // Route to create a new stock item
// router.post('/', createStock);

// // Route to get all stock items
// router.get('/', getAllStock);

// // Route to get a specific stock item by ID
// router.get('/:id', getStockById);

// // Route to update a stock item by ID
// router.put('/:id', updateStock);

// // Route to delete a stock item by ID
// router.delete('/:id', deleteStock);

// export default router;

// routes/stock.js


