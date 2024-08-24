
import React from 'react';
import { Row, Col, Card } from 'antd';
import { LineChartOutlined, AreaChartOutlined } from '@ant-design/icons';

const BarChart = () => {
  return (
    <Row gutter={16}>
      <Col span={8}>
        <Card title="Sales" bordered={false} extra={<LineChartOutlined />}>
          <p>Sales Data</p>
        </Card>
      </Col>
      <Col span={8}>
        <Card title="Revenue" bordered={false} extra={<AreaChartOutlined />}>
          <p>Revenue Data</p>
        </Card>
      </Col>
      <Col span={8}>
        <Card title="Users" bordered={false} extra={<UserOutlined />}>
          <p>User Data</p>
        </Card>
      </Col>
    </Row>
  );
};

export default BarChart;
