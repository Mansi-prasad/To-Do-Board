import express from "express";
import { login, register } from "../controllers/userController.js";
import authMiddleware from "../middleware/auth.js";
const router = express.Router();

router.post("/auth", authMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    userInfo: req.user,
  });
});

router.post("/login", login);
router.post("/register", register);

export default router;
