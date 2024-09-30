import mongoose from "mongoose";

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
  
    order: Array, // Assuming a department can place orders as well
  },
  { timestamps: true }
);

export default mongoose.model("Department", DepartmentSchema);
