import React from "react";
import { Table, Input, Empty, Button } from "antd";

const StockDetails = ({ stockData, loading, searchText, setSearchText }) => {
  const filteredData = stockData.filter(item => 
    item.itemName?.toLowerCase().includes(searchText.toLowerCase())
  );

  // Function to handle restocking
  const handleRestock = (itemName) => {
    // Implement your restocking logic here
    console.log(`Restocking ${itemName}`);
  };

  // Function to handle stock action
  const handleStock = (itemName) => {
    // Implement your stock logic here
    console.log(`Stocking ${itemName}`);
  };

  return (
    <div>
      <h3 style={{ marginTop: 32 }}>Stock Details</h3>
      <Input
        placeholder="Search item by name"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: 16, width: '200px' }}
      />
      {loading ? (
        <p>Loading...</p>
      ) : filteredData.length > 0 ? (
        <Table
          dataSource={filteredData}
          columns={[
            {
              title: "Item Name",
              dataIndex: "itemName",
              key: "itemName",
            },
            {
              title: "Purchase Quantity",
              dataIndex: "purchaseQuantity",
              key: "purchaseQuantity",
              render: (text, record) => (
                <span>
                  {text} {record.unit}
                </span>
              )
            },
            {
              title: "Issue Quantity",
              dataIndex: "saleQuantity",
              key: "saleQuantity",
              render: (text, record) => (
                <span>
                  {text} {record.unit}
                </span>
              )
            },
            {
              title: "Available Quantity",
              dataIndex: "availableQuantity",
              key: "availableQuantity",
              render: (text, record) => (
                <span>
                  {text} {record.unit}
                </span>
              )
            },
            {
              title: 'Actions',
              key: 'actions',
              render: (text, record) => (
                record.availableQuantity < 10 ? (
                  <Button type="primary" danger onClick={() => handleRestock(record.itemName)}>
                    Restock
                  </Button>
                ) : (
                  <Button type="primary" onClick={() => handleStock(record.itemName)}>
                    Stock
                  </Button>
                )
              ),
            },
          ]}
          loading={loading}
          rowKey="itemName"
        />
      ) : (
        <Empty description="No Stock Data Found" />
      )}
    </div>
  );
};

export default StockDetails;
