import Purchase from "../Models/Purchase.js";
import Sale from '../Models/Sale.js';

const calculateStock = (purchases, sales) => {
  const stock = {};

  purchases.forEach((purchase) => {
    if (!stock[purchase.itemName]) {
      stock[purchase.itemName] = {
        itemName: purchase.itemName,
        purchaseQuantity: 0,
        saleQuantity: 0,
        availableQuantity: 0,
        unit: purchase.unit,
      };
    }
    stock[purchase.itemName].purchaseQuantity += purchase.quantity;
    stock[purchase.itemName].availableQuantity += purchase.quantity;
  });

  sales.forEach((sale) => {
    if (stock[sale.itemName]) {
      stock[sale.itemName].saleQuantity += sale.quantity;
      stock[sale.itemName].availableQuantity -= sale.quantity;
    } else {
      // Handle case where sale item is not in stock
      stock[sale.itemName] = {
        itemName: sale.itemName,
        purchaseQuantity: 0,
        saleQuantity: sale.quantity,
        availableQuantity: -sale.quantity,
        unit: sale.unit,
      };
    }
  });

  return Object.values(stock).filter((item) => item.availableQuantity > 0);
};

// Controller functions
export const getStock = async (req, res) => {
  console.log("Fetching stock...");
  try {
    const purchases = await Purchase.find();
    const sales = await Sale.find();
    const stock = calculateStock(purchases, sales);
    console.log("Stock data:", stock);
    res.json(stock);
  } catch (error) {
    console.error("Error fetching stock data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPurchases = async (req, res) => {
  console.log("Fetching purchases...");
  try {
    const purchases = await Purchase.find();
    res.json(purchases);
  } catch (error) {
    console.error("Error fetching purchases data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getSales = async (req, res) => {
  console.log("Fetching sales...");
  try {
    const sales = await Sale.find();
    res.json(sales);
  } catch (error) {
    console.error("Error fetching sales data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
