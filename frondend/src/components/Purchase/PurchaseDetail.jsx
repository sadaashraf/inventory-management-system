import React, { useEffect, useState } from "react";
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
  TableFooter,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useSuppliers } from "../../context/supplierContext";
import { useParams } from "react-router-dom";
import { message } from "antd";
import axios from "axios";
import moment from "moment";

const PurchaseDetail = () => {
  const { id } = useParams();
  const [dataSource, setDataSource] = useState({});

  const fetchPurchases = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/purchases/${id}`
      );
      console.log("response", response.data);
      setDataSource(response.data);
    } catch (error) {
      message.error("Error fetching purchase");
      console.error("error", error);
    }
  };
  useEffect(() => {
    fetchPurchases();
  }, []);
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
                <TableCell colSpan={7} style={{ backgroundColor: "#f4f4f4" }}>
                  <Typography variant="body1">
                    <strong>Supplier:</strong> {dataSource.supplier}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Date:</strong> {moment(dataSource.purchaseDate).format("YYYY-MM-DD")}
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
                {/* <TableCell style={{ color: "#fff" }}>Actions</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {dataSource.items?.map((item, index) => (
                <TableRow key={item._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.itemName}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>{item.unitPrice}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow >
                <TableCell colSpan={7} style={{ backgroundColor: "#f4f4f4" }}>
                  <Typography variant="body1" style={{textAlign:'left', float:'right'}}>
                    <strong>Total:</strong> {dataSource.total}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default PurchaseDetail;
