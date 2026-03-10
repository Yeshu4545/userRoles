const express = require("express");
const router = express.Router();
const { updateUserRole } = require("../controllers/adminController");

const {
  createAdmin,
  createUserByAdmin
} = require("../controllers/adminController");

const {
  verifyToken,
  authorizeRoles
} = require("../middleware/authMiddleware");

router.post(
  "/create-admin",
  verifyToken,
  authorizeRoles("superadmin"),
  createAdmin
);

router.post(
  "/create-user",
  verifyToken,
  authorizeRoles("admin"),
  createUserByAdmin
);

router.put(
  "/update-role",
  verifyToken,
  authorizeRoles("superadmin"),
  updateUserRole
);
module.exports = router;