import React from "react";
import { Table, Input, Empty, Button } from "antd";

const StockDetails = ({ stockData, searchText, setSearchText, loading }) => {
  console.log("StockData in StockDetails:", stockData); // Log stockData

  // Ensure itemName exists in stockData
  stockData.forEach(item => {
    console.log("Item Structure:", item); // Log each stock item structure
  });

  const filteredData = stockData.filter(item => {
    if (!item.itemName) {
      console.error("Missing itemName for item:", item); // Log items without itemName
      return false;
    }
    return item.itemName.toLowerCase().includes(searchText.toLowerCase());
  });

  console.log("Filtered Data:", filteredData); // Log the filtered data

  // Function to handle restocking
  const handleRestock = (itemName) => {
    console.log(`Restocking ${itemName}`);
  };

  // Function to handle stock action
  const handleStock = (itemName) => {
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
        className="css-table"
          dataSource={filteredData}
          columns={[
            {
              title: "Item Name",
              dataIndex: "itemName",
              key: "itemName",
            },
            {
              title: "Category",
              dataIndex: "category",
              key: "category",
              
            },
            {
              title: "Available Quantity",
              dataIndex: "quantity",
              key: "quantity",
              render: (text, record) => (
                <span>
                  {text} {record.unit}
                </span>
              ),
            },
            
            {
              title: 'Actions',
              key: 'actions',
              render: (text, record) => (
                record.quantity < 10 ? (
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
