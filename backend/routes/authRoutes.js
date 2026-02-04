const express = require("express");
const { body } = require("express-validator");
const {
    register,
    login,
    getCurrentUser,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Validation rules
const registerValidation = [
    body("email")
        .isEmail()
        .withMessage("Please provide a valid email")
        .normalizeEmail(),
    body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 6 characters long"),
];

const loginValidation = [
    body("email")
        .isEmail()
        .withMessage("Please provide a valid email")
        .normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
];

// Routes
router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.get("/me", authMiddleware, getCurrentUser);

module.exports = router;
