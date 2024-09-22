import Purchase from "../Models/Purchase.js";
import Sale from "../Models/Sale.js";
import Stock from "../Models/Stock.js";

// Controller to handle purchase creation
export const createPurchase = async (req, res, next) => {
  const { itemName, quantity } = req.body;

  // Validate input
  if (!itemName || !quantity || quantity <= 0) {
    return res.status(400).json({ message: "Invalid item name or quantity" });
  }

  const newPurchase = new Purchase(req.body);

  try {
    const savedPurchase = await newPurchase.save();

    // Update stock for the purchased item
    let stockItem = await Stock.findOne({ itemName });
    if (stockItem) {
      stockItem.availableQuantity += quantity;
      await stockItem.save();
    } else {
      stockItem = new Stock({ itemName, availableQuantity: quantity });
      await stockItem.save();
    }

    res.status(201).json(savedPurchase);
  } catch (error) {
    next(error);
  }
};

// Controller to handle sale creation
export const createSale = async (req, res, next) => {
  const { itemName, quantity } = req.body;

  // Validate input
  if (!itemName || !quantity || quantity <= 0) {
    return res.status(400).json({ message: "Invalid item name or quantity" });
  }

  try {
    // Check stock before saving the sale
    const stockItem = await Stock.findOne({ itemName });
    if (!stockItem || stockItem.availableQuantity < quantity) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    // Create and save the sale
    const newSale = new Sale(req.body);
    const savedSale = await newSale.save();

    // Update stock after the sale
    stockItem.availableQuantity -= quantity;
    await stockItem.save();

    res.status(201).json(savedSale);
  } catch (error) {
    next(error);
  }
};

// Controller to fetch available stock for a specific item
export const getStock = async (req, res) => {
  const { itemName } = req.query;
  
  try {
    const stock = await Stock.findOne({ itemName });
    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }
    res.status(200).json(stock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to fetch all stock items
export const getAllStocks = async (req, res, next) => {
  try {
    const stocks = await Stock.find();
    res.status(200).json(stocks);
  } catch (error) {
    next(error);
  }
};

// Controller to fetch purchase list
export const getPurchases = async (req, res, next) => {
  try {
    const purchases = await Purchase.find();
    res.status(200).json(purchases);
  } catch (error) {
    next(error);
  }
};

// Controller to fetch sale list
export const getSales = async (req, res, next) => {
  try {
    const sales = await Sale.find();
    res.status(200).json(sales);
  } catch (error) {
    next(error);
  }
};

// In your stock.controller.js
export const getAllStock = async (req, res) => {
  try {
    const stockItems = await Stock.find();
    res.json(stockItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
