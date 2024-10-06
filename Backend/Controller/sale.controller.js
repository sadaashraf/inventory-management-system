import Department from "../Models/Department.js";
import Issue from "../Models/Sale.js";
import Stock from "../Models/Stock.js";
// Create a new sale
export const createSale = async (req, res) => {
  const { deptId } = req.params;
  try {
    const sale = new Issue(req.body);
    const savedSale = await sale.save();

    // Update stock quantities
    await Promise.all(sale.items.map(async (item) => {
      await Stock.findOneAndUpdate(
        { itemName: item.itemName }, // Ensure this matches your stock item
        { $inc: { quantity: -item.quantity } }, // Decrease the quantity
      );
      await Department.findByIdAndUpdate(deptId, {
        $push: { issuedItems: item },
      });
    }));

    res.status(201).json(savedSale);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

// Get all sales
export const getSales = async (req, res) => {
  try {
    const sales = await Issue.find();
    res.status(200).json(sales);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching issues: " + error.message });
  }
};

// Get all sale
export const getSale = async (req, res) => {
  try {
    const sale = await Issue.findById(req.params.id);
    res.status(200).json(sale);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching issues: " + error.message });
  }
};

// Update a sale
export const updateSale = async (req, res) => {
  try {
    const sale = await Issue.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!sale) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.status(200).json(sale);
  } catch (error) {
    res.status(400).json({ message: "Error updating Issue: " + error.message });
  }
};

// Delete a sale
export const deleteSale = async (req, res) => {
  const { deptId } = req.params;
  try {
    const sale = await Issue.findByIdAndDelete(req.params.id);

    if (!sale) {
      return res.status(404).json({ message: "Issue not found" });
    }
    try {
      sale.items.map(async (item) => {
        await Department.findByIdAndUpdate(deptId, {
          $pull: { issuedItems: item },
        });
      });
    } catch (error) {
      res.status(500).json("Internal server error", error);
    }
    res.status(200).json({ message: "Issue deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Issue: " + error.message });
  }
};
