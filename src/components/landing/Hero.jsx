// Import useState so we can store and update transactions,
// the selected filter, and the transaction being edited.
import { useEffect, useState } from "react";


//Import an icon for the empty transaction state.
import { FiInbox } from "react-icons/fi";


// Import the reusable Button component.
import Button from "../common/button";


// Import the reusable TransactionCard component.
import TransactionCard from "../common/TransactionCard";


// Import the form used to create and edit transactions.
import TransactionForm from "../common/TransactionForm";


// Import the component that displays Balance, Income,
// Expenses, and Savings.
import DashboardSummary from "../common/DashboardSummary";


// Import the component that displays financial goal progress.
import GoalCard from "../common/GoalCard";
import GoalForm from "../common/GoalForm";
import TransactionHistory from "../common/TransactionHistory";
import MonthlyComparison from "../common/MonthlyComparison";
import MonthlyInsights from "../common/MonthlyInsights";
import SpendingAlerts from "../common/SpendingAlerts";
import BudgetPlanner from "../common/BudgetPlanner";
import BudgetRecommendations from "../common/BudgetRecommendations";
import MonthlyBudgetPerformance from "../common/MonthlyBudgetPerformance";
import FinancialHealthScore from "../common/FinancialHealthScore";
// Import the financial goals performance dashboard.
import GoalsPerformanceDashboard from "../common/GoalsPerformanceDashboard";

// Displays intelligent insights about the user's savings goals.
import SmartSavingsInsights from "../common/SmartSavingsInsights";

// Import chart component.
import FinanceChart from "../charts/FinanceChart";
import ExpenseChart from "../charts/ExpenseChart";
import MonthlySummary from "../charts/MonthlySummary";

// Import the reusable Nigerian Naira currency formatter.
import formatCurrency from "../../utils/formatCurrency";

// Import the reusable FinFlow data loader.
import loadFinflowData from "../../utils/loadFinflowData";

// Import the reusable date validation function.
import isValidDate from "../../utils/isValidDate";



//   PART A

