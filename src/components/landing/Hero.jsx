// Import useState so we can store and update transactions,
// the selected filter, and the transaction being edited.
import { useEffect, useState } from "react";

// Import an icon for the empty transaction state.
import { FiInbox } from "react-icons/fi";

// Import the reusable Button component.
import Button from "../common/button";

// Import the reusable TransactionCard component.
import TransactionCard from "../common/TransactionCard";

// Import the form used to create and edit transactions.
import TransactionForm from "../common/TransactionForm";

// Import the component that displays Balance, Income, Expenses, and Savings.
import DashboardSummary from "../common/DashboardSummary";

// Import components for financial goals, budgets, and insights.
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
import GoalsPerformanceDashboard from "../common/GoalsPerformanceDashboard";
import SmartSavingsInsights from "../common/SmartSavingsInsights";

// Import chart components.
import FinanceChart from "../charts/FinanceChart";
import ExpenseChart from "../charts/ExpenseChart";
import MonthlySummary from "../charts/MonthlySummary";

// Import utility functions and shared constants.
import formatCurrency from "../../utils/formatCurrency";
import loadFinflowData from "../../utils/loadFinflowData";
import isValidDate from "../../utils/isValidDate";
import isValidAmount from "../../utils/isValidAmount";
import transactionCategories from "../../constants/transactionCategories";
import budgetCategories from "../../constants/budgetCategories";
import goalPriorities from "../../constants/goalPriorities";

