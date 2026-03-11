# Event Management System - Backend (v1.0)
This repository contains a minimal backend implementation for an Event Management System with three primary roles:

- Super Admin (platform owner)
- Vendor Admin (vendors who manage events)
- End User (event creators/participants)

Version: 1.0

Quick start

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file with `MONGO_URI` and `JWT_SECRET`.

3. Run in development:

```bash
npm run dev
```

4. Run tests (if present):

```bash
npm test
```

Overview

The backend provides APIs to manage users, vendors, events, expenses, incomes, subscriptions, and basic billing. It implements role-based access control so that `superadmin`, `admin`, `vendor`, and `user` have different permissions.

PART A — Super Admin

The Super Admin manages the entire platform: vendors, users, subscriptions, events monitoring, revenue tracking, and system configuration. Key responsibilities:

- Approve / activate / deactivate vendor accounts
- View and manage all vendors and users
- Monitor total events and platform activity
- Create and manage subscription plans
- Track revenue from paid transactions
- Configure global settings and access controls
- Generate platform-level reports and analytics

Dashboard (example): totals for vendors, users, events, active subscriptions, and total revenue (derived from paid transactions).

PART B — Vendor Admin

Vendors register and, after approval, manage their events and associated financials. Vendor Admin capabilities include:

- Registering vendor account (pending superadmin approval)
- Managing events and event-level finances
- Viewing subscription status and assigned plans

Note: the original Vendor Admin document referenced "refurbished electronic products" — that appears unrelated to this Event Management System. The code and APIs here focus on vendor-managed events rather than product catalogs. If you want product management features, confirm and I will adapt the Vendor Admin module accordingly.

PART C — End User

End users can register, create events, add expenses and incomes, and view event summaries with automatic profit/loss calculation.

Event flow (user):

1. Register / Login
2. Create Event (title, type, date, client, location, budget)
3. Add Expenses and Incomes under the event
4. View event summary (total expenses, total incomes, profit/loss)

Data models (high level)

- `User` — name, email, password, role (`superadmin|vendor|admin|user`), company (vendor info), subscription
- `Event` — title, type, date, location, client, budget, createdBy, vendor
- `Expense` / `Income` — event, title, amount, category/description, createdBy
- `SubscriptionPlan` — name, price, eventLimit, durationDays
- `Transaction` — vendor, amount, type (`invoice|payment`), status (`pending|paid|failed`)

API Reference (implemented endpoints)

Auth
- POST /api/auth/create-superadmin — create or promote a superadmin (public)
- POST /api/auth/register — register end user (public)
- POST /api/auth/login — login (public) — returns JWT
- GET /api/auth/me — get current user's profile (auth)
- POST /api/auth/change-password — change password (auth)
- POST /api/auth/forgot-password — request password reset (public)
- POST /api/auth/reset-password — reset password with token (public)

Admin (superadmin / admin)
- POST /api/admin/create-admin — create an admin (superadmin)
- POST /api/admin/create-user — create user as admin (admin)
- PUT /api/admin/update-role — update user's role (superadmin)
- GET /api/admin/dashboard — platform totals and revenue (superadmin)

Users
- GET /api/users — list users (admin, superadmin)
- GET /api/users/:id — get user (self or admin/superadmin)
- PUT /api/users/:id — update user (self or admin/superadmin)
- PUT /api/users/:id/deactivate — deactivate user (admin/superadmin)

Vendors
- POST /api/vendor/register — vendor registration (public, status pending)
- GET /api/vendor/ — list vendors (superadmin)
- GET /api/vendor/:id — vendor profile (not implemented separately; use `/api/users/:id`)
- PUT /api/vendor/approve/:id — approve vendor (superadmin)
- PUT /api/vendor/deactivate/:id — deactivate vendor (superadmin)

Subscriptions
- POST /api/subscriptions/plans — create plan (superadmin)
- GET /api/subscriptions/plans — list plans (superadmin)
- POST /api/subscriptions/assign — assign plan to vendor (superadmin)
- GET /api/subscriptions/vendor/:id — get vendor subscription (vendor or superadmin)

Events & Financials
- POST /api/events — create event (auth: user/vendor/superadmin)
- GET /api/events — list events with simple filters (auth)
- GET /api/events/:id — get event details (auth)
- PUT /api/events/:id — update event (auth)
- DELETE /api/events/:id — delete event (auth)
- POST /api/events/:eventId/expenses — add expense (auth)
- PUT /api/events/:eventId/expenses/:expenseId — update expense (not implemented — suggested)
- DELETE /api/events/:eventId/expenses/:expenseId — delete expense (not implemented — suggested)
- POST /api/events/:eventId/incomes — add income (auth)
- PUT /api/events/:eventId/incomes/:incomeId — update income (not implemented — suggested)
- DELETE /api/events/:eventId/incomes/:incomeId — delete income (not implemented — suggested)
- GET /api/events/:id/summary — event totals and profit/loss (auth)

Billing & Transactions
- POST /api/billing/invoices — create invoice (superadmin)
- GET /api/billing/invoices — list invoices (superadmin/vendor)
- GET /api/billing/invoices/:id — get invoice detail (superadmin/vendor)
- PUT /api/billing/invoices/:id/pay — mark invoice paid (superadmin)
- GET /api/billing/transactions — list transactions (superadmin/vendor)

Postman collection

See `postman_collection.json` for a ready collection. It includes variables:

- `base_url` — API base URL (default: http://localhost:5000)
- `token` — set to `{{token}}` returned from login; include as `Authorization: Bearer {{token}}` for protected requests

Notes, gaps and suggestions

- The code now implements dashboard, user CRUD, extended event CRUD, invoice listing, and auth password flows (forgot/reset/change).
- Missing but recommended: payment gateway integration, webhook endpoints for payment provider callbacks, audit/logging endpoints, and full pagination/filtering on list endpoints.
- Some endpoints noted in documentation (update/delete expense/income) are suggested but not yet implemented — they can be added similarly to existing controllers.
- Consider adding input validation (Joi/express-validator), rate limiting, and request schemas for production readiness.

Next steps

- Run basic sanity checks (start server and exercise endpoints) — I can run these for you now if you want.
- Generate OpenAPI/Swagger spec from the routes.
- Add more comprehensive tests and CI integration.

Contact

If you want me to generate an OpenAPI spec or run the server and smoke-test the endpoints, tell me which to do next.