function Hero() {

    // Store the user's starting balance.
    const startingBalance = 250000;

    /*
      Load saved FinFlow information once.

      The same saved data will initialize:
      - Transactions
      - Financial goals
      - Monthly budgets
    */
    const [savedFinflowData] = useState(() => loadFinflowData());

    // Store all user transactions.
    const [transactions, setTransactions] = useState(
        () => savedFinflowData.transactions
    );

    // Store all financial goals.
    const [goals, setGoals] = useState(
        () => savedFinflowData.goals
    );

    // Store all monthly budgets.
    const [budgets, setBudgets] = useState(
        () => savedFinflowData.budgets
    );


    /*
        SAVE FINFLOW DATA

        Automatically save transactions, goals and budgets
        whenever any of them changes.

        Catch storage errors so they do not crash the application.
    */
    useEffect(() => {

        // Prepare all application data for saving.
        const finflowData = {
            transactions: transactions,
            goals: goals,
            budgets: budgets,
            settings: {}
        };

        try {

            // Convert the application data into JSON text.
            const serializedData = JSON.stringify(finflowData);

            // Save the data in the browser's LocalStorage.
            localStorage.setItem(
                "finflow_data",
                serializedData
            );

        } catch (error) {

            // Log the error for debugging.
            console.error(
                "Unable to save FinFlow data:",
                error
            );

        }

    }, [transactions, goals, budgets]);


        // PART C


    // Store the currently selected transaction filter.
    // "All" means that every transaction should be displayed.
    const [transactionFilter, setTransactionFilter] = useState("All");

    // Store the transaction currently being edited.
    // null means that no transaction is being edited.
    const [editingTransaction, setEditingTransaction] = useState(null);

    // Storethe goal currently being edited.
    // null means that no goal is being edited.
    const [editingGoal, setEditingGoal] = useState(null);

    // Store the success notification displayed to the user.
    const [toast, setToast] = useState(null);

    /*
        Store the currently selected goal filter.

        "All" means that every financial goal should be displayed.
    */
    const [goalFilter, setGoalFilter] = useState("All");


    /*
      SUCCESS NOTIFICATION

      Automatically hide the notification after 3 seconds.
    */
    useEffect(() => {

        // Do nothing when there is no notification.
        if (!toast) return;

        // Hide the notification after 3 seconds.
        const timer = setTimeout(() => {
            setToast(null);
        }, 3000);

        // Clean up the timer when the notification changes.
        return () => clearTimeout(timer);

    }, [toast]);


    /*
        ADD OR UPDATE A FINANCIAL GOAL

        Validate goal information before saving it.
        This also supports editing existing goals.
    */
    function addGoal(goal) {

        // Make sure the supplied goal is a valid object.
        if (
            !goal ||
            typeof goal !== "object" ||
            Array.isArray(goal)
        ) {
            alert("Invalid financial goal information.");
            return false;
        }

        // Remove unnecessary spaces from the goal name.
        const trimmedName = String(goal.name || "").trim();

        // Convert the target and saved amounts into numbers.
        const numericTarget = Number(goal.targetAmount);
        const numericSaved = Number(goal.currentAmount ?? 0);

        // Available priority levels.
        const validPriorities = ["High", "Medium", "Low"];

        // Validate the goal name.
        if (!trimmedName) {
            alert("Please enter a financial goal name.");
            return false;
        }

        // Validate the target amount.
        if (
            goal.targetAmount === "" ||
            goal.targetAmount === null ||
            !Number.isFinite(numericTarget) ||
            numericTarget <= 0
        ) {
            alert("Please enter a valid positive target amount.");
            return false;
        }

        // Validate the current savings amount.
        if (
            !Number.isFinite(numericSaved) ||
            numericSaved < 0
        ) {
            alert("Please enter a valid savings amount.");
            return false;
        }

        // Validate the goal priority.
        if (!validPriorities.includes(goal.priority)) {
            alert("Please select a valid goal priority.");
            return false;
        }

        // Validate the optional target date.
        const targetDate = String(goal.targetDate || "");

        // Validate the target date when one is provided.
        if (
            goal.targetDate &&
            !isValidDate(goal.targetDate)
        ) {
            alert("Please enter a valid goal target date.");
            return false;
        }

        // Prepare a clean goal object.
        const validatedGoal = {
            ...goal,
            id: goal.id || Date.now().toString(),
            name: trimmedName,
            targetAmount: numericTarget,
            currentAmount: numericSaved,
            targetDate,
        };

        // Check whether this goal already exists before updating state.
        const isUpdating = goals.some(
            (item) => item.id === validatedGoal.id
        );

        // Save or update the goal using the latest goals array.
        setGoals((previousGoals) => {

            // Check whether this goal already exists.
            const existingGoal = previousGoals.some(
                (item) => item.id === validatedGoal.id
            );

            // Update the existing goal.
            if (existingGoal) {
                return previousGoals.map((item) =>
                    item.id === validatedGoal.id
                        ? validatedGoal
                        : item
                );
            }

            // Add a new goal.
            return [...previousGoals, validatedGoal];
        });

        // Display feedback after a successful goal save.
        setToast({
            type: "success",
            message: isUpdating ? "Goal updated successfully!" : "Goal created successfully!"
        });

        return true;
    }

    /*
        ADD MONEY TO A FINANCIAL GOAL

        Validate the goal and amount before updating the savings.
    */
    function addMoneyToGoal(goalId, amount) {

        // Make sure a valid goal ID was supplied.
        if (!goalId) {
            alert("Please select a valid financial goal.");
            return false;
        }

        // Find the selected goal.
        const selectedGoal = goals.find(
            (goal) => goal.id === goalId
        );

        // Stop if the selected goal does not exist.
        if (!selectedGoal) {
            alert("The selected financial goal could not be found.");
            return false;
        }

        // Convert the supplied amount into a number.
        const numericAmount = Number(amount);

        // Reject empty, invalid, zero, or negative amounts.
        if (
            amount === "" ||
            amount === null ||
            !Number.isFinite(numericAmount) ||
            numericAmount <= 0
        ) {
            alert("Please enter a valid positive savings amount.");
            return false;
        }

        // Update the selected goal using the latest state.
        setGoals((previousGoals) =>
            previousGoals.map((goal) => {

                // Add money only to the selected goal.
                if (goal.id === goalId) {
                    const currentSaved = Number(goal.currentAmount) || 0;

                    return {
                        ...goal,
                        currentAmount: currentSaved + numericAmount
                    };
                }

                return goal;
            })
        );

        // Display success feedback.
        setToast({
            type: "success",
            message: `${formatCurrency(numericAmount)} added to ${selectedGoal.name}!`
        });

        return true;
    }

    /*
        DELETE A FINANCIAL GOAL

        Confirm the deletion before removing the goal.
        Only display success feedback when deletion is confirmed.
    */
    function deleteGoal(goalId) {

        // Make sure a valid goal ID was supplied.
        if (!goalId) {
            alert("Please select a valid financial goal.");
            return false;
        }

        // Find the goal that should be deleted.
        const goalToDelete = goals.find(
            (goal) => goal.id === goalId
        );

        // Stop if the goal does not exist.
        if (!goalToDelete) {
            alert("The selected financial goal could not be found.");
            return false;
        }

        // Ask the user to confirm the deletion.
        const confirmDelete = window.confirm(
            `Are you sure you want to delete "${goalToDelete.name}"?`
        );

        // Stop if the user cancels.
        if (!confirmDelete) {
            return false;
        }

        // Remove the selected goal using the latest state.
        setGoals((previousGoals) =>
            previousGoals.filter(
                (goal) => goal.id !== goalId
            )
        );

        // Display a success notification.
        setToast({
            type: "success",
            message: `${goalToDelete.name} deleted successfully!`
        });

        return true;
    }


    function handleEditGoal(goal) {
        setEditingGoal(goal);
    }

        // PART D


    /*
      ADD OR UPDATE A TRANSACTION

      Validate transaction information before allowing
      it into the application's state.
    */
    function addTransaction(transaction) {

        // Make sure the supplied transaction is an object.
        if (
            !transaction ||
            typeof transaction !== "object" ||
            Array.isArray(transaction)
        ) {
            alert("Invalid transaction information.");
            return false;
        }

        // Clean the transaction title.
        const trimmedTitle = String(transaction.title || "").trim();

        // Convert the amount into a number.
        const numericAmount = Number(transaction.amount);

        // Available transaction categories.
        const validCategories = [
            "Salary",
            "Freelance",
            "Business",
            "Investment",
            "Food",
            "Transport",
            "Bills",
            "Shopping",
            "Entertainment"
        ];

        // Validate the transaction title.
        if (!trimmedTitle) {
            alert("A transaction title is required.");
            return false;
        }

        // Validate the transaction amount.
        if (
            transaction.amount === "" ||
            transaction.amount === null ||
            !Number.isFinite(numericAmount) ||
            numericAmount <= 0
        ) {
            alert("Please provide a valid positive transaction amount.");
            return false;
        }

        // Validate the transaction type.
        if (!["Income", "Expense"].includes(transaction.type)) {
            alert("Please select a valid transaction type.");
            return false;
        }

        // Validate the transaction category.
        if (!validCategories.includes(transaction.category)) {
            alert("Please select a valid transaction category.");
            return false;
        }

        // Validate the transaction date.
        const dateValue = String(transaction.date || "");

        // Make sure the transaction date is valid.
        if (!isValidDate(transaction.date)) {
            alert("Please enter a valid transaction date.");
            return false;
        }

        // Prepare a clean transaction object.
        const validatedTransaction = {
            ...transaction,
            title: trimmedTitle,
            amount: numericAmount,
            date: dateValue
        };

        // Use the latest transactions array.
        setTransactions((previousTransactions) => {

            // Check whether the transaction already exists.
            const existingTransaction = previousTransactions.some(
                (item) => item.id === validatedTransaction.id
            );

            // Update the existing transaction.
            if (existingTransaction) {
                return previousTransactions.map((item) =>
                    item.id === validatedTransaction.id
                        ? validatedTransaction
                        : item
                );
            }

            // Otherwise, add the new transaction.
            return [...previousTransactions, validatedTransaction];
        });

        return true;
    }


        // PART E


    // Stop editing the current transaction.
    function finishEditing() {

        // Clear the currently edited transaction.
        setEditingTransaction(null);
    }


    /*
        DELETE A TRANSACTION

        Confirm deletion, remove the transaction,
        and display a success notification.
    */
    function deleteTransaction(id) {

        // Check that a transaction ID was provided.
        if (!id) {
            alert("Please select a valid transaction.");
            return false;
        }

        // Find the transaction before deleting it.
        const transactionToDelete = transactions.find(
            (transaction) => transaction.id === id
        );

        // Stop if the transaction does not exist.
        if (!transactionToDelete) {
            alert("The selected transaction could not be found.");
            return false;
        }

        // Ask the user to confirm the deletion.
        const confirmDelete = window.confirm(
            `Are you sure you want to delete "${transactionToDelete.title}"?`
        );

        // Do nothing if the user cancels.
        if (!confirmDelete) {
            return false;
        }

        // Remove the transaction using the latest state.
        setTransactions((previousTransactions) =>
            previousTransactions.filter(
                (transaction) => transaction.id !== id
            )
        );

        // Display a success notification.
        setToast({
            type: "success",
            message: `${transactionToDelete.title} deleted successfully!`
        });

        return true;
    }


        // PART F


    // Find a transaction and prepare it for editing.
    function editTransaction(id) {

        // Find the transaction that the user wants to edit.
        const transactionToEdit = transactions.find(
            (transaction) => transaction.id === id
        );

        // If the transaction does not exist, stop the function.
        if (!transactionToEdit) {
            return;
        }

        // Store the transaction so TransactionForm
        // can display its information.
        setEditingTransaction(transactionToEdit);
    }


    /*
      ADD OR UPDATE A MONTHLY BUDGET

      Validate budget information before updating application state.
    */
    function addBudget(newBudget) {

        // Make sure the supplied budget is an object.
        if (
            !newBudget ||
            typeof newBudget !== "object" ||
            Array.isArray(newBudget)
        ) {
            alert("Invalid budget information.");
            return false;
        }

        // Available budget categories.
        const validCategories = [
            "Food",
            "Transport",
            "Bills",
            "Shopping",
            "Entertainment",
            "Other"
        ];

        // Normalize the category.
        const normalizedCategory = String(
            newBudget.category || ""
        ).trim().toLowerCase();

        // Find the correct category.
        const selectedCategory = validCategories.find(
            (item) => item.toLowerCase() === normalizedCategory
        );

        // Convert the budget amount into a number.
        const numericAmount = Number(newBudget.amount);

        // Validate the category.
        if (!selectedCategory) {
            alert("Please select a valid budget category.");
            return false;
        }

        // Validate the budget amount.
        if (
            newBudget.amount === "" ||
            newBudget.amount === null ||
            !Number.isFinite(numericAmount) ||
            numericAmount <= 0
        ) {
            alert("Please enter a valid positive budget amount.");
            return false;
        }

        // Update the budget using the latest state.
        setBudgets((previousBudgets) => {

            // Check whether this category already has a budget.
            const existingBudget = previousBudgets.find(
                (budget) =>
                    String(budget.category).trim().toLowerCase() ===
                    selectedCategory.toLowerCase()
            );

            // Update the existing category budget.
            if (existingBudget) {
                return previousBudgets.map((budget) =>
                    budget.id === existingBudget.id
                        ? {
                            ...budget,
                            category: selectedCategory,
                            amount: numericAmount
                        }
                        : budget
                );
            }

            // Otherwise, create a new budget.
            return [
                ...previousBudgets,
                {
                    ...newBudget,
                    category: selectedCategory,
                    amount: numericAmount,
                    id: Date.now().toString()
                }
            ];
        });

        return true;
    }

    /*
        DELETE A MONTHLY BUDGET

        Confirm deletion, remove the selected budget,
        and notify the user when the deletion succeeds.
    */
    function deleteBudget(id) {

        // Make sure a valid budget ID was supplied.
        if (!id) {
            alert("Please select a valid budget.");
            return false;
        }

        // Find the budget before deleting it.
        const budgetToDelete = budgets.find(
            (budget) => budget.id === id
        );

        // Stop if the budget does not exist.
        if (!budgetToDelete) {
            alert("The selected budget could not be found.");
            return false;
        }

        // Ask the user to confirm the deletion.
        const confirmDelete = window.confirm(
            `Are you sure you want to delete your ${budgetToDelete.category} budget?`
        );

        // Stop if the user cancels.
        if (!confirmDelete) {
            return false;
        }

        // Remove the selected budget using the latest state.
        setBudgets((previousBudgets) =>
            previousBudgets.filter(
                (budget) => budget.id !== id
            )
        );

        // Display a success notification.
        setToast({
            type: "success",
            message: `${budgetToDelete.category} budget deleted successfully!`
        });

        return true;
    }


    // Calculate the total amount of all Income transactions.
    const totalIncome = transactions
        .filter((transaction) => transaction.type === "Income")
        .reduce(
            (total, transaction) => total + Number(transaction.amount),
            0
        );


    // Calculate the total amount of all Expense transactions.
    const totalExpenses = transactions
        .filter((transaction) => transaction.type === "Expense")
        .reduce(
            (total, transaction) => total + Number(transaction.amount),
            0
        );


    // Calculate the current balance.
    const balance = startingBalance + totalIncome - totalExpenses;


    // Calculate savings.
    const savings = totalIncome - totalExpenses;


    // Count how many goals the user has.
    const totalGoals = goals.length;


    // Add together the amount saved across all goals safely.
    const totalGoalSaved = goals.reduce(
        (total, goal) => {
            const saved = Number(goal.currentAmount);

            return total + (
                Number.isFinite(saved) && saved > 0
                    ? saved
                    : 0
            );
        },
        0
    );


    // Count goals that have been completed.
    const completedGoals = goals.filter(
        (goal) => Number(goal.currentAmount) >= Number(goal.targetAmount)
    ).length;


    // Add together all goal target amounts safely.
    const totalGoalTarget = goals.reduce(
        (total, goal) => {
            const target = Number(goal.targetAmount);

            return total + (
                Number.isFinite(target) && target > 0
                    ? target
                    : 0
            );
        },
        0
    );

    // Calculate the total amount still needed across all goals.
    const totalGoalRemaining = Math.max(
        totalGoalTarget - totalGoalSaved,
        0
    );


    // Calculate overall goal progress.
    const overallGoalProgress = totalGoalTarget > 0
        ? Math.min(
            (totalGoalSaved / totalGoalTarget) * 100,
            100
        )
        : 0;

    // Get only expense transactions.
    const expenseTransactions = transactions.filter(
        (transaction) => transaction.type === "Expense"
    );


    // Create a list of transactions based on the selected filter.
    const filteredTransactions = transactions.filter((transaction) => {
        if (transactionFilter === "All") {
            return true;
        }
        return transaction.type === transactionFilter;
    });

    // Sort transactions by date (newest first).
    const sortedTransactions = [...filteredTransactions].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
    );

    // Show only the five most recent transactions.
    const recentTransactions = sortedTransactions.slice(0, 5);


    // Store the four dashboard statistics.
    const stats = [
        {
            title: "Total Balance",
            amount: formatCurrency(balance),
            color: "text-emerald-600",
        },
        {
            title: "Total Income",
            amount: formatCurrency(totalIncome),
            color: "text-blue-600",
        },
        {
            title: "Total Expenses",
            amount: formatCurrency(totalExpenses),
            color: "text-red-600",
        },
        {
            title: "Savings",
            amount: formatCurrency(savings),
            color: "text-purple-600",
        },
    ];


    // Sort goals by priority.
    const priorityOrder = {
        High: 1,
        Medium: 2,
        Low: 3,
    };

    const sortedGoals = [...goals].sort(
        (a, b) =>
            (priorityOrder[a.priority] || 2) -
            (priorityOrder[b.priority] || 2)
    );

    // Filter goals based on selection.
    const filteredGoals = sortedGoals.filter((goal) => {
        if (goalFilter === "All") {
            return true;
        }
        if (goalFilter === "Completed") {
            return Number(goal.currentAmount) >= Number(goal.targetAmount);
        }
        return goal.priority === goalFilter;
    });


        // PART G

    // Return the main Hero section of the FinFlow page.
    return (
        <section className="bg-slate-50 relative">

            {/* SUCCESS NOTIFICATION */}
            {toast && (
                <div
                    role="status"
                    aria-live="polite"
                    className="fixed top-5 right-5 z-50 flex items-center gap-3 rounded-xl border border-emerald-200 bg-white px-5 py-4 shadow-lg"
                >
                    {/* Success icon */}
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            className="h-6 w-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 12l4 4L19 6"
                            />
                        </svg>
                    </span>

                    {/* Success message */}
                    <div>
                        <p className="font-semibold text-slate-800">
                            Success!
                        </p>

                        <p className="text-sm text-slate-600">
                            {toast.message}
                        </p>
                    </div>

                    {/* Close notification button */}
                    <button
                        type="button"
                        onClick={() => setToast(null)}
                        aria-label="Close notification"
                        className="ml-2 text-slate-400 hover:text-slate-700"
                    >
                        &times;
                    </button>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-6 py-24">

                <div>

                    <p className="text-emerald-600 font-semibold mb-3">
                        Welcome to Finflow
                    </p>


                    <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                        Take Control of Your Money Today
                    </h1>


                    <p className="mt-6 text-lg text-slate-600">
                        Track your income, expenses, savings, and financial goals in one
                        beautiful and secure application.
                    </p>


                    <div className="mt-10 flex gap-5">
                        <Button
                            text="Get Started"
                            variant="primary"
                        />
                        <Button
                            text="Learn More"
                            variant="secondary"
                        />
                    </div>


                    <div className="mt-10">
                        <DashboardSummary stats={stats} />
                    </div>


                    <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <FinanceChart
                            income={totalIncome}
                            expenses={totalExpenses}
                        />

                        <ExpenseChart
                            expenses={expenseTransactions}
                        />
                    </div>

                    <div className="mt-8 space-y-6">
                        <MonthlyComparison
                            transactions={transactions}
                        />

                        <MonthlyInsights
                            transactions={transactions}
                        />

                        <SpendingAlerts
                            transactions={transactions}
                        />

                        <BudgetPlanner
                            budgets={budgets}
                            transactions={transactions}
                            onAddBudget={addBudget}
                            onDeleteBudget={deleteBudget}
                        />

                        <BudgetRecommendations
                            transactions={transactions}
                            budgets={budgets}
                            onApplyRecommendation={addBudget}
                        />

                        <MonthlyBudgetPerformance
                            transactions={transactions}
                            budgets={budgets}
                        />

                        <FinancialHealthScore
                            transactions={transactions}
                            budgets={budgets}
                        />
                    </div>

                    <div className="mt-8">
                        <MonthlySummary
                            income={totalIncome}
                            expenses={totalExpenses}
                            savings={savings}
                        />
                    </div>


                    <div className="mt-10">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">

                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <p className="text-sm text-slate-500">
                                        Financial Goals
                                    </p>
                                    <h2 className="text-2xl font-bold text-slate-800">
                                        Your Goal Progress
                                    </h2>
                                </div>
                                <span className="text-emerald-600 font-bold">
                                    {Math.round(overallGoalProgress)}%
                                </span>
                            </div>

                            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-6">
                                <div
                                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                                    style={{
                                        width: `${overallGoalProgress}%`
                                    }}
                                ></div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                <div className="bg-slate-50 rounded-xl p-4">
                                    <p className="text-sm text-slate-500">Total Goals</p>
                                    <p className="text-2xl font-bold text-slate-800 mt-1">{totalGoals}</p>
                                </div>

                                <div className="bg-slate-50 rounded-xl p-4">
                                    <p className="text-sm text-slate-500">Saved</p>
                                    <p className="text-xl font-bold text-emerald-600 mt-1">{formatCurrency(totalGoalSaved)}</p>
                                </div>

                                <div className="bg-slate-50 rounded-xl p-4">
                                    <p className="text-sm text-slate-500">Completed</p>
                                    <p className="text-2xl font-bold text-purple-600 mt-1">{completedGoals}</p>
                                </div>

                                <div className="bg-slate-50 rounded-xl p-4">
                                    <p className="text-sm text-slate-500">Target</p>
                                    <p className="text-xl font-bold text-blue-600 mt-1">{formatCurrency(totalGoalTarget)}</p>
                                </div>

                                <div className="bg-slate-50 rounded-xl p-4">
                                    <p className="text-sm text-slate-500">Remaining</p>
                                    <p className="text-xl font-bold text-red-600 mt-1">{formatCurrency(totalGoalRemaining)}</p>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="mt-8">
                        <GoalsPerformanceDashboard goals={goals} />
                        <SmartSavingsInsights goals={goals} />
                    </div>


                    <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <GoalForm
                            onAddGoal={addGoal}
                            editingGoal={editingGoal}
                            onFinishEditing={() => setEditingGoal(null)}
                        />

                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-800">
                                Your Financial Goals
                            </h2>

                            <div className="flex flex-wrap gap-2 mt-4">
                                {["All", "High", "Medium", "Low", "Completed"].map((filter) => (
                                    <button
                                        key={filter}
                                        type="button"
                                        onClick={() => setGoalFilter(filter)}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                                            goalFilter === filter
                                                ? "bg-emerald-600 text-white"
                                                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                                        }`}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>

                            {filteredGoals.length > 0 ? (
                                filteredGoals.map((goal) => (
                                    <GoalCard
                                        key={goal.id}
                                        name={goal.name}
                                        targetAmount={goal.targetAmount}
                                        currentAmount={goal.currentAmount}
                                        targetDate={goal.targetDate}
                                        priority={goal.priority}
                                        onAddMoney={(amount) =>
                                            addMoneyToGoal(goal.id, amount)
                                        }
                                        onEdit={() => handleEditGoal(goal)}
                                        onDelete={() => deleteGoal(goal.id)}
                                    />
                                ))
                            ) : (
                                <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center">
                                    <h3 className="font-semibold text-slate-700">
                                        {goalFilter === "All"
                                            ? "No financial goals yet"
                                            : `No ${goalFilter.toLowerCase()} goals found`}
                                    </h3>
                                    <p className="text-sm text-slate-500 mt-2">
                                        {goalFilter === "All"
                                            ? "No financial goals yet"
                                            : `No ${goalFilter.toLowerCase()} goals found`}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>


                                {/* PART H */}


                    <div className="max-w-7xl mx-auto px-6 py-24">
                        <TransactionForm
                            onAddTransaction={addTransaction}
                            editingTransaction={editingTransaction}
                            onFinishEditing={finishEditing}
                        />

                        <div className="mt-10">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold">
                                    Recent Transactions
                                </h2>
                                <span className="text-sm text-slate-500">
                                    {recentTransactions.length}{" "}
                                    {recentTransactions.length === 1
                                        ? "transaction"
                                        : "transactions"}
                                </span>
                            </div>


                            <div className="flex flex-wrap gap-2 mb-6">
                                <button
                                    onClick={() => setTransactionFilter("All")}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                        transactionFilter === "All"
                                            ? "bg-emerald-600 text-white shadow-sm"
                                            : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                                    }`}
                                >
                                    All
                                </button>

                                <button
                                    onClick={() => setTransactionFilter("Income")}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                        transactionFilter === "Income"
                                            ? "bg-emerald-600 text-white shadow-sm"
                                            : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                                    }`}
                                >
                                    Income
                                </button>

                                <button
                                    onClick={() => setTransactionFilter("Expense")}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                        transactionFilter === "Expense"
                                            ? "bg-emerald-600 text-white shadow-sm"
                                            : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                                    }`}
                                >
                                    Expenses
                                </button>
                            </div>


                            <div className="max-h-[500px] overflow-y-auto pr-2">
                                {recentTransactions.length > 0 ? (
                                    recentTransactions.map((transaction) => (
                                        <TransactionCard
                                            key={transaction.id}
                                            title={transaction.title}
                                            amount={transaction.amount}
                                            type={transaction.type}
                                            category={transaction.category}
                                            date={transaction.date}
                                            onEdit={() =>
                                                editTransaction(transaction.id)
                                            }
                                            onDelete={() =>
                                                deleteTransaction(transaction.id)
                                            }
                                        />
                                    ))
                                ) : (
                                    <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-8 text-center">
                                        <div className="flex justify-center mb-4">
                                            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
                                                <FiInbox className="text-slate-400 text-2xl" />
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-semibold text-slate-700">
                                            No transaction found
                                        </h3>

                                        <p className="text-sm text-slate-500 mt-2">
                                            {transactionFilter === "All"
                                                ? "Add your first transaction to start tracking your money."
                                                : `No ${transactionFilter.toLowerCase()} transactions found.`}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <TransactionHistory
                                transactions={transactions}
                                onEdit={editTransaction}
                                onDelete={deleteTransaction}
                            />
                        </div>
                    </div>

                </div>

            </div>

        </section>
    );
}

export default Hero;