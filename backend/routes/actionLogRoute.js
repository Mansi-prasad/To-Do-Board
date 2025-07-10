import express from "express";
import { getRecentActions } from "../controllers/actionLogController.js";
import authMiddelware from "../middleware/auth.js";
const router = express.Router();
router.get("/", authMiddelware, getRecentActions);

export default router;
