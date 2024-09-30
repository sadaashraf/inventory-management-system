import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Create the schema for items
const itemSchema = new Schema({
  itemName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
  unitPrice: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
});

// Create the schema for purchase
const purchaseSchema = new Schema({
  supplier: {
    type: String,
    required: true,
  },
  purchaseDate: {
    type: Date,
    required: true,
  },
  items: [itemSchema], // Array of items
  total: {
    type: Number,
    required: true,
  },

});

// Create the model
const Purchase = mongoose.model("Purchase", purchaseSchema);

export default Purchase;