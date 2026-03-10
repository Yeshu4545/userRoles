const Event = require("../models/Event");
const Expense = require("../models/Expense");
const Income = require("../models/Income");

exports.createEvent = async (req, res) => {
  try {
    const { title, type, date, location, client, budget } = req.body;
    if (!title || !type) return res.status(400).json({ message: "Title and type are required" });

    const event = await Event.create({
      title,
      type,
      date,
      location,
      client,
      budget,
      createdBy: req.user.id
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addExpense = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { title, category, amount, description } = req.body;
    if (!title || !amount) return res.status(400).json({ message: "Title and amount are required" });

    const expense = await Expense.create({
      event: eventId,
      title,
      category,
      amount,
      description,
      createdBy: req.user.id
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addIncome = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { title, amount, description } = req.body;
    if (!title || !amount) return res.status(400).json({ message: "Title and amount are required" });

    const income = await Income.create({
      event: eventId,
      title,
      amount,
      description,
      createdBy: req.user.id
    });

    res.status(201).json(income);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEventSummary = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const expenses = await Expense.find({ event: id });
    const incomes = await Income.find({ event: id });

    const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);
    const totalIncome = incomes.reduce((s, i) => s + i.amount, 0);
    const profitLoss = (totalIncome - totalExpense);

    res.json({ event, totals: { totalExpense, totalIncome, profitLoss }, expenses, incomes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
