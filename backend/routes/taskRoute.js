import express from "express";
import {
  createTask,
  getAllTask,
  updateTask,
  deleteTask,
  changeTaskStatus,
} from "../controllers/taskController.js";
import authMiddleware from "../middleware/auth.js";
const router = express.Router();
router.put("/:id/status", authMiddleware, changeTaskStatus);

router.put("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, deleteTask);
router.get("/", authMiddleware, getAllTask);
router.post("/", authMiddleware, createTask);

export default router;
