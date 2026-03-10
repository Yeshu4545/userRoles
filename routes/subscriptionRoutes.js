const express = require("express");
const router = express.Router();

const subscriptioncontroller = require("../controllers/subscriptionController");
const authcontroller = require("../middleware/authMiddleware");

// Plan management - superadmin only
router.post("/plans", authcontroller.protect, authcontroller.authorizeRoles("superadmin"), subscriptioncontroller.createPlan);
router.get("/plans", authcontroller.protect, authcontroller.authorizeRoles("superadmin"), subscriptioncontroller.listPlans);

// Assign plan to vendor - superadmin
router.post("/assign", authcontroller.protect, authcontroller.authorizeRoles("superadmin"), subscriptioncontroller.assignPlanToVendor);

// Get vendor subscription - superadmin or vendor (self)
router.get("/vendor/:id", authcontroller.protect, (req, res, next) => {
  // allow vendor to fetch their own subscription or superadmin
  if (req.user.role === "superadmin" || req.user.id === req.params.id) return next();
  return res.status(403).json({ message: "Access denied" });
}, subscriptioncontroller.getVendorSubscription);

module.exports = router;
