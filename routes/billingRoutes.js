const express = require("express");
const router = express.Router();

const billingcontroller = require("../controllers/billingController");
const authcontroller = require("../middleware/authMiddleware");

// Create invoice - superadmin
router.post("/invoices", authcontroller.protect, authcontroller.authorizeRoles("superadmin"), billingcontroller.createInvoice);

// Mark invoice paid - superadmin
router.put("/invoices/:id/pay", authcontroller.protect, authcontroller.authorizeRoles("superadmin"), billingcontroller.markPaid);

// List transactions - superadmin or vendor (self)
router.get("/transactions", authcontroller.protect, (req, res, next) => {
  if (req.user.role === "superadmin" || req.user.role === "vendor") return next();
  return res.status(403).json({ message: "Access denied" });
}, billingcontroller.listTransactions);

module.exports = router;
