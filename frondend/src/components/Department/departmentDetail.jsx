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
  IconButton,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useDepartments } from "./departmentsContext"; // Ensure correct context
import { useParams } from "react-router-dom";

const DepartmentDetail = () => {
  const { departments } = useDepartments(); // Use the department context instead of suppliers
  const { id } = useParams();
  const department = departments.find((item) => item._id === id); // Use department instead of supplier

  const calculateTotal = (unitPrice, quantity) => unitPrice * quantity;

  const handleEdit = (product) => {
    // Edit logic
    console.log("Edit product", product);
  };

  const handleDelete = (productId) => {
    // Delete logic
    console.log("Delete product", productId);
  };

  // Ensure department exists before rendering
  if (!department) return <Typography>Department not found</Typography>;

  return (
    <Grid
      container
      spacing={2}
      style={{ padding: "10px", backgroundColor: "#f4f4f4", height: "100vh" }}
    >
      {/* Product Table with Department Info in Header */}
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              {/* Department Info Row */}
              <TableRow>
                <TableCell colSpan={7} style={{ backgroundColor: "#f4f4f4" }}>
                  <Typography variant="body1">
                    <strong>Department:</strong> {department.name}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Manager:</strong> {department.manager}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Contact:</strong> {department.phoneNo}
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
                <TableCell style={{ color: "#fff" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {department.order.map((product, index) => (
                <TableRow key={product.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{product.itemName}</TableCell>
                  <TableCell>{product.unit}</TableCell>
                  <TableCell>{product.unitPrice}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>
                    {calculateTotal(product.unitPrice, product.quantity)}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleEdit(product)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(product.id)}
                      color="secondary"
                    >
                      <DeleteIcon />
                    </IconButton>
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

export default DepartmentDetail;
