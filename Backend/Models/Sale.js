import mongoose from "mongoose";
// Define the item schema
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

// Define the main schema for the department issue
const departmentIssueSchema = new mongoose.Schema({
  department: {
    type: String,
    required: true,
    trim: true,
  },
  issueDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  items: [itemSchema], // Array of itemSchema
  total: {
    type: Number,
    required: true,
    default: 0,
  },
});

// Create the model
const Issue = mongoose.model('Issue', departmentIssueSchema);

export default Issue;
