 pullconst express = require('express');
const router = express.Router();

const admincontroller = require('../controllers/adminController');
const authcontroller = require('../middleware/authMiddleware');

// List users (superadmin or admin)
router.get('/', authcontroller.protect, authcontroller.authorizeRoles('superadmin','admin'), admincontroller.listUsers);

// Get single user (superadmin/admin or self)
router.get('/:id', authcontroller.protect, (req, res, next) => {
  if (req.user.role === 'superadmin' || req.user.role === 'admin' || req.user.id === req.params.id) return next();
  return res.status(403).json({ message: 'Access denied' });
}, admincontroller.getUser);

// Update user
router.put('/:id', authcontroller.protect, (req, res, next) => {
  if (req.user.role === 'superadmin' || req.user.role === 'admin' || req.user.id === req.params.id) return next();
  return res.status(403).json({ message: 'Access denied' });
}, admincontroller.updateUser);

// Deactivate user (admin/superadmin)
router.put('/:id/deactivate', authcontroller.protect, authcontroller.authorizeRoles('superadmin','admin'), admincontroller.deactivateUser);

module.exports = router;
