import Stock from '../Models/Stock.js';

// Get all stock items
export const getAllStock = async (req, res) => {
  try {
    const stock = await Stock.find();
    res.status(200).json(stock);
  } catch (error) {
    res.status(500).json({ error: "Error fetching stock data" });
  }
};

// Add or update stock items (Single or Bulk)
export const addOrUpdateStock = async (req, res) => {
  const stockData = req.body; // Accepting array of stock items

  try {
    console.log("Request body:", stockData);  // Log the request body for debugging

    // Validate if stockData is an array
    if (!Array.isArray(stockData)) {
      return res.status(400).json({ error: "Invalid stock data format" });
    }

    // Loop through each stock item in the provided array
    for (const item of stockData) {
      const { itemName, purchaseQuantity, saleQuantity, unit } = item;

      let stockItem = await Stock.findOne({ itemName });

      if (stockItem) {
        // Update existing stock item
        stockItem.purchaseQuantity += purchaseQuantity;
        stockItem.saleQuantity += saleQuantity;
        stockItem.availableQuantity = stockItem.purchaseQuantity - stockItem.saleQuantity;
      } else {
        // Create new stock item
        stockItem = new Stock({
          itemName,
          purchaseQuantity,
          saleQuantity,
          availableQuantity: purchaseQuantity - saleQuantity,
          unit,
        });
      }

      await stockItem.save(); // Save the stock item
    }

    res.status(200).json({ message: "Stock data saved successfully!" });
  } catch (error) {
    console.error("Error while updating stock data:", error);  // Log the error details
    res.status(500).json({ error: "Error updating stock data" });
  }
};

// Bulk save stock data
export const saveStock = async (req, res) => {
  try {
    const stockData = req.body;

    if (!Array.isArray(stockData) || stockData.length === 0) {
      return res.status(400).json({ error: "Invalid stock data" });
    }

    // Loop through stock data and add or update each stock item
    for (const item of stockData) {
      let stockItem = await Stock.findOne({ itemName: item.itemName });
      if (stockItem) {
        stockItem.purchaseQuantity = item.purchaseQuantity;
        stockItem.saleQuantity = item.saleQuantity;
        stockItem.availableQuantity = item.availableQuantity;
        stockItem.unit = item.unit;
        await stockItem.save();
      } else {
        const newItem = new Stock(item);
        await newItem.save();
      }
    }

    res.status(200).json({ message: "Stock data saved successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error while saving stock data" });
  }
};

// Get a stock item by ID
export const getStockById = async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }
    res.status(200).json(stock);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving stock item" });
  }
};

// Update a stock item
export const updateStock = async (req, res) => {
  try {
    const updatedStock = await Stock.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedStock) {
      return res.status(404).json({ message: 'Stock not found' });
    }
    res.status(200).json(updatedStock);
  } catch (error) {
    res.status(500).json({ error: "Error updating stock item" });
  }
};

// Delete a stock item
export const deleteStock = async (req, res) => {
  try {
    const deletedStock = await Stock.findByIdAndDelete(req.params.id);
    if (!deletedStock) {
      return res.status(404).json({ message: 'Stock not found' });
    }
    res.status(200).json({ message: 'Stock deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: "Error deleting stock item" });
  }
};


// import Stock from '../Models/Stock.js';

// // Create a new stock item
// export const createStock = async (req, res) => {
//   try {
//     const newStock = new Stock(req.body);
//     const savedStock = await newStock.save();
//     return res.status(201).json(savedStock);
//   } catch (error) {
//     return res.status(500).json({ message: 'Error creating stock', error });
//   }
// };

// // Get all stock items
// export const getAllStock = async (req, res) => {
//   try {
//     const stockItems = await Stock.find();
//     return res.status(200).json(stockItems);
//   } catch (error) {
//     return res.status(500).json({ message: 'Error retrieving stock data', error });
//   }
// };

// // Get a stock item by ID
// export const getStockById = async (req, res) => {
//   try {
//     const stock = await Stock.findById(req.params.id);
//     if (!stock) {
//       return res.status(404).json({ message: 'Stock not found' });
//     }
//     return res.status(200).json(stock);
//   } catch (error) {
//     return res.status(500).json({ message: 'Error retrieving stock item', error });
//   }
// };

// // Update a stock item
// export const updateStock = async (req, res) => {
//   try {
//     const updatedStock = await Stock.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!updatedStock) {
//       return res.status(404).json({ message: 'Stock not found' });
//     }
//     return res.status(200).json(updatedStock);
//   } catch (error) {
//     return res.status(500).json({ message: 'Error updating stock item', error });
//   }
// };

// // Delete a stock item
// export const deleteStock = async (req, res) => {
//   try {
//     const deletedStock = await Stock.findByIdAndDelete(req.params.id);
//     if (!deletedStock) {
//       return res.status(404).json({ message: 'Stock not found' });
//     }
//     return res.status(200).json({ message: 'Stock deleted successfully' });
//   } catch (error) {
//     return res.status(500).json({ message: 'Error deleting stock item', error });
//   }
// };

// controllers/stockController.js