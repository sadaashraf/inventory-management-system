import Stock from "../Models/Stock.js";

// Create a new stock item
export const createStock = async (req, res) => {
  try {
    const { itemName, category, quantity, unit } = req.body;

    const newStockItem = new Stock({ itemName, category, quantity, unit });
    const savedStockItem = await newStockItem.save();

    res.status(201).json(savedStockItem);
  } catch (error) {
    res.status(500).json({ message: "Error creating stock", error });
  }
};

// Get all stock items
export const getAllStock = async (req, res) => {
  try {
    const stockItems = await Stock.find();
    res.status(200).json(stockItems);
  } catch (error) {
    res.status(500).json({ message: "Error fetching stock", error });
  }
};

// Get a stock item by ID
export const getStockById = async (req, res) => {
  try {
    const stockItem = await Stock.findById(req.params.id);
    if (!stockItem) {
      return res.status(404).json({ message: "Stock item not found" });
    }
    res.status(200).json(stockItem);
  } catch (error) {
    res.status(500).json({ message: "Error fetching stock item", error });
  }
};

// Update a stock item by ID
export const updateStock = async (req, res) => {
  try {
    const updatedStockItem = await Stock.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updatedStockItem) {
      return res.status(404).json({ message: "Stock item not found" });
    }
    res.status(200).json(updatedStockItem);
  } catch (error) {
    res.status(500).json({ message: "Error updating stock item", error });
  }
};

// Delete a stock item by ID
export const deleteStock = async (req, res) => {
  try {
    const deletedStockItem = await Stock.findByIdAndDelete(req.params.id);
    if (!deletedStockItem) {
      return res.status(404).json({ message: "Stock item not found" });
    }
    res.status(200).json({ message: "Stock item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting stock item", error });
  }
};

export const issueItems = async (req, res) => {
  try {
    const { items } = req.body;

    for (let issuedItem of items) {
      const stockItem = await Stock.findOne({ itemName: issuedItem.itemName });
      if (!stockItem) {
        return res.status(404).json({ message: `Stock item ${issuedItem.itemName} not found` });
      }

      if (stockItem.quantity < issuedItem.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${issuedItem.itemName}` });
      }

      // Decrease the stock quantity
      stockItem.quantity -= issuedItem.quantity;
      await stockItem.save();
    }

    res.status(200).json({ message: "Items issued and stock updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error issuing items", error });
  }
};