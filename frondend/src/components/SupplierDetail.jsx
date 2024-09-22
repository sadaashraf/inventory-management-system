import React from "react";
import {
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useSuppliers } from "../context/supplierContext";
import { useParams } from "react-router-dom";

const SupplierDetail = () => {
  const { suppliers } = useSuppliers();
  const { id } = useParams();
  const supplier = suppliers.find((item) => item._id === id);

  // Fetch data from backend API

  const calculateTotal = (unitPrice, quantity) => unitPrice * quantity;

  return (
    <Grid
      container
      spacing={2}
      style={{ padding: "10px", backgroundColor: "#f4f4f4", height: "100vh" }}
    >
      {/* Product Table with Supplier Info in Header */}
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              {/* Supplier Info Row */}
              <TableRow>
                <TableCell colSpan={6} style={{ backgroundColor: "#f4f4f4" }}>
                  <Typography variant="body1">
                    <strong>Shop Name:</strong> {supplier.shopName}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Supplier:</strong> {supplier.name}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Address:</strong> {supplier.address}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Contact:</strong> {supplier.phoneNo}
                  </Typography>
                </TableCell>
              </TableRow>

              {/* Column Headers */}
              <TableRow style={{ backgroundColor: "#009ddc" }}>
                <TableCell style={{ color: "#fff" }}>No</TableCell>
                <TableCell style={{ color: "#fff" }}>Product</TableCell>
                <TableCell style={{ color: "#fff" }}>Unit</TableCell>
                <TableCell style={{ color: "#fff" }}>Price</TableCell>
                <TableCell style={{ color: "#fff" }}>Quantity</TableCell>
                <TableCell style={{ color: "#fff" }}>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {supplier.order.map((product, index) => (
                <TableRow key={product.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{product.itemName}</TableCell>
                  <TableCell>{product.unit}</TableCell>
                  <TableCell>{product.unitPrice}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>
                    {calculateTotal(product.unitPrice, product.quantity)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default SupplierDetail;
