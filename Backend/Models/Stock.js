import mongoose from "mongoose";

const stockSchema = new mongoose.Schema({
  itemName: { type: String, required: true, index: true },
  availableQuantity: { type: Number, required: true, min: 0 },
  order: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
}, { timestamps: true });

export default mongoose.model('Stock', stockSchema);
