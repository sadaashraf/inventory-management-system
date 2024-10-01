import Supplier from "../Models/Supplier.js";

export const createSupplier = async (req, res) => {
  try {
    const newSupplier = new Supplier(req.body); // Create a new Supplier object from the request body
    const savedSupplier = await newSupplier.save(); // Save the supplier to the database
    res.status(201).json(savedSupplier); // Return the saved supplier
  } catch (err) {
    res.status(500).json({ error: err.message }); // Handle errors
  }
};

export const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().populate('order'); // Fetch all suppliers from the database
    res.status(200).json(suppliers); // Return the list of suppliers
  } catch (err) {
    res.status(500).json({ error: err.message }); // Handle errors
  }
};

export const getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id).populate('order'); // Find supplier by ID
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" }); // Return 404 if supplier is not found
    }
    res.status(200).json(supplier); // Return the found supplier
  } catch (err) {
    res.status(500).json({ error: err.message }); // Handle errors
  }
};
export const updateSupplierById = async (req, res) => {
  try {
    const updatedSupplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ); // Update the supplier
    if (!updatedSupplier) {
      return res.status(404).json({ message: "Supplier not found" }); // Return 404 if supplier is not found
    }
    res.status(200).json(updatedSupplier); // Return the updated supplier
  } catch (err) {
    res.status(500).json({ error: err.message }); // Handle errors
  }
};

export const deleteSupplierById = async (req, res) => {
  try {
    const deletedSupplier = await Supplier.findByIdAndDelete(req.params.id); // Delete the supplier
    if (!deletedSupplier) {
      return res.status(404).json({ message: "Supplier not found" }); // Return 404 if supplier is not found
    }
    res.status(200).json({ message: "Supplier deleted successfully" }); // Return success message
  } catch (err) {
    res.status(500).json({ error: err.message }); // Handle errors
  }
};
