import mongoose from "mongoose";

const { Schema, model } = mongoose;

const stockSchema = new Schema(
  {
    itemName: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    unit: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// Create the Stock model using the schema
const Stock = model("Stock", stockSchema);

export default Stock;
// models/Stock.js
// import mongoose from "mongoose";

// const stockSchema = new mongoose.Schema({
//   itemName: { type: String, },
//   purchaseQuantity: { type: Number, default: 0 },
//   saleQuantity: { type: Number, default: 0 },
//   availableQuantity: { type: Number, default: 0 },
//   unit: { type: String },
// });

// export default mongoose.model("Stock", stockSchema);
