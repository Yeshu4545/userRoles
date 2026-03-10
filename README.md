# Event Management System - Backend (v1.0)

This repository contains a minimal backend implementation for an Event Management System with roles: Super Admin, Vendor Admin, and End User.

Quick start

1. Install dependencies:
```bash
npm install
```
2. Create a `.env` file with `MONGO_URI` and `JWT_SECRET` (a sample `.env` exists).
3. Run in development:
```bash
npm run dev
```
4. Run tests:
```bash
npm test
```

API highlights
- `POST /api/auth/create-superadmin` — create or promote a user to superadmin (one-time)
- `POST /api/auth/login` — login to receive JWT token
- `POST /api/vendor/register` — vendor registration (pending approval)
- `PUT /api/vendor/approve/:id` — approve vendor (superadmin)
- `POST /api/subscriptions/plans` — create subscription plan (superadmin)
- `POST /api/subscriptions/assign` — assign plan to vendor (superadmin)
- `POST /api/events` — create event (authenticated)
- `POST /api/events/:eventId/expenses` — add expense
- `POST /api/events/:eventId/incomes` — add income
- `GET /api/events/:id/summary` — event financial summary

Billing placeholder endpoints
- `POST /api/billing/invoices` — create invoice (superadmin)
- `PUT /api/billing/invoices/:id/pay` — mark invoice paid (superadmin)

Postman collection
See `postman_collection.json` for a minimal collection to get started.

Next steps
- Add CI, tests, and full API documentation
- Add payments integration and billing workflows
