import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  unitPrice: {
    type: Number,
    required: true,
  },
  customer: {
    type: String,
    required: true,
  },
  saleDate: {
    type: Date,
    required: true,
  }
});

export default mongoose.model('Sale', saleSchema);


