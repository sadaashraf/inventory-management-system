import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
    trim: true,
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
    default: 0,
  },
});

const DepartmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    manager: {
      type: String,
    },
    phoneNo: {
      type: String,
    },
  
    issuedItems: [itemSchema], // Assuming a department can place orders as well
  },
  { timestamps: true }
);

export default mongoose.model("Department", DepartmentSchema);
