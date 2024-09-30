import Stock from "../Models/Stock.js";

// Fetch all stock items
export const getAllStocks = async (req, res) => {
  try {
    const stocks = await Stock.find({}, { itemName: 1, availableQuantity: 1 }); // Fetch only necessary fields
    res.status(200).json(stocks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stock items', error: error.message });
  }
};

// Fetch stock for a specific item
export const getStock = async (req, res) => {
  const { itemName } = req.query;

  if (!itemName) {
    return res.status(400).json({ message: 'Item name is required' });
  }

  try {
    const stock = await Stock.findOne({ itemName });
    if (!stock) {
      return res.status(404).json({ message: `Stock not found for item: ${itemName}` });
    }
    res.status(200).json(stock);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stock item', error: error.message });
  }
};

// Controller to handle restocking items
export const restockItem = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  if (!id) {
    return res.status(400).json({ message: 'Item ID is required' });
  }
  
  if (!quantity || quantity <= 0) {
    return res.status(400).json({ message: 'Quantity must be greater than zero' });
  }

  try {
    const stockItem = await Stock.findById(id);
    if (!stockItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    stockItem.availableQuantity += quantity; // Restock by the specified quantity
    await stockItem.save();

    res.status(200).json({ message: 'Item restocked successfully', stockItem });
  } catch (error) {
    res.status(500).json({ message: 'Error restocking item', error: error.message });
  }
};
