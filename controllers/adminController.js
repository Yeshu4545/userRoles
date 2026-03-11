const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.createAdmin = async (req, res) => {

  try {
    const { name, email, password } = req.body;

    // Input validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
      createdBy: req.user.id
    });

    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createUserByAdmin = async (req, res) => {

  try {
    const { name, email, password } = req.body;

    // Input validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
      createdBy: req.user.id
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {

    const { userId, role } = req.body;

    const allowedRoles = ["admin", "superadmin", "user"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid role"
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    user.role = role;

    await user.save();

    res.json({
      message: "User role updated successfully",
      user
    });

  } catch (error) {
    res.status(500).json(error.message);
  }
};

exports.dashboard = async (req, res) => {
  try {
    const User = require('../models/User');
    const Event = require('../models/Event');
    const SubscriptionPlan = require('../models/SubscriptionPlan');
    const Transaction = require('../models/Transaction');

    const totalVendors = await User.countDocuments({ role: 'vendor' });
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalEvents = await Event.countDocuments();
    const activeSubscriptions = await User.countDocuments({ 'subscription.plan': { $ne: null } });

    // simple revenue: sum of paid transactions
    const revenueAgg = await Transaction.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalRevenue = (revenueAgg[0] && revenueAgg[0].total) || 0;

    res.json({ totalVendors, totalUsers, totalEvents, activeSubscriptions, totalRevenue });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.listUsers = async (req, res) => {
  try {
    const User = require('../models/User');
    const q = {};
    if (req.query.role) q.role = req.query.role;
    const users = await User.find(q).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const User = require('../models/User');
    const { name, email, company } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (name) user.name = name;
    if (email) user.email = email;
    if (company) user.company = company;
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deactivateUser = async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.status = 'deactivated';
    await user.save();
    res.json({ message: 'User deactivated', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};