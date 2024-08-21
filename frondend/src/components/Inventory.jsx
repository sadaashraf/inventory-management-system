import React, { useState } from "react";
import Purchase from "./Purchase";
import Sale from "./Sale";
import Stock from "./Stock";

const Inventory = () => {
  const [purchaseData, setPurchaseData] = useState([]);
  const [saleData, setSaleData] = useState([]);

  return (
    <div>
      <Purchase purchaseData={purchaseData} setPurchaseData={setPurchaseData} />
      <Sale saleData={saleData} setSaleData={setSaleData} />
      <Stock purchaseData={purchaseData} saleData={saleData} />
    </div>
  );
};

export default Inventory;
