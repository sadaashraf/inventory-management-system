import React, { useEffect, useState } from "react";
import { Table, Input, Button, Select, Row, Col } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useSuppliers } from "../../context/supplierContext";
import { Formik, Field, Form, FieldArray } from "formik";
import * as Yup from "yup"; // For validation
import { useStocks } from "../../context/stocksContext";
import { useCategory } from "../../context/categoryContext";
import "../invatory.css";
import moment from "moment";
const { Option } = Select;

// Validation schema for Formik
const validationSchema = Yup.object().shape({
  supplier: Yup.string().required("Supplier is required"), // Supplier is required
  purchaseDate: Yup.string().required("Purchase Date is required"), // Purchase date is required
  items: Yup.array()
    .of(
      Yup.object().shape({
        itemName: Yup.string().required("Item name is required"), // Item name is required
        quantity: Yup.number()
          .required("Quantity is required") // Quantity is required
          .positive("Quantity must be greater than 0"), // Must be greater than 0
        unit: Yup.string().required("Unit is required"), // Unit is required
        unitPrice: Yup.number()
          .required("Unit price is required") // Unit price is required
          .positive("Unit price must be greater than 0"), // Must be greater than 0
        // total: Yup.number()
        //   .required("Total is required") // Total is required
        //   .positive("Total must be greater than 0"), // Must be greater than 0
      })
    )
    .min(1, "At least one item is required"), // Ensure at least one item is added
});

