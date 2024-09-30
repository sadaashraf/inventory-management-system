// import React, { useEffect, useState } from "react";
// import { Form, Input, Button, DatePicker, Select, Space, Row, Col, AutoComplete, message } from "antd";
// import axios from "axios";
// import moment from "moment";

// const { Option } = Select;

// const SaleForm = ({ initialValues, onFinish, onCancel }) => {
//   const [form] = Form.useForm();
//   const [purchaseItems, setPurchaseItems] = useState([]);
//   const [availableStock, setAvailableStock] = useState(0);

//   // Fetch purchase items
//   useEffect(() => {
//     const fetchPurchaseItems = async () => {
//       try {
//         const response = await axios.get("http://localhost:8000/api/purchases");
//         setPurchaseItems(response.data.map(purchase => ({
//           itemName: purchase.itemName,
//           availableStock: purchase.availableStock
//         }))); // Extract item names and stock
//       } catch (error) {
//         console.error("Error fetching purchase items:", error);
//       }
//     };
//     fetchPurchaseItems();
//   }, []);

//   // Convert the saleDate to a moment object if it's provided
//   const initialFormValues = {
//     ...initialValues,
//     saleDate: initialValues?.saleDate ? moment(initialValues.saleDate) : null,
//   };

//   // Reset form fields when the modal is closed
//   useEffect(() => {
//     form.resetFields();
//   }, [initialValues, form]);

//   // Handle item selection and fetch available stock
//   const handleItemSelect = (value) => {
//     const selectedItem = purchaseItems.find(item => item.itemName === value);
//     if (selectedItem) {
//       setAvailableStock(selectedItem.availableStock);
//     }
//   };

//   // Handle form submission and validate sale quantity
//   const handleFinish = (values) => {
//     if (values.quantity > availableStock) {
//       message.error(`Sale quantity exceeds available stock of ${availableStock}`);
//     } else {
//       // Proceed with sale logic if validation passes
//       onFinish(values);
//       message.success('Sale successful!');
//     }
//   };

//   return (
//     <Form
//       form={form}
//       initialValues={initialFormValues}
//       onFinish={handleFinish}
//       layout="vertical"
//     >
//       <Row gutter={24}>
//         <Col span={12}>
//           <Form.Item 
//             name="itemName" 
//             label="Item Name" 
//             rules={[{ required: true, message: "Please input the item name!" }]}
//           >
//             <AutoComplete
//               options={purchaseItems.map(item => ({ value: item.itemName }))}
//               placeholder="Select or type item name"
//               filterOption={(inputValue, option) =>
//                 option.value.toLowerCase().includes(inputValue.toLowerCase())
//               }
//               onSelect={handleItemSelect}
//             >
//               <Input />
//             </AutoComplete>
//           </Form.Item>
//         </Col>
//         <Col span={12}>
//           <Form.Item 
//             name="quantity" 
//             label="Quantity" 
//             rules={[{ required: true, message: "Please input the quantity!" }]}
//           >
//             <Input type="number" />
//           </Form.Item>
//         </Col>
//       </Row>

//       {/* Other form fields */}
//       <Row gutter={24}>
//         <Col span={12}>
//           <Form.Item name="unit" label="Unit of Measure" rules={[{ required: true, message: "Please select the unit of measure!" }]}>
//             <Select placeholder="Select a unit">
//               <Option value="Kg">Kg</Option>
//               <Option value="Liter">Liter</Option>
//               <Option value="pieces">Pieces</Option>
//             </Select>
//           </Form.Item>
//         </Col>
//         <Col span={12}>
//           <Form.Item name="unitPrice" label="Unit Price" rules={[{ required: true, message: "Please input the unit price!" }]}>
//             <Input type="number" />
//           </Form.Item>
//         </Col>
//       </Row>

//       <Row gutter={24}>
//         <Col span={12}>
//           <Form.Item name="customer" label="Customer" rules={[{ required: true, message: "Please input the customer!" }]}>
//             <Input />
//           </Form.Item>
//         </Col>
//         <Col span={12}>
//           <Form.Item name="saleDate" label="Sale Date" rules={[{ required: true, message: "Please input the sale date!" }]}>
//             <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
//           </Form.Item>
//         </Col>
//       </Row>

