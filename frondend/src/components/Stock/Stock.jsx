import React, { useState, useEffect } from "react";
import { notification } from "antd";
import axios from "axios";
import StockDetails from "./StockDetails";
import { useStocks } from "../../context/stocksContext";
import "../invatory.css";

const Stock = () => {
  const [searchText, setSearchText] = useState("");
  const { stockData, loading } = useStocks();

  return (
    <div>
      <StockDetails
        stockData={stockData}
        loading={loading}
        searchText={searchText}
        setSearchText={setSearchText}
        className="css-table"
      />
    </div>
  );
};

export default Stock;
