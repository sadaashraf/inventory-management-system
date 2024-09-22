import mongoose from "mongoose";

const SupplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    phoneNo: {
      type: String,
    },
    shopName: {
      type: String,
    },
    address: {
      type: String,
    },
    order: Array,
  },
  { timestamps: true }
);

export default mongoose.model("Supplier", SupplierSchema);