//       <Form.Item wrapperCol={{ span: 24 }}>
//         <Space>
//           <Button type="primary" htmlType="submit">
//             Add
//           </Button>
//           <Button onClick={onCancel}>Cancel</Button>
//         </Space>
//       </Form.Item>
//     </Form>
//   );
// };

// export default SaleForm;

import React, { useEffect, useState } from "react";
import { Form, Input, Button, DatePicker, Select, Space, Row, Col, AutoComplete, message } from "antd";
import axios from "axios";
import moment from "moment";

const { Option } = Select;

const SaleForm = ({ initialValues, onFinish, onCancel }) => {
  const [form] = Form.useForm();
  const [stockItems, setStockItems] = useState([]);
  const [availableQuantity, setAvailableQuantity] = useState(0);
  const [fetchError, setFetchError] = useState(null);

  // Fetch stock items
  useEffect(() => {
    const fetchStockItems = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/stock");
        console.log(response.data); // Log the response data
      } catch (error) {
        console.error("Error fetching data:", error.response || error.message);
      }
    };
    fetchStockItems();
  }, []);

  const initialFormValues = {
    ...initialValues,
    saleDate: initialValues?.saleDate ? moment(initialValues.saleDate) : null,
  };

  useEffect(() => {
    form.resetFields();
  }, [initialValues, form]);

  const handleItemSelect = (itemName) => {
    const selectedItem = stockItems.find(item => item.itemName === itemName);
    setAvailableQuantity(selectedItem ? selectedItem.availableQuantity : 0);
  };

  const handleSubmit = (values) => {
    if (values.quantity > availableQuantity) {
      message.error(`The issued quantity exceeds the available quantity (${availableQuantity}).`);
    } else {
      onFinish(values);
    }
  };

  return (
    <Form
      form={form}
      initialValues={initialFormValues}
      onFinish={handleSubmit}
      layout="vertical"
    >
      {fetchError && <p style={{ color: 'red' }}>{fetchError}</p>} {/* Display fetch error */}
      
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item 
            name="itemName" 
            label="Item Name" 
            rules={[{ required: true, message: "Please input the item name!" }]}
          >
            <AutoComplete
              options={stockItems.map(item => ({ value: item.itemName }))}
              placeholder="Select or type item name"
              filterOption={(inputValue, option) =>
                option.value.toLowerCase().includes(inputValue.toLowerCase())
              }
              onSelect={handleItemSelect}
            >
              <Input />
            </AutoComplete>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item 
            name="quantity" 
            label="Quantity" 
            rules={[{ required: true, message: "Please input the quantity!" }]}
          >
            <Input type="number" min={1} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={12}>
          <Form.Item name="unit" label="Unit of Measure" rules={[{ required: true, message: "Please select the unit of measure!" }]}>
            <Select placeholder="Select a unit">
              <Option value="Kg">Kg</Option>
              <Option value="Liter">Liter</Option>
              <Option value="Pieces">Pieces</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="unitPrice" label="Unit Price" rules={[{ required: true, message: "Please input the unit price!" }, { type: "number", min: 0, message: "Unit price must be a positive number!" }]}>
            <Input type="number" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={12}>
          <Form.Item name="customer" label="Department" rules={[{ required: true, message: "Please input the customer!" }]}>
            <Select>
              <Option value="Chinese">Chinese</Option>
              <Option value="Pakistani">Pakistani</Option>
              <Option value="Cold drink">Cold drink</Option>
              <Option value="BBQ">BBQ</Option>
              <Option value="BAR">BAR</Option>
              <Option value="Kashmiri food">Kashmiri food</Option>
              <Option value="Traditional food">Traditional food</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="saleDate" label="Issue Date" rules={[{ required: true, message: "Please input the sale date!" }]}>
            <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item wrapperCol={{ span: 24 }}>
        <Space>
          <Button type="primary" htmlType="submit">
            Add
          </Button>
          <Button onClick={onCancel}>
            Cancel
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default SaleForm;
