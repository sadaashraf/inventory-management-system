import express from 'express';
import { getStock, getAllStocks } from '../Controller/stock.controller.js';

const router = express.Router();

// Route to get stock by item name
router.get("/", getStock);

// Route to get all stock items
router.get("/all", getAllStocks);

export default router;
