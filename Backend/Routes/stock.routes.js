import express from 'express';
const router = express.Router();
import { getAllStock, addOrUpdateStock, saveStock } from "../Controller/stock.controller.js";

// Get all stock items
router.get("/", getAllStock);

// Add or update a stock item
router.post("/", addOrUpdateStock);

// Bulk save stock data
router.post("/bulk", saveStock); // Added route for bulk saving stock

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


