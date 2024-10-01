import Department from "../Models/Department.js";

// Create a new department
export const createDepartment = async (req, res) => {
  const { name, manager, phoneNo } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Department name is required" });
  }

  try {
    const newDepartment = new Department({ name, manager, phoneNo });
    await newDepartment.save();
    res.status(201).json(newDepartment);
  } catch (error) {
    res.status(500).json({ message: "Error creating department", error: error.message });
  }
};

// Get all departments
export const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find({});
    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching departments", error: error.message });
  }
};

// Get department by ID
export const getDepartmentById = async (req, res) => {
  const { id } = req.params;

  try {
    const department = await Department.findById(id).populate('issuedItems')
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.status(200).json(department);
  } catch (error) {
    res.status(500).json({ message: "Error fetching department", error: error.message });
  }
};

// Update department by ID
export const updateDepartmentById = async (req, res) => {
  const { id } = req.params;
  const { name,manager, phoneNo } = req.body;

  try {
    const updatedDepartment = await Department.findByIdAndUpdate(
      id,
      { name, manager, phoneNo, order },
      { new: true }
    );

    if (!updatedDepartment) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.status(200).json(updatedDepartment);
  } catch (error) {
    res.status(500).json({ message: "Error updating department", error: error.message });
  }
};

// Delete department by ID
export const deleteDepartmentById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedDepartment = await Department.findByIdAndDelete(id);
    if (!deletedDepartment) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.status(200).json({ message: "Department deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting department", error: error.message });
  }
};
