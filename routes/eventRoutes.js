const express = require("express");
const router = express.Router();

const eventcontroller = require("../controllers/eventController");
const authcontroller = require("../middleware/authMiddleware");

// Users (and vendors) can create events
router.post("/", authcontroller.protect, authcontroller.authorizeRoles("user","vendor","superadmin"), eventcontroller.createEvent);

// Extended event management
router.get('/', authcontroller.protect, authcontroller.authorizeRoles('user','vendor','admin','superadmin'), eventcontroller.listEvents);
router.get('/:id', authcontroller.protect, authcontroller.authorizeRoles('user','vendor','admin','superadmin'), eventcontroller.getEvent);
router.put('/:id', authcontroller.protect, authcontroller.authorizeRoles('user','vendor','admin','superadmin'), eventcontroller.updateEvent);
router.delete('/:id', authcontroller.protect, authcontroller.authorizeRoles('user','vendor','admin','superadmin'), eventcontroller.deleteEvent);

// Add expense or income to an event
router.post("/:eventId/expenses", authcontroller.protect, authcontroller.authorizeRoles("user","vendor","superadmin"), eventcontroller.addExpense);
router.post("/:eventId/incomes", authcontroller.protect, authcontroller.authorizeRoles("user","vendor","superadmin"), eventcontroller.addIncome);

router.get("/:id/summary", authcontroller.protect, authcontroller.authorizeRoles("user","vendor","superadmin"), eventcontroller.getEventSummary);

module.exports = router;