function Hero() {
    // Store the user's starting balance.
    const startingBalance = 250000;

    // Load saved FinFlow information once.
    const [savedFinflowData] = useState(() => loadFinflowData());

    // Store all user transactions, financial goals, and monthly budgets.
    const [transactions, setTransactions] = useState(() => savedFinflowData.transactions);
    const [goals, setGoals] = useState(() => savedFinflowData.goals);
    const [budgets, setBudgets] = useState(() => savedFinflowData.budgets);

    /*
        SAVE FINFLOW DATA
        Automatically save transactions, goals, and budgets whenever any of them changes.
    */
    useEffect(() => {
        const finflowData = {
            transactions: transactions,
            goals: goals,
            budgets: budgets,
            settings: {}
        };

        try {
            const serializedData = JSON.stringify(finflowData);
            localStorage.setItem("finflow_data", serializedData);
        } catch (error) {
            console.error("Unable to save FinFlow data:", error);
        }
    }, [transactions, goals, budgets]);

    // UI state filters and notifications.
    const [transactionFilter, setTransactionFilter] = useState("All");
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [editingGoal, setEditingGoal] = useState(null);
    const [toast, setToast] = useState(null);
    const [goalFilter, setGoalFilter] = useState("All");

    /*
      SUCCESS NOTIFICATION
      Automatically hide the notification after 3 seconds.
    */
    useEffect(() => {
        if (!toast) return;

        const timer = setTimeout(() => {
            setToast(null);
        }, 3000);

        return () => clearTimeout(timer);
    }, [toast]);

    /*
        ADD OR UPDATE A FINANCIAL GOAL
    */
    function addGoal(goal) {
        if (!goal || typeof goal !== "object" || Array.isArray(goal)) {
            alert("Invalid financial goal information.");
            return false;
        }

        const trimmedName = String(goal.name || "").trim();
        const numericTarget = Number(goal.targetAmount);
        const numericSaved = Number(goal.currentAmount || 0);

        if (numericSaved > numericTarget) {
            alert("The amount saved cannot exceed the goal target.");
            return false;
        }

        if (!trimmedName) {
            alert("Please enter a financial goal name.");
            return false;
        }

        if (!isValidAmount(goal.targetAmount)) {
            alert("Please enter a valid savings goal target.");
            return false;
        }

        if (!Number.isFinite(numericSaved) || numericSaved < 0) {
            alert("Please enter a valid savings amount.");
            return false;
        }

        // Validate the goal priority using the shared priority list.
        if (!goalPriorities.includes(goal.priority)) {
            alert("Please select a valid goal priority.");
            return false;
        }

        const targetDate = String(goal.targetDate || "");
        if (goal.targetDate && !isValidDate(goal.targetDate)) {
            alert("Please enter a valid goal target date.");
            return false;
        }

        const validatedGoal = {
            ...goal,
            id: goal.id || Date.now().toString(),
            name: trimmedName,
            targetAmount: numericTarget,
            currentAmount: numericSaved,
            targetDate,
        };

        setGoals((previousGoals) => {
            const existingGoal = previousGoals.some(
                (item) => item.id === validatedGoal.id
            );

            if (existingGoal) {
                return previousGoals.map((item) =>
                    item.id === validatedGoal.id ? validatedGoal : item
                );
            }

            return [...previousGoals, validatedGoal];
        });

        const isUpdating = goals.some((item) => item.id === validatedGoal.id);
        setToast({
            type: "success",
            message: isUpdating ? "Goal updated successfully!" : "Goal created successfully!"
        });

        return true;
    }

    /*
        ADD MONEY TO A FINANCIAL GOAL
    */
    function addMoneyToGoal(goalId, amount) {
        if (!goalId) {
            alert("Please select a valid financial goal.");
            return false;
        }

        const selectedGoal = goals.find((goal) => goal.id === goalId);
        if (!selectedGoal) {
            alert("The selected financial goal could not be found.");
            return false;
        }

        const numericAmount = Number(amount);

        // Validate the contribution using the reusable amount validator.
        if (!isValidAmount(amount)) {
            alert("Please enter a valid positive amount.");
            return false;
        }

        const currentSaved = Number(selectedGoal.currentAmount) || 0;
        const targetAmount = Number(selectedGoal.targetAmount);

        if (currentSaved + numericAmount > targetAmount) {
            alert(
                `This contribution exceeds your goal target. You can only add ${formatCurrency(
                    targetAmount - currentSaved
                )} more.`
            );
            return false;
        }

        setGoals((previousGoals) =>
            previousGoals.map((goal) => {
                if (goal.id === goalId) {
                    return {
                        ...goal,
                        currentAmount: currentSaved + numericAmount
                    };
                }
                return goal;
            })
        );

        setToast({
            type: "success",
            message: `${formatCurrency(numericAmount)} added to ${selectedGoal.name}!`
        });

        return true;
    }

    function deleteGoal(goalId) {
        if (!goalId) {
            alert("Please select a valid financial goal.");
            return false;
        }

        const goalToDelete = goals.find((goal) => goal.id === goalId);
        if (!goalToDelete) {
            alert("The selected financial goal could not be found.");
            return false;
        }

        if (!window.confirm(`Are you sure you want to delete "${goalToDelete.name}"?`)) {
            return false;
        }

        setGoals((previousGoals) => previousGoals.filter((goal) => goal.id !== goalId));

        setToast({
            type: "success",
            message: `${goalToDelete.name} deleted successfully!`
        });

        return true;
    }

    function handleEditGoal(goal) {
        setEditingGoal(goal);
    }

    /*
        ADD OR UPDATE A TRANSACTION
    */
    function addTransaction(transaction) {
        if (!transaction || typeof transaction !== "object" || Array.isArray(transaction)) {
            alert("Invalid transaction information.");
            return false;
        }

        const trimmedTitle = String(transaction.title || "").trim();
        const numericAmount = Number(transaction.amount);

        if (!trimmedTitle) {
            alert("A transaction title is required.");
            return false;
        }

        if (!isValidAmount(transaction.amount)) {
            alert("Please provide a valid positive transaction amount.");
            return false;
        }

        if (!["Income", "Expense"].includes(transaction.type)) {
            alert("Please select a valid transaction type.");
            return false;
        }

        if (!transactionCategories.includes(transaction.category)) {
            alert("Please select a valid transaction category.");
            return false;
        }

        const dateValue = String(transaction.date || "");
        if (!isValidDate(transaction.date)) {
            alert("Please enter a valid transaction date.");
            return false;
        }

        const validatedTransaction = {
            ...transaction,
            title: trimmedTitle,
            amount: numericAmount,
            date: dateValue
        };

        setTransactions((previousTransactions) => {
            const existingTransaction = previousTransactions.some(
                (item) => item.id === validatedTransaction.id
            );

            if (existingTransaction) {
                return previousTransactions.map((item) =>
                    item.id === validatedTransaction.id ? validatedTransaction : item
                );
            }

            return [...previousTransactions, validatedTransaction];
        });

        return true;
    }

    function finishEditing() {
        setEditingTransaction(null);
    }

    function deleteTransaction(id) {
        if (!id) {
            alert("Please select a valid transaction.");
            return false;
        }

        const transactionToDelete = transactions.find((transaction) => transaction.id === id);
        if (!transactionToDelete) {
            alert("The selected transaction could not be found.");
            return false;
        }

        if (!window.confirm(`Are you sure you want to delete "${transactionToDelete.title}"?`)) {
            return false;
        }

        setTransactions((previousTransactions) =>
            previousTransactions.filter((transaction) => transaction.id !== id)
        );

        setToast({
            type: "success",
            message: `${transactionToDelete.title} deleted successfully!`
        });

        return true;
    }

    function editTransaction(id) {
        const transactionToEdit = transactions.find((transaction) => transaction.id === id);
        if (!transactionToEdit) {
            return;
        }
        setEditingTransaction(transactionToEdit);
    }

    /*
      ADD OR UPDATE A MONTHLY BUDGET
    */
    function addBudget(newBudget) {
        if (!newBudget || typeof newBudget !== "object" || Array.isArray(newBudget)) {
            alert("Invalid budget information.");
            return false;
        }

        const normalizedCategory = String(newBudget.category || "").trim().toLowerCase();
        const selectedCategory = budgetCategories.find(
            (item) => item.toLowerCase() === normalizedCategory
        );

        if (!selectedCategory) {
            alert("Please select a valid budget category.");
            return false;
        }

        const numericAmount = Number(newBudget.amount);

        if (!isValidAmount(newBudget.amount)) {
            alert("Please enter a valid positive budget amount.");
            return false;
        }

        setBudgets((previousBudgets) => {
            const existingBudget = previousBudgets.find(
                (budget) =>
                    String(budget.category).trim().toLowerCase() === selectedCategory.toLowerCase()
            );

            if (existingBudget) {
                return previousBudgets.map((budget) =>
                    budget.id === existingBudget.id
                        ? { ...budget, category: selectedCategory, amount: numericAmount }
                        : budget
                );
            }

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

    function deleteBudget(id) {
        if (!id) {
            alert("Please select a valid budget.");
            return false;
        }

        const budgetToDelete = budgets.find((budget) => budget.id === id);
        if (!budgetToDelete) {
            alert("The selected budget could not be found.");
            return false;
        }

        if (!window.confirm(`Are you sure you want to delete your ${budgetToDelete.category} budget?`)) {
            return false;
        }

        setBudgets((previousBudgets) => previousBudgets.filter((budget) => budget.id !== id));

        setToast({
            type: "success",
            message: `${budgetToDelete.category} budget deleted successfully!`
        });

        return true;
    }

    // Calculations for summary metrics
    const totalIncome = transactions
        .filter((transaction) => transaction.type === "Income")
        .reduce((total, transaction) => total + Number(transaction.amount), 0);

    const totalExpenses = transactions
        .filter((transaction) => transaction.type === "Expense")
        .reduce((total, transaction) => total + Number(transaction.amount), 0);

    const balance = startingBalance + totalIncome - totalExpenses;
    const savings = totalIncome - totalExpenses;

    const totalGoals = goals.length;
    const totalGoalSaved = goals.reduce((total, goal) => {
        const saved = Number(goal.currentAmount);
        return total + (Number.isFinite(saved) && saved > 0 ? saved : 0);
    }, 0);

    const completedGoals = goals.filter(
        (goal) => Number(goal.currentAmount) >= Number(goal.targetAmount)
    ).length;

    const totalGoalTarget = goals.reduce((total, goal) => {
        const target = Number(goal.targetAmount);
        return total + (Number.isFinite(target) && target > 0 ? target : 0);
    }, 0);

    const totalGoalRemaining = Math.max(totalGoalTarget - totalGoalSaved, 0);

    const overallGoalProgress = totalGoalTarget > 0
        ? Math.min((totalGoalSaved / totalGoalTarget) * 100, 100)
        : 0;

    const expenseTransactions = transactions.filter(
        (transaction) => transaction.type === "Expense"
    );

    const filteredTransactions = transactions.filter((transaction) => {
        if (transactionFilter === "All") return true;
        return transaction.type === transactionFilter;
    });

    const sortedTransactions = [...filteredTransactions].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
    );

    const recentTransactions = sortedTransactions.slice(0, 5);

    const stats = [
        { title: "Total Balance", amount: formatCurrency(balance), color: "text-emerald-600" },
        { title: "Total Income", amount: formatCurrency(totalIncome), color: "text-blue-600" },
        { title: "Total Expenses", amount: formatCurrency(totalExpenses), color: "text-red-600" },
        { title: "Savings", amount: formatCurrency(savings), color: "text-purple-600" },
    ];

    const priorityOrder = { High: 1, Medium: 2, Low: 3 };
    const sortedGoals = [...goals].sort(
        (a, b) => (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2)
    );

    const filteredGoals = sortedGoals.filter((goal) => {
        if (goalFilter === "All") return true;
        if (goalFilter === "Completed") return Number(goal.currentAmount) >= Number(goal.targetAmount);
        return goal.priority === goalFilter;
    });

    return (
        <section className="bg-slate-50 relative">
            {toast && (
                <div
                    role="status"
                    aria-live="polite"
                    className="fixed top-5 right-5 z-50 flex items-center gap-3 rounded-xl border border-emerald-200 bg-white px-5 py-4 shadow-lg"
                >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-6 w-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12l4 4L19 6" />
                        </svg>
                    </span>
                    <div>
                        <p className="font-semibold text-slate-800">Success!</p>
                        <p className="text-sm text-slate-600">{toast.message}</p>
                    </div>
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
                    <p className="text-emerald-600 font-semibold mb-3">Welcome to Finflow</p>
                    <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                        Take Control of Your Money Today
                    </h1>
                    <p className="mt-6 text-lg text-slate-600">
                        Track your income, expenses, savings, and financial goals in one beautiful and secure application.
                    </p>

                    <div className="mt-10 flex gap-5">
                        <Button text="Get Started" variant="primary" />
                        <Button text="Learn More" variant="secondary" />
                    </div>

                    <div className="mt-10">
                        <DashboardSummary stats={stats} />
                    </div>

                    <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <FinanceChart income={totalIncome} expenses={totalExpenses} />
                        <ExpenseChart expenses={expenseTransactions} />
                    </div>

                    <div className="mt-8 space-y-6">
                        <MonthlyComparison transactions={transactions} />
                        <MonthlyInsights transactions={transactions} />
                        <SpendingAlerts transactions={transactions} />
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
                        <MonthlyBudgetPerformance transactions={transactions} budgets={budgets} />
                        <FinancialHealthScore transactions={transactions} budgets={budgets} />
                    </div>

                    <div className="mt-8">
                        <MonthlySummary income={totalIncome} expenses={totalExpenses} savings={savings} />
                    </div>

                    <div className="mt-10">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <p className="text-sm text-slate-500">Financial Goals</p>
                                    <h2 className="text-2xl font-bold text-slate-800">Your Goal Progress</h2>
                                </div>
                                <span className="text-emerald-600 font-bold">
                                    {Math.round(overallGoalProgress)}%
                                </span>
                            </div>

                            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-6">
                                <div
                                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                                    style={{ width: `${overallGoalProgress}%` }}
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
                            <h2 className="text-xl font-bold text-slate-800">Your Financial Goals</h2>
                            <div className="flex flex-wrap gap-2 mt-4">
                                {["All", ...goalPriorities, "Completed"].map((filter) => (
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
                                        onAddMoney={(amount) => addMoneyToGoal(goal.id, amount)}
                                        onEdit={() => handleEditGoal(goal)}
                                        onDelete={() => deleteGoal(goal.id)}
                                    />
                                ))
                            ) : (
                                <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center">
                                    <h3 className="font-semibold text-slate-700">
                                        {goalFilter === "All" ? "No financial goals yet" : `No ${goalFilter.toLowerCase()} goals found`}
                                    </h3>
                                    {/* Explain what the user can do when no goals match the filter. */}
                                    <p className="text-sm text-slate-500 mt-2">
                                        {goalFilter === "All"
                                            ? "Create your first financial goal to start tracking your savings progress."
                                            : "Try selecting another filter to see your other financial goals."}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="max-w-7xl mx-auto px-6 py-24">
                        <TransactionForm
                            onAddTransaction={addTransaction}
                            editingTransaction={editingTransaction}
                            onFinishEditing={finishEditing}
                        />

                        <div className="mt-10">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold">Recent Transactions</h2>
                                <span className="text-sm text-slate-500">
                                    {recentTransactions.length} {recentTransactions.length === 1 ? "transaction" : "transactions"}
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
                                            onEdit={() => editTransaction(transaction.id)}
                                            onDelete={() => deleteTransaction(transaction.id)}
                                        />
                                    ))
                                ) : (
                                    <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-8 text-center">
                                        <div className="flex justify-center mb-4">
                                            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
                                                <FiInbox className="text-slate-400 text-2xl" />
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-semibold text-slate-700">No transaction found</h3>
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