import express from 'express';
import { getAllStocks, getStock, restockItem } from '../Controller/stock.controller.js';

const router = express.Router();

router.get('/', getAllStocks); // Fetch all stocks
router.get('/', getStock); // Fetch specific stock based on itemName
router.post('/:id/restock', restockItem); // Restock item

export default router;
