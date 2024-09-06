import express from 'express';
import { getStock, getPurchases, getSales } from '../Controller/stock.controller.js';

const router = express.Router();

router.get('/stock', getStock);
router.get('/purchases', getPurchases);
router.get('/sales', getSales);

export default router;
