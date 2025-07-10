import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// create token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "2h" });
};
// User login
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User doesn't exists" });
    }
    //password matching
    const isPassMatch = await bcrypt.compare(password, user.password);
    if (!isPassMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password." });
    }
    const token = createToken(user._id);
    res.status(200).json({ success: true, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "ERROR!" });
  }
};

//Register user
const register = async (req, res) => {
  const { name, password, email } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "User already exists!",
    });
  }
  // Validating User's email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format!",
    });
  }
  const passwordRegex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      success: false,
      message:
        "Password must be at least 8 characters long and contain at least one special character (!@#$%^&*).",
    });
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    const user = await newUser.save();
    //take the user id and generate token
    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error. Please try again.",
    });
  }
};
export { login, register };