const BillingForm = ({ initialValues, onFinish, onCancel, editingItem }) => {
  const { suppliers } = useSuppliers();
  const { stockData } = useStocks();
  const { categories } = useCategory();
  const [selctedSupplier, setSelctedSupplier] = useState();
  console.log("initialValues", initialValues);
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        console.log("values", values);
        onFinish(values); // Pass the form data to the onFinish function
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        setFieldValue,
        handleSubmit,
      }) => {
        // Calculate overall total
        // Function to calculate the grand total dynamically
        const calculateGrandTotal = () => {
          const grandTotal = values.items.reduce((acc, item) => {
            return acc + (item.total || 0); // Sum all item totals
          }, 0);
          return grandTotal;
        };

        // useEffect to update the grand total whenever items array changes
        useEffect(() => {
          const total = calculateGrandTotal();
          setFieldValue("total", total); // Update the total field in Formik state
        }, [values.items, setFieldValue]); // Recalculate whenever items change

        return (
          <Form>
            {/* Supplier and Purchase Date */}
            <Row gutter={16} style={{ marginBottom: 10 }}>
              <Col span={12}>
                <label style={{ paddingLeft: "5px" }}>Suppliers</label>
                <Select
                  name="supplier"
                  className="ant-input"
                  value={values.supplier || null} // Ensure null when no value is selected
                  onChange={(value) => {
                    setFieldValue("supplier", value);
                    setSelctedSupplier(
                      suppliers.find((sup) => sup.shopName === value)
                    );
                  }}
                  placeholder="Select a supplier" // Placeholder text
                >
                  {suppliers.map((supplier) => (
                    <Option key={supplier._id} value={supplier.shopName}>
                      {supplier.shopName}
                    </Option>
                  ))}
                </Select>
                {touched.supplier && errors.supplier && (
                  <div className="error">{errors.supplier}</div>
                )}
              </Col>

              <Col span={12}>
                <label>Purchase Date</label>
                <Field
                  as={Input}
                  name="purchaseDate"
                  type="date"
                  className="ant-input"
                  value={moment(values.purchaseDate).format("YYYY-MM-DD")}
                  onChange={handleChange}
                />
                {touched.purchaseDate && errors.purchaseDate && (
                  <div className="error">{errors.purchaseDate}</div>
                )}
              </Col>
            </Row>
            <Row gutter={16} style={{ marginBottom: 10 }}>
              <Col span={12}>
                <label>Payment Method</label>
                <Select
                  name={`paymentMethod`}
                  className="ant-input"
                  value={values.paymentMethod || null} // Ensure null when no value is selected
                  onChange={(value) => setFieldValue(`paymentMethod`, value)}
                  placeholder="Payment Method"
                >
                  <Option value="cash">Cash </Option>
                  <Option value="cheque">Cheque </Option>
                </Select>
                {touched.paymentMethod && errors.paymentMethod && (
                  <div className="error">{errors.paymentMethod}</div>
                )}
              </Col>
              <Col span={12}>
                {values.paymentMethod === "cheque" && (
                  <>
                    <label>Cheque Number</label>
                    <Field
                      as={Input}
                      name="chequeNo"
                      type="number"
                      className="ant-input"
                      onChange={handleChange}
                    />
                    {touched.chequeNo && errors.chequeNo && (
                      <div className="error">{errors.chequeNo}</div>
                    )}
                  </>
                )}
              </Col>
            </Row>

            {/* Items Table */}
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
                            <Field
                              as={Input}
                              name={`items.${index}.itemName`}
                              className="ant-input"
                              placeholder="Item Name"
                              onChange={handleChange}
                            />
                            {touched.itemName && stockData.length > 0 && (
                              <div>
                                {stockData.map((stock) => (
                                  <div key={stock._id}>{stock.itemName}</div>
                                ))}
                              </div>
                            )}
                            {touched.itemName && errors.itemName && (
                              <div className="error">{errors.itemName}</div>
                            )}
                            {/* {touched.itemName && stockData !== [] && (
                              <div>
                                {stockData.map((stock) => (
                                  <div key={stock._id}>{stock.itemName}</div>
                                ))}
                              </div>
                            )}
                            {touched.itemName && errors.itemName && (
                              <div className="error">{errors.itemName}</div>
                            )} */}
                          </>
                        ),
                      },
                      {
                        title: "Category",
                        dataIndex: "category",
                        render: (_, record, index) => (
                          <Select
                            name={`items.${index}.category`}
                            className="ant-input"
                            value={values.items[index].category || null} // Ensure null when no value is selected
                            onChange={(value) =>
                              setFieldValue(`items.${index}.category`, value)
                            }
                            placeholder="category"
                          >
                            {categories.map((cat) => (
                              <Option
                                key={cat._id}
                                value={cat.name.toLowerCase()}
                              >
                                {cat.name}
                              </Option>
                            ))}
                          </Select>
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
                              placeholder="Quantity"
                              onChange={(e) => {
                                handleChange(e);
                                const newQuantity = e.target.value;
                                const unitPrice =
                                  values.items[index].purchasePrice || 0;
                                const total = unitPrice * newQuantity;

                                // Update total for the item
                                setFieldValue(`items.${index}.total`, total);
                                // calculateGrandTotal(); // Recalculate the grand total
                              }}
                            />
                            {touched.itemName && errors.itemName && (
                              <div className="error">{errors.itemName}</div>
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
                            value={values.items[index].unit || null} // Ensure null when no value is selected
                            onChange={(value) =>
                              setFieldValue(`items.${index}.unit`, value)
                            }
                            placeholder="unit"
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
                            onClick={() => {
                              remove(index);
                              // calculateGrandTotal(); // Recalculate the grand total after removal
                            }}
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
                            category: "",
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

                  {/* Display total price */}
                  <div>
                    <Row gutter={1}>
                      {/* Total */}
                      <Col span={80}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <label>Total</label>
                          <Field
                            as={Input}
                            name={`total`}
                            className="ant-input"
                            readOnly
                            value={values.total || 0}
                            style={{ width: "50%" }} // Make input full width
                          />
                        </div>
                      </Col>

                      {/* Previous Balance */}
                      <Col span={80}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <label>Prev. Balance</label>
                          <Field
                            as={Input}
                            name={`prevBalance`}
                            className="ant-input"
                            readOnly
                            value={selctedSupplier?.balance || 0}
                            style={{ width: "50%" }} // Make input full width
                          />
                        </div>
                      </Col>

                      {/* Grand Total */}
                      <Col span={80}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <label>Grand Total</label>
                          <Field
                            as={Input}
                            name={`total`}
                            className="ant-input"
                            readOnly
                            value={
                              values.total + (selctedSupplier?.balance || 0) ||
                              0
                            }
                            style={{ width: "50%" }} // Make input full width
                          />
                        </div>
                      </Col>

                      {/* Paid */}
                      <Col span={80}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "13px",
                          }}
                        >
                          <label>Paid</label>
                          <Field
                            as={Input}
                            name={`paid`}
                            type="number"
                            className="ant-input"
                            onChange={(e) => {
                              setFieldValue("paid", e.target.value);
                              setFieldValue(
                                "balance",
                                values.total +
                                  (selctedSupplier?.balance || 0) -
                                  (e.target.value || 0) || 0
                              );
                            }}
                            value={values.paid || 0}
                            style={{ width: "50%" }} // Make input full width
                          />
                        </div>
                      </Col>

                      {/* Balance */}
                      <Col span={80}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "45px",
                          }}
                        >
                          <label>Balance</label>
                          <Field
                            as={Input}
                            name={`balance`}
                            className="ant-input"
                            readOnly
                            value={values.balance || 0}
                            style={{ width: "50%" }} // Make input full width
                          />
                        </div>
                      </Col>
                    </Row>
                  </div>
                </>
              )}
            </FieldArray>

            {/* Form Buttons */}
            <Row style={{ marginTop: 10, justifyContent: "end" }}>
              <Col>
                <Button
                  type="primary"
                  onClick={handleSubmit}
                  style={{ marginRight: 20 }}
                >
                  {!editingItem ? "Add" : "Update"}
                </Button>
                <Button onClick={onCancel} type="error">
                  Cancel
                </Button>
              </Col>
            </Row>
          </Form>
        );
      }}
    </Formik>
  );
};

export default BillingForm;
