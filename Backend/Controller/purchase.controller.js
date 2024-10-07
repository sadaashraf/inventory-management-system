import Purchase from "../Models/Purchase.js";
import Supplier from "../Models/Supplier.js";
import Stock from "../Models/Stock.js";

export const createPurchase = async (req, res) => {
  const { supplierId } = req.params; // Supplier ID from URL
  const { items, paid, total, balance } = req.body;

  try {
    // 1. Create and save the new purchase
    const newPurchase = new Purchase(req.body);
    const savedPurchase = await newPurchase.save();

    // 2. Update the supplier: Add items to the supplier's orders and update the balance
    const updatedSupplier = await Supplier.findById(supplierId);
    if (!updatedSupplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    // Push items to the supplier's order list
    updatedSupplier.order.push(...items);

    // Update supplier's balance
    // const newBalance = updatedSupplier.balance + balance; // Update balance based on payment/balance
    updatedSupplier.balance = balance;

    // Save the updated supplier
    await updatedSupplier.save();

    // 3. Update the stock with items (either add new items or update existing quantities)
    for (let item of items) {
      const { itemName, category, quantity, unit } = item;

      // Check if the item exists in stock
      const stockItem = await Stock.findOne({ itemName });

      if (stockItem) {
        // If item exists, update the quantity
        stockItem.quantity += quantity;
        await stockItem.save();
      } else {
        // If item does not exist, create a new stock entry
        const newStockItem = new Stock({
          itemName,
          category,
          quantity,
          unit,
        });
        await newStockItem.save();
      }
    }

    // Send back the response with the saved purchase
    res.status(201).json(savedPurchase);
  } catch (err) {
    console.error("Error creating purchase:", err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
};

export const getPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find();
    res.status(200).json(purchases);
  } catch (err) {
    res.status(500).json(err);
  }
};
export const getPurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id);
    res.status(200).json(purchase);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const updatePurchase = async (req, res) => {
  try {
    // Step 1: Fetch the existing purchase
    const existingPurchase = await Purchase.findById(req.params.id);
    if (!existingPurchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    // Step 2: Update the purchase with new data
    const updatedPurchase = await Purchase.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    // Step 3: Reflect changes in supplier if items or balance are modified
    const { items: newItems, balance: newBalance } = req.body;
    const supplierId = req.params.supplierId;

    const supplier = await Supplier.findById(supplierId);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    // Update supplier orders by replacing old items with new ones
    supplier.order = supplier.order.filter(
      (order) =>
        !existingPurchase.items.some(
          (oldItem) => oldItem.itemName === order.itemName
        )
    );
    supplier.order.push(...newItems);

    // Update supplier balance if modified
    if (newBalance !== existingPurchase.balance) {
      supplier.balance += newBalance - existingPurchase.balance;
    }

    await supplier.save();

    // Step 4: Reflect changes in the stock
    for (let i = 0; i < newItems.length; i++) {
      const newItem = newItems[i];
      const oldItem = existingPurchase.items.find(
        (item) => item.itemName === newItem.itemName
      );

      let stockItem = await Stock.findOne({ itemName: oldItem?.itemName });

      if (oldItem && stockItem) {
        // If the item name has changed, remove the old stock and create a new one
        if (oldItem.itemName !== newItem.itemName) {
          await stockItem.remove();

          const newStockItem = new Stock({
            itemName: newItem.itemName,
            category: newItem.category,
            quantity: newItem.quantity,
            unit: newItem.unit,
          });
          await newStockItem.save();
        } else {
          // Update existing stock item with new quantity
          stockItem.quantity += newItem.quantity - oldItem.quantity;
          stockItem.category = newItem.category;
          stockItem.unit = newItem.unit;
          await stockItem.save();
        }
      } else {
        // If it's a new item, create a new stock entry
        const newStockItem = new Stock({
          itemName: newItem.itemName,
          category: newItem.category,
          quantity: newItem.quantity,
          unit: newItem.unit,
        });
        await newStockItem.save();
      }
    }

    // Step 5: Send updated purchase back as response
    res.status(200).json(updatedPurchase);
  } catch (err) {
    console.error("Error updating purchase:", err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
};

export const deletePurchase = async (req, res) => {
  try {
    // Step 1: Fetch the purchase to be deleted
    const purchase = await Purchase.findById(req.params.id);
    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    // Step 2: Proceed with purchase deletion
    await Purchase.findByIdAndDelete(req.params.id);

    // Step 3: Update stock quantities
    for (let i = 0; i < purchase.items.length; i++) {
      const purchaseItem = purchase.items[i];
      const stockItem = await Stock.findOne({
        itemName: purchaseItem.itemName,
      });

      if (stockItem) {
        // Decrease stock quantity by the amount in the purchase
        stockItem.quantity -= purchaseItem.quantity;
        await stockItem.save();
      }
    }

    // Step 4: Respond with success message
    res
      .status(200)
      .json({ message: "Purchase has been deleted successfully." });
  } catch (err) {
    console.error("Error deleting purchase:", err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
};



