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

exports.listEvents = async (req, res) => {
  try {
    const q = {};
    if (req.query.createdBy) q.createdBy = req.query.createdBy;
    if (req.query.vendor) q.vendor = req.query.vendor;
    if (req.query.type) q.type = req.query.type;

    const Event = require('../models/Event');
    const events = await Event.find(q).sort({ createdAt: -1 }).limit(100);
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEvent = async (req, res) => {
  try {
    const Event = require('../models/Event');
    const event = await Event.findById(req.params.id).populate('createdBy', 'name email').populate('vendor', 'name email');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const Event = require('../models/Event');
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const { title, type, date, location, client, budget } = req.body;
    if (title) event.title = title;
    if (type) event.type = type;
    if (date) event.date = date;
    if (location) event.location = location;
    if (client) event.client = client;
    if (budget !== undefined) event.budget = budget;

    await event.save();
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const Event = require('../models/Event');
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    await event.remove();
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
