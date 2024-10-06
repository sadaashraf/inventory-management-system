// routes/categoryRoutes.js
import { Router } from "express";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../Controller/category.controller.js";

const router = Router();

// @route GET /api/categories
router.get("/", getCategories);

// @route GET /api/categories/:id
router.get("/:id", getCategoryById);

// @route POST /api/categories
router.post("/", createCategory);

// @route PUT /api/categories/:id
router.put("/:id", updateCategory);

// @route DELETE /api/categories/:id
router.delete("/:id", deleteCategory);

export default router;
