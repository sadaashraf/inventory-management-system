import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

import categoryRoutes from "./Routes/category.routes.js";
import purchaseRoute from "./Routes/purchase.routes.js";
import saleRoutes from "./Routes/sale.routes.js";
import stockRoutes from "./Routes/stock.routes.js";
import supplierRoutes from './Routes/supplier.routes.js'

import departmentRoutes from './Routes/department.routes.js'
const app = express();

dotenv.config();

// MiddleWerss
const corsOptions = {
  credentials: true,
  origin: "http://localhost:5173",
};
app.use(cors(corsOptions));

// Specify the allowed origin

app.use(cookieParser());
app.use(express.json());

const DatabaseConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to mongoDB.");
  } catch(error) {
    console.log("Connection Error ", error);
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB Disconnected!");
});

app.get("/", (req, res) => {
  
  res.json({ message: "Hello" });
});

const port = process.env.PORT || 8000;

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

app.use("/api/categories", categoryRoutes);
app.use('/api/stock', stockRoutes);
app.use("/api/purchases", purchaseRoute);
app.use('/api/sales', saleRoutes);
app.use('/api/suppliers', supplierRoutes);

app.use('/api/department', departmentRoutes);


app.listen(port, () => {
  DatabaseConnection();
  console.log(`Server Listen on port ${port}`);
  console.log("Connected to backend.");
});