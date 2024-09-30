import Purchase from "../Models/Purchase.js";
import Supplier from "../Models/Supplier.js";

export const createPurchase = async (req, res) => {
  const { supplierId } = req.params;
  const newPurchase = new Purchase(req.body);
  try {
    const savedPurchase = await newPurchase.save();
    try {
      await Supplier.findByIdAndUpdate(supplierId, {
        $push: { order: savedPurchase },
      });
    } catch (error) {
      res.status(500).json("Internal server error", error);
    }
    res.status(201).json(savedPurchase);
  } catch (err) {
    res.status(500).json(err);
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
    const updatedPurchase = await Purchase.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedPurchase);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const deletePurchase = async (req, res) => {
  const { supplierId } = req.params;
  try {
    await Purchase.findByIdAndDelete(req.params.id);
    try {
      await Supplier.findByIdAndUpdate(supplierId, {
        $pull: { order: req.params.id },
      });
    } catch (error) {
      res.status(500).json("Internal server error", error);
    }
    res.status(200).json("Purchase has been deleted.");
  } catch (err) {
    res.status(500).json(err);
  }
};
