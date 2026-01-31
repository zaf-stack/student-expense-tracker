# Student Expense Manager - Project Guide

This document provides a detailed overview of the Student Expense Manager web application, including its folder structure, current features, and a comprehensive explanation of the codebase organization.

## 1. Project Overview

The **Student Expense Manager** is a React-based web application designed to help students manage their finances effectively. It features intuitive expense tracking, budget planning assistance (powered by AI), detailed analytics, and a user-friendly dashboard.

**Key Technologies:**
-   **Frontend Framework**: React
-   **UI Library**: Material UI (MUI)
-   **Styling**: Tailwind CSS & Emotion
-   **Charts & Visualization**: Recharts
-   **Routing**: React Router DOM
-   **State Management**: React Context API
-   **Utilities**: Date-fns, JSPDF, XLSX, SweetAlert2

---

## 2. Accurate Folder Structure

The following tree represents the primary directory structure of the `src` folder:

```
src/
├── components/             # Reusable UI components and feature-specific logic
│   ├── Analytics/          # Components for data visualization and analysis
│   ├── BudgetPlanning/     # Components for the budget creation wizard
│   ├── Common/             # Shared components (e.g., Layout)
│   ├── DailyUsage/         # Components for daily expense tracking
│   └── Dashboard/          # Components for the main dashboard view
├── context/                # React Context definitions (e.g., AuthContext)
├── hooks/                  # Custom React hooks (e.g., useAnalytics)
├── pages/                  # Main page components corresponding to routes
├── utils/                  # Helper functions and utilities
├── App.js                  # Main application component & routing setup
├── index.js                # Entry point of the application
└── ...                     # Other configuration files
```

---

## 3. Current Features

The application currently supports the following key features:

### 🔐 Authentication & Profile
-   **User Signup & Login**: Secure account creation and authentication.
-   **Profile Management**: View and manage user profile details.

### 📊 Dashboard
-   **Overview Cards**: Quick summary of total budget, spending, and remaining balance.
-   **Recent Transactions**: List of the latest expenses.
-   **Expense Distribution**: Visual breakdown of spending by category.
-   **Monthly Trends**: Graph showing spending patterns over time.

### 📝 Daily Usage (Expense Tracking)
-   **Expense Logging**: Add, edit, and delete daily expenses with details like category, amount, and date.
-   **Calculator**: Built-in calculator for quick usage.
-   **Category Summary**: View spending totals per category.
-   **Expense List**: Detailed history of all recorded transactions.

### 💰 Budget Planning (AI-Powered)
-   **Budget Wizard**: A step-by-step wizard to collect personal financial data, goals, and risk preferences.
-   **AI Recommendations**: Integration with ChatGPT (Simulated/Actual) to generate personalized financial advice and budget plans.
-   **Budget Results**: Detailed view of the generated budget plan.

### 📈 Analytics & Reports
-   **Spending Trends**: Detailed charts visualizing spending habits.
-   **Monthly Analysis**: Deep dive into monthly financial performance.
-   **Data Export**: Ability to export financial data to PDF and Excel formats.

---

## 4. Detailed Folder Explanation

Here is a detailed breakdown of the purpose of each key folder:

### `src/components/`
This directory serves as the core of the application's UI logic, organized by feature.

-   **`Analytics/`**: Contains components dedicated to the Analytics page.
    -   `AnalyticsPage.js`: The main analytics view.
    -   `SpendingTrends.js`, `MonthlyAnalysis.js`: Specific charts and graphs.
    -   `ExportOptions.js`: Logic for exporting data to files.

-   **`BudgetPlanning/`**: Houses the Budget Planning feature.
    -   `BudgetWizard.js`: The main container for the multi-step budget creation process.
    -   `WizardSteps.js`: Individual steps of the wizard (forms for user input).
    -   `ChatGPTService.js`: Service to handle AI interactions for budget advice.
    -   `BudgetResult.js`: Displays the calculated/suggested budget plan.

-   **`DailyUsage/`**: Manages the day-to-day expense tracking interface.
    -   `DailyUsagePage.js`: The main wrapper for this feature.
    -   `AddExpenseForm.js`: Form to input new expenses.
    -   `ExpenseList.js`: Displays the list of expense records.
    -   `EditExpenseModal.js`: Modal dialog for modifying existing expenses.
    -   `CategorySummary.js`: Shows a summary of expenses grouped by category.
    -   `Calculator.js`: A utility component for quick calculations within the app.

-   **`Dashboard/`**: Components exclusively for the Dashboard landing page.
    -   `DashboardPage.js`: The main dashboard layout.
    -   `OverviewCards.js`: Stats cards at the top of the dashboard.
    -   `RecentTransactions.js`: A widget showing the last few activities.

-   **`common/`**: Shared components used across multiple pages.
    -   `Layout.js`: Defines the main page structure (Sidebar, Header, Content Area).

### `src/pages/`
Contains the top-level page components that map directly to the application's routes.
-   `Login.js` / `Signup.js`: Authentication screens.
-   `ProfilePage.js`: User settings and profile view.
-   *Note: Other main feature pages (Dashboard, DailyUsage, etc.) are often composed here or imported directly from their feature folders.*

### `src/context/`
-   **`AuthContext.js`**: Manages the global authentication state (current user, login status) and provides it to the rest of the app hierarchy.

### `src/hooks/`
-   **`useAnalytics.js`**: A custom hook that encapsulates logic for processing raw transaction data into analytics metrics (totals, averages, trends), keeping complex logic out of the UI components.

### `src/utils/`
-   Contains general helper functions (e.g., date formatting, currency formatting) that are used throughout the application to avoid code duplication.
