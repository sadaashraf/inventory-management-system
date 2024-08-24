// models/Purchase.js
import mongoose from "mongoose";

const PurchaseSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  unitPrice: { type: Number, required: true },
  supplier: { type: String, required: true },
  purchaseDate: { type: Date, required: true },
});

export default mongoose.model("Purchase", PurchaseSchema);
