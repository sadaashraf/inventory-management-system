import React, { useEffect, useState } from "react";
import { Table, Input, Button, Select, Row, Col } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Formik, Field, Form, FieldArray } from "formik";
import * as Yup from "yup"; // For validation
import { useDepartments } from "../Department/departmentsContext";
import { useStocks } from "../../context/stocksContext";
import moment from "moment";
import "../invatory.css";
const { Option } = Select;

// Validation schema for Formik
const validationSchema = (stockData = []) =>
  Yup.object().shape({
    department: Yup.string().required("Department is required"),
    issueDate: Yup.string().required("Issue Date is required"),
    items: Yup.array()
      .of(
        Yup.object().shape({
          itemName: Yup.string().required("Item name is required"),
          quantity: Yup.number()
            .required("Quantity is required")
            .positive("Quantity must be greater than 0")
            .test(
              "check-stock",
              "Quantity exceeds available stock",
              function (value) {
                const itemName = this.parent.itemName;
                const stockItem = stockData.find(
                  (item) => item.itemName === itemName
                );
                return stockItem ? value <= stockItem.quantity : true;
              }
            ),
          unit: Yup.string().required("Unit is required"),
          unitPrice: Yup.number()
            .required("Unit price is required")
            .positive("Unit price must be greater than 0"),
        })
      )
      .min(1, "At least one item is required"),
  });

const IssueForm = ({ initialValues, onFinish, onCancel, editingItem }) => {
  const { departments } = useDepartments();
  const { stockData = [] } = useStocks(); // Ensure stockData defaults to an empty array
  const [filteredItems, setFilteredItems] = useState([]);

  // Filter stock items based on available quantity
  useEffect(() => {
    const itemsWithStock = stockData.filter((item) => item.quantity > 0);
    setFilteredItems(itemsWithStock);
  }, [stockData]);

  // Calculate total for all items in the form
  const calculateTotal = (items) => {
    return items.reduce(
      (acc, curr) => acc + (curr.unitPrice * curr.quantity || 0),
      0
    );
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema(stockData)} // Pass stockData to the validation schema
      onSubmit={(values) => onFinish(values)}
      validateOnChange={false}
      validateOnBlur={false}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        setFieldValue,
        handleSubmit,
      }) => (
        <Form>
          <Row gutter={16} style={{ marginBottom: 0 }}>
            <Col span={12}>
              <label>Department</label>
              <Select
                name="department"
                className="ant-input"
                value={values.department}
                onChange={(value) => setFieldValue("department", value)}
                placeholder="Select a department"
                style={{ height: "40px" }} // Adjust width and height here
              >
                {departments.map((dept) => (
                  <Option key={dept._id} value={dept.name}>
                    {dept.name}
                  </Option>
                ))}
              </Select>
              {touched.department && errors.department && (
                <div className="error">{errors.department}</div>
              )}
            </Col>

            <Col span={12}>
                <label>Issue Date</label>
                <Field
                  as={Input}
                  name="issueDate"
                  type="date"
                  className="ant-input"
                  value={moment(values.issueDate).format("YYYY-MM-DD")}
                  onChange={handleChange}
                />
                {touched.issueDate && errors.issueDate && (
                  <div className="error">{errors.issueDate}</div>
                )}
              </Col>
          </Row>

          <FieldArray name="items">
            {({ remove, push }) => (
              <>
                <Table
                  dataSource={values.items}
                  pagination={false}
                  rowKey={(record, index) => index}
                  className="custom-table"
                  columns={[
                    {
                      title: "Item Name",
                      dataIndex: "itemName",
                      render: (_, record, index) => (
                        <>
                          <Select
                            name={`items.${index}.itemName`}
                            className="ant-input"
                            value={values.items[index].itemName || null}
                            onChange={(value) =>
                              setFieldValue(`items.${index}.itemName`, value)
                            }
                            placeholder="Select an item from stock"
                            style={{ height: "40px" }} 
                          >
                            {filteredItems.map((item) => (
                              <Option key={item._id} value={item.itemName}>
                                {item.itemName}
                              </Option>
                            ))}
                          </Select>
                          {touched.items?.[index]?.itemName &&
                            errors.items?.[index]?.itemName && (
                              <div className="error">
                                {errors.items[index].itemName}
                              </div>
                            )}
                        </>
                      ),
                    },
                    {
                      title: "Quantity",
                      dataIndex: "quantity",
                      render: (_, record, index) => (
                        <>
                          <Field
                            as={Input}
                            name={`items.${index}.quantity`}
                            type="number"
                            className="ant-input"
                            onChange={handleChange}
                            placeholder="Quantity"
                          />
                          {touched.items?.[index]?.quantity &&
                            errors.items?.[index]?.quantity && (
                              <div className="error">
                                {errors.items[index].quantity}
                              </div>
                            )}
                        </>
                      ),
                    },
                    {
                      title: "Unit",
                      dataIndex: "unit",
                      render: (_, record, index) => (
                        <Select
                          name={`items.${index}.unit`}
                          className="ant-input"
                          value={values.items[index].unit || null}
                          onChange={(value) =>
                            setFieldValue(`items.${index}.unit`, value)
                          }
                          placeholder="unit"
                          style={{ height: "40px" }} 
                        >
                          <Option value="kg">KG</Option>
                          <Option value="liter">Ltr</Option>
                          <Option value="pieces">Pcs</Option>
                        </Select>
                      ),
                    },
                    {
                      title: "Unit Price",
                      dataIndex: "unitPrice",
                      render: (_, record, index) => (
                        <Field
                          as={Input}
                          name={`items.${index}.unitPrice`}
                          type="number"
                          className="ant-input"
                          placeholder="Unit Price"
                          onChange={(e) => {
                            handleChange(e);
                            const newUnitPrice = e.target.value;
                            const quantity =
                              values.items[index].quantity || 0;
                            const total = newUnitPrice * quantity;

                            // Update total for the item
                            setFieldValue(`items.${index}.total`, total);
                            // calculateGrandTotal(); // Recalculate the grand total
                          }}
                        />
                      ),
                    },
                    {
                      title: "Total",
                      dataIndex: "total",
                      render: (_, record, index) => (
                        <Field
                          as={Input}
                          name={`items.${index}.total`}
                          className="ant-input"
                          readOnly
                          value={values.items[index].total || 0}
                        />
                      ),
                    },
                    {
                      title: "Actions",
                      dataIndex: "actions",
                      render: (_, record, index) => (
                        <Button
                          icon={<DeleteOutlined />}
                          onClick={() => remove(index)}
                        />
                      ),
                    },
                  ]}
                  footer={() => (
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() =>
                        push({
                          itemName: "",
                          quantity: "",
                          unit: "",
                          unitPrice: "",
                          total: 0,
                        })
                      }
                    >
                      Add Row
                    </Button>
                  )}
                />
                <Row gutter={16} justify="start" style={{ marginTop: 20 }}>
                  <Col span={8}>
                    <strong>Total: </strong> {calculateTotal(values.items) || 0}
                  </Col>
                </Row>
              </>
            )}
          </FieldArray>

          <Row style={{ marginTop: 10, justifyContent: "end" }}>
            <Col>
              <Button
                type="primary"
                onClick={handleSubmit}
                style={{ marginRight: 20 }}
              >
                {!editingItem ? "Add" : "Update"}
              </Button>
              <Button onClick={onCancel}>Cancel</Button>
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default IssueForm;
