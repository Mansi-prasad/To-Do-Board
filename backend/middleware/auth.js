import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized! Login again" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ success: false, message: "Token missing." });
  }
  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { _id: token_decode.id };
    next();
  } catch (err) {
    console.log("JWT verification failed:", err);
    res
      .status(500)
      .json({ success: false, message: "ERROR! Invalid or expired token." });
  }
};
export default authMiddleware;
