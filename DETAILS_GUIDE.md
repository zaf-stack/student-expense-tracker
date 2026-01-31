# Student Expense Tracker - Details Guide

This document describes the current structure, features, and responsibilities of each folder/file in this web application.

## Overview
Student Expense Tracker is a React (Create React App) single-page application for tracking daily expenses, visualizing analytics, and generating a personalized budget plan. It uses localStorage for persistence and does not include a backend server.

## Tech Stack (Current)
- React 19 + Create React App
- React Router for routing
- Material UI (MUI) for UI components
- Tailwind CSS (config present, utility classes used sparingly)
- Recharts for charts
- date-fns for date utilities
- react-hook-form for form handling
- react-toastify + SweetAlert2 for alerts/notifications
- xlsx + jsPDF for export (Excel/PDF)
- bcryptjs for hashing passwords in localStorage
- Framer Motion for animations
- Puppeteer for screenshot automation

## Current Features
- Authentication (localStorage based)
  - Signup, login, logout
  - Passwords are hashed with bcryptjs and stored in localStorage
  - Protected routes + redirect back to last page after login
- Dashboard
  - Total expenses overview
  - Monthly trend chart
  - Category distribution chart
  - Recent transactions list
  - Add expense modal (desktop + mobile trigger)
  - Editable monthly budget stored in localStorage
- Daily Usage (expense CRUD)
  - Add, edit, delete expenses
  - Category summary
  - Responsive view with recent transactions on mobile
  - Data stored in localStorage under `dailyExpenses`
- Analytics & Reporting
  - Monthly analysis view
  - Spending trends view
  - Export to Excel / PDF
- Budget Planning (AI)
  - Multi-step wizard
  - Uses Google Gemini API to generate financial advice
  - Shows structured plan (summary, budget allocation, risk, investment, debt, action plan)
- Profile Page
  - Update name + profile photo (local file, stored in localStorage)
  - Change password
  - Delete account
- Responsive layout with sidebar (desktop) and drawer/bottom nav (mobile)

## Folder Structure (Accurate)

