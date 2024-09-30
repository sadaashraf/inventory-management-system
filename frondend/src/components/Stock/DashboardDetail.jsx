import React from "react";
import { Row, Col, Card, Statistic, Progress } from "antd";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const DashboardDetail = ({ stockData, loading }) => {
  // Dashboard Summary Data
  const totalStock = stockData.reduce((sum, item) => sum + item.availableQuantity, 0);
  const lowStockItems = stockData.filter(item => item.availableQuantity < 10).length;
  const totalSales = stockData.reduce((sum, item) => sum + item.saleQuantity, 0);

  // Visualization Data
  const chartData = stockData.map(item => ({
    name: item.itemName,
    available: item.availableQuantity,
    sales: item.saleQuantity,
  }));

  return (
    <div>
      <h2>Inventory Dashboard</h2>
      {/* Key Metrics */}
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic title="Total Stock" value={totalStock} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Low Stock Items" value={lowStockItems} />
            <Progress percent={(lowStockItems / stockData.length) * 100} showInfo={false} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Total Sales" value={totalSales} />
          </Card>
        </Col>
      </Row>

      {/* Stock Chart */}
      <div style={{ marginTop: 32 }}>
        <h3>Stock vs Sales Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="available" fill="#8884d8" />
            <Bar dataKey="sales" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardDetail;
