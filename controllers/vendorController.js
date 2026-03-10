const User = require("../models/User");

exports.registerVendor = async (req, res) => {
  try {
    const { name, email, password, company } = req.body;

    if (!name || !email || !password || !company?.name) {
      return res.status(400).json({ message: "Name, email, password and company.name are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const bcrypt = require("bcryptjs");
    const hashed = await bcrypt.hash(password, 10);

    const vendor = await User.create({
      name,
      email,
      password: hashed,
      role: "vendor",
      status: "pending",
      company,
      createdBy: null
    });

    res.status(201).json({ message: "Vendor registered, awaiting approval", vendor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.listVendors = async (req, res) => {
  try {
    const vendors = await User.find({ role: "vendor" }).select("name email status company createdAt");
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.approveVendor = async (req, res) => {
  try {
    const vendorId = req.params.id;
    const vendor = await User.findById(vendorId);
    if (!vendor || vendor.role !== "vendor") return res.status(404).json({ message: "Vendor not found" });

    vendor.status = "active";
    await vendor.save();
    res.json({ message: "Vendor approved", vendor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deactivateVendor = async (req, res) => {
  try {
    const vendorId = req.params.id;
    const vendor = await User.findById(vendorId);
    if (!vendor || vendor.role !== "vendor") return res.status(404).json({ message: "Vendor not found" });

    vendor.status = "deactivated";
    await vendor.save();
    res.json({ message: "Vendor deactivated", vendor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
