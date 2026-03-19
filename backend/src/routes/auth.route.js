const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/auth.controller");



/** 
 * @desc    Register a new user
 * @route   POST /api/auth/register
*/
router.post("/register", registerUser);


/** 
 * @desc    Login user
 * @route   POST /api/auth/login
*/
router.post("/login", loginUser);

module.exports = router;
