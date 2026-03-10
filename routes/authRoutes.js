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

module.exports = router;