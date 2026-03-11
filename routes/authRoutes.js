const express = require("express");
const router = express.Router();

const {
  registerUser,
  login,
  createSuperAdmin
} = require("../controllers/authController");

router.post("/create-superadmin", createSuperAdmin);
router.post("/register", registerUser);
router.post("/login", login);

const authcontroller = require('../middleware/authMiddleware');
const { getMe, changePassword, forgotPassword, resetPassword } = require('../controllers/authController');

router.get('/me', authcontroller.protect, getMe);
router.post('/change-password', authcontroller.protect, changePassword);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;