const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const generateToken = require("../config/token");

/**
 * Register user controller ******************************************************************************************
 * @description Register user with email, phone and password
 */
const registerUser = async (req, res) => {
  const { username, email, phone, password, role = "user" } = req.body;
  console.log(username, email, phone, password, role);

  if (!username || !email || !phone || !password) {
    return res.status(400).json({
      success: false,
      message: "Please Provide Username, Email, Phone and Password",
    });
  }

  const isUserAlreadyExists = await userModel.findOne({
    $or: [{ email }, { username }, { phone }],
  });

  if (isUserAlreadyExists?.username == username) {
    return res.status(400).json({
      success: false,
      message: "User already exists with this username",
    });
  }

  if (
    isUserAlreadyExists?.email == email ||
    isUserAlreadyExists?.phone == phone
  ) {
    return res.status(400).json({
      success: false,
      message: "User already exists with this email or phone",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Create User ******
  const user = await userModel.create({
    username,
    email,
    phone,
    password: hashedPassword,
    role,
  });

  // generate token ******
  const token = generateToken(user);

  // Set Token in Cookie
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      userId: user._id,
      username,
      email,
      phone,
      role,
      token,
    },
  });
};

/**
 * Login user controller ******************************************************************************************
 * @description Login user with email, phone and password
 */

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please Provide Email and Password",
    });
  }

  const user = await userModel.findOne({ email });

  console.log(user);

  if (user?.email !== email) {
    return res.status(400).json({
      success: false,
      message: "Invalid Email",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({
      success: false,
      message: "Invalid Password",
    });
  }
  
  // generate token ******
  const token = generateToken(user);

  // Set Token in Cookie
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  });


  res.status(200).json({
    success: true,
    message: "User logged in successfully",
    data: {
      userId: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token,
    },
  });

};

module.exports = {
  registerUser,
  loginUser,
};