```
student-expense-tracker/
|-- public/
|   |-- cost-management.png
|   |-- favicon.ico
|   |-- index.html
|   |-- logo192.png
|   |-- logo512.png
|   |-- manifest.json
|   `-- robots.txt
|-- screenshots/
|-- src/
|   |-- components/
|   |   |-- Analytics/
|   |   |   |-- AnalyticsPage.js
|   |   |   |-- ExportOptions.js
|   |   |   |-- MonthlyAnalysis.js
|   |   |   `-- SpendingTrends.js
|   |   |-- BudgetPlanning/
|   |   |   |-- BudgetPlanningPage.js
|   |   |   |-- BudgetResult.js
|   |   |   |-- BudgetWizard.js
|   |   |   |-- ChatGPTService.js
|   |   |   `-- WizardSteps.js
|   |   |-- common/
|   |   |   |-- Layout.js
|   |   |   `-- Layout2.js
|   |   |-- DailyUsage/
|   |   |   |-- AddExpenseForm.js
|   |   |   |-- Calculator.js
|   |   |   |-- CategorySummary.js
|   |   |   |-- DailyUsagePage.js
|   |   |   |-- EditExpenseModal.js
|   |   |   |-- ExpenseList.js
|   |   |   `-- ExpenseList2.js
|   |   |-- Dashboard/
|   |   |   |-- DashboardPage.js
|   |   |   |-- ExpenseDistribution.js
|   |   |   |-- MonthlyTrend.js
|   |   |   |-- OverviewCards.js
|   |   |   `-- RecentTransactions.js
|   |   `-- ExportButtons.js
|   |-- context/
|   |   `-- AuthContext.js
|   |-- hooks/
|   |   `-- useAnalytics.js
|   |-- pages/
|   |   |-- Login.js
|   |   |-- ProfilePage.js
|   |   `-- Signup.js
|   |-- utils/
|   |   |-- BudgetLogic.js
|   |   |-- exportUtils.js
|   |   `-- validationUtils.js
|   |-- App.css
|   |-- App.js
|   |-- App.test.js
|   |-- index.css
|   |-- index.js
|   |-- logo.svg
|   |-- reportWebVitals.js
|   `-- setupTests.js
|-- .gitignore
|-- capture_screenshots.js
|-- package-lock.json
|-- package.json
|-- postcss.config.js
|-- PROJECT_DETAILS.md
|-- README.md
|-- student-expense-tracker.zip
|-- tailwind.config.js
`-- test_gemini_api.js
```

## Folder/Files Detail Explanation (Har Folder Ka Detail)

### public/
- Static assets used by CRA at build time. `index.html` is the HTML shell.
- Icons and manifest enable basic PWA setup.

### screenshots/
- Auto-captured UI screenshots (generated via `capture_screenshots.js`).

### src/
Main application source code.

#### src/components/
UI building blocks grouped by feature.

- Analytics/
  - AnalyticsPage.js: top-level analytics screen with tabs.
  - MonthlyAnalysis.js + SpendingTrends.js: charts and insights.
  - ExportOptions.js: export menu for Excel/PDF in analytics page.

- BudgetPlanning/
  - BudgetPlanningPage.js: handles wizard + result view.
  - BudgetWizard.js + WizardSteps.js: multi-step form flow.
  - BudgetResult.js: renders AI response and computed insights.
  - ChatGPTService.js: calls Google Gemini API to generate advice.

- common/
  - Layout.js: app shell (app bar, sidebar, mobile nav, route outlet).
  - Layout2.js: alternate layout (currently not used in App.js).

- DailyUsage/
  - AddExpenseForm.js: add expense form + validation.
  - EditExpenseModal.js: modal to edit an expense.
  - ExpenseList.js / ExpenseList2.js: table views for expenses.
  - CategorySummary.js: summary by category.
  - DailyUsagePage.js: orchestrates expense CRUD and layout.
  - Calculator.js: quick calculator widget.

- Dashboard/
  - DashboardPage.js: main dashboard with charts and add-expense modal.
  - OverviewCards.js: total spending + budget cards.
  - MonthlyTrend.js + ExpenseDistribution.js: charts (Recharts).
  - RecentTransactions.js: list of recent expenses.

- ExportButtons.js
  - Legacy export UI (uses utils/exportUtils). Not used by AnalyticsPage.

#### src/context/
- AuthContext.js: localStorage-based auth provider (signup/login/logout), profile updates, password change, delete account, and route redirects.

#### src/hooks/
- useAnalytics.js: transforms expense list into monthly, daily average, and category trend datasets.

#### src/pages/
- Login.js: login UI with validations and password visibility toggle.
- Signup.js: account creation form (name/email/password).
- ProfilePage.js: profile update, photo upload, password change, delete account.

#### src/utils/
- BudgetLogic.js: helper functions for 50/30/20 calculations + projections.
- exportUtils.js: Excel/PDF export helpers using xlsx + jsPDF.
- validationUtils.js: shared validation utilities for expense forms.

#### Core Entry Files
- App.js: routes, theming, auth guards, and page mapping.
- index.js / index.css / App.css: app bootstrap + global styles.
- reportWebVitals.js / setupTests.js: CRA defaults.

### Root Files
- package.json / package-lock.json: dependencies and scripts.
- tailwind.config.js / postcss.config.js: Tailwind + PostCSS config.
- capture_screenshots.js: Puppeteer script to auto-capture UI screens.
- test_gemini_api.js: standalone Gemini API test script.
- README.md / PROJECT_DETAILS.md: existing documentation.
- student-expense-tracker.zip: zipped project archive.

## LocalStorage Keys (Current)
- `users`: registered users list
- `currentUser`: logged in user
- `redirectPath`: last protected path before login
- `dailyExpenses`: expense list
- `monthlyBudget`: budget value

## Notes / Limitations
- No backend or database. All data is stored in browser localStorage.
- Gemini API key is stored in source (see `ChatGPTService.js`). Consider moving to environment variables for production.

## Run Commands
- Start dev server: `npm start`
- Build: `npm run build`
- Tests: `npm test`
