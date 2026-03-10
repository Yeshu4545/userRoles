const express = require("express");
const router = express.Router();

const vendorcontroller = require("../controllers/vendorController");
const authcontroller = require("../middleware/authMiddleware");

// Public: vendor registration
router.post("/register", vendorcontroller.registerVendor);

// Protected admin actions (superadmin)
router.get("/", authcontroller.protect, authcontroller.authorizeRoles("superadmin"), vendorcontroller.listVendors);
router.put("/approve/:id", authcontroller.protect, authcontroller.authorizeRoles("superadmin"), vendorcontroller.approveVendor);
router.put("/deactivate/:id", authcontroller.protect, authcontroller.authorizeRoles("superadmin"), vendorcontroller.deactivateVendor);

module.exports = router;
