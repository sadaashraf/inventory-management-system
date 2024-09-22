import mongoose from "mongoose";

const stockSchema = new mongoose.Schema({
  
  itemName: { type: String, required: true },
  availableQuantity: { type: Number, required: true },

});

export default mongoose.model('Stock', stockSchema);
