const express = require("express");
const router = express.Router();

const admincontroller = require("../controllers/adminController");
const authcontroller = require("../middleware/authMiddleware");

router.post(
  "/create-admin",
  authcontroller.protect,
  authcontroller.authorizeRoles("superadmin"),
  admincontroller.createAdmin
);

router.post(
  "/create-user",
  authcontroller.protect,
  authcontroller.authorizeRoles("admin"),
  admincontroller.createUserByAdmin
);

router.put(
  "/update-role",
  authcontroller.protect,
  authcontroller.authorizeRoles("superadmin"),
  admincontroller.updateUserRole
);

module.exports = router;