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
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

// Create the Stock model using the schema
const Stock = model("Stock", stockSchema);

export default Stock;
