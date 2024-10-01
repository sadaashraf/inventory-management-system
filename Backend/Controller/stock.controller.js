import Stock from '../Models/Stock.js';

// Create a new stock item
export const createStock = async (req, res) => {
  try {
    const newStock = new Stock(req.body);
    const savedStock = await newStock.save();
    return res.status(201).json(savedStock);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating stock', error });
  }
};

// Get all stock items
export const getAllStock = async (req, res) => {
  try {
    const stockItems = await Stock.find();
    return res.status(200).json(stockItems);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving stock data', error });
  }
};

// Get a stock item by ID
export const getStockById = async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }
    return res.status(200).json(stock);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving stock item', error });
  }
};

// Update a stock item
export const updateStock = async (req, res) => {
  try {
    const updatedStock = await Stock.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedStock) {
      return res.status(404).json({ message: 'Stock not found' });
    }
    return res.status(200).json(updatedStock);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating stock item', error });
  }
};

// Delete a stock item
export const deleteStock = async (req, res) => {
  try {
    const deletedStock = await Stock.findByIdAndDelete(req.params.id);
    if (!deletedStock) {
      return res.status(404).json({ message: 'Stock not found' });
    }
    return res.status(200).json({ message: 'Stock deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting stock item', error });
  }
};

