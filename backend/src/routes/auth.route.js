const express = require("express");
const router = express.Router();

// Import Auth Controllers
const { 
    registerUser, 
    loginUser, 
    logOutUser,
    getUserProfile 
} = require("../controllers/auth.controller");

// Import Auth Middlewares
const authMiddleware = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/role.middleware");



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


/** 
 * @desc    LogOut user (clears auth cookie) + Add Token in Blacklist
 * @route   GET /api/auth/logout
*/
router.get("/logout" , logOutUser)


/** 
 * @desc    Get User Profile
 * @route   POST /api/auth/getProfile
*/
router.get("/getProfile", authMiddleware, authorizeRoles("user"), getUserProfile)


module.exports = router;
