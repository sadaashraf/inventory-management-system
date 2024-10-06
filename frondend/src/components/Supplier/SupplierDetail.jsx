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
  TableFooter,
} from "@mui/material";
import { useSuppliers } from "../../context/supplierContext";
import { useParams } from "react-router-dom";

const SupplierDetail = () => {
  const { suppliers } = useSuppliers();
  const { id } = useParams();
  const supplier = suppliers.find((item) => item._id === id);

  const calculateTotal = (unitPrice, quantity) => unitPrice * quantity;

  const calculateTotalPrice = () => {
    return supplier.order.reduce((total, product) => {
      return total + calculateTotal(product.unitPrice, product.quantity);
    }, 0);
  };

  return (
    <Grid
      container
      spacing={2}
      style={{ padding: "10px", backgroundColor: "#f4f4f4", height: "100vh" }}
    >
      <Grid item xs={12}>
        {supplier ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell colSpan={7} style={{ backgroundColor: "#f4f4f4" }}>
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
                <TableRow style={{ backgroundColor: "#009ddc" }}>
                  <TableCell style={{ color: "#fff" }}>no</TableCell>
                  <TableCell style={{ color: "#fff" }}>Product</TableCell>
                  <TableCell style={{ color: "#fff" }}>Quantity</TableCell>
                  <TableCell style={{ color: "#fff" }}>Unit Price</TableCell>
                  <TableCell style={{ color: "#fff" }}>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {supplier.order?.map((product, index) => (
                  <TableRow key={product._id || index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{product.itemName}</TableCell>
                    <TableCell>{`${product.quantity} ${product.unit}`}</TableCell>
                    <TableCell>{product.unitPrice}</TableCell>
                    <TableCell>
                      {calculateTotal(product.unitPrice, product.quantity)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell
                    colSpan={4}
                    style={{ textAlign: "right", fontWeight: "bold" }}
                  >
                    Balance:
                  </TableCell>
                  <TableCell>{supplier.balance}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    colSpan={4}
                    style={{ textAlign: "right", fontWeight: "bold" }}
                  >
                    Total:
                  </TableCell>
                  <TableCell>{calculateTotalPrice()}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="h6">Loading supplier details...</Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default SupplierDetail;
