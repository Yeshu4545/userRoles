const SubscriptionPlan = require("../models/SubscriptionPlan");
const User = require("../models/User");

exports.createPlan = async (req, res) => {
  try {
    const { name, description, price, eventLimit, durationDays } = req.body;
    if (!name) return res.status(400).json({ message: "Plan name required" });

    const plan = await SubscriptionPlan.create({ name, description, price, eventLimit, durationDays });
    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.listPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find();
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.assignPlanToVendor = async (req, res) => {
  try {
    const { vendorId, planId } = req.body;
    if (!vendorId || !planId) return res.status(400).json({ message: "vendorId and planId are required" });

    const vendor = await User.findById(vendorId);
    if (!vendor || vendor.role !== "vendor") return res.status(404).json({ message: "Vendor not found" });

    const plan = await SubscriptionPlan.findById(planId);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    // Calculate expiry
    const now = new Date();
    const expiresAt = plan.durationDays && plan.durationDays > 0 ? new Date(now.getTime() + plan.durationDays * 24 * 60 * 60 * 1000) : null;

    vendor.subscription = { plan: plan._id, expiresAt };
    await vendor.save();

    res.json({ message: "Plan assigned to vendor", vendor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getVendorSubscription = async (req, res) => {
  try {
    const vendorId = req.params.id;
    const vendor = await User.findById(vendorId).populate("subscription.plan");
    if (!vendor || vendor.role !== "vendor") return res.status(404).json({ message: "Vendor not found" });

    res.json({ subscription: vendor.subscription });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
