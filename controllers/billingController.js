const Transaction = require("../models/Transaction");
const User = require("../models/User");

// Create an invoice (placeholder)
exports.createInvoice = async (req, res) => {
  try {
    const { vendorId, amount, description } = req.body;
    if (!vendorId || !amount) return res.status(400).json({ message: "vendorId and amount are required" });

    const vendor = await User.findById(vendorId);
    if (!vendor || vendor.role !== "vendor") return res.status(404).json({ message: "Vendor not found" });

    const tx = await Transaction.create({ vendor: vendorId, amount, type: "invoice", description });
    res.status(201).json(tx);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark invoice as paid (placeholder)
exports.markPaid = async (req, res) => {
  try {
    const { id } = req.params;
    const tx = await Transaction.findById(id);
    if (!tx) return res.status(404).json({ message: "Transaction not found" });

    tx.status = "paid";
    await tx.save();
    res.json(tx);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.listTransactions = async (req, res) => {
  try {
    const { vendorId } = req.query;
    const q = vendorId ? { vendor: vendorId } : {};
    const txs = await Transaction.find(q).populate("vendor", "name email");
    res.json(txs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
