import mongoose from "mongoose";

const stockSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  purchaseQuantity: { type: Number, default: 0 },
  saleQuantity: { type: Number, default: 0 },
  availableQuantity: { type: Number, default: 0 },
  unit: { type: String, required: true }
});

export default mongoose.model('Stock', stockSchema);
