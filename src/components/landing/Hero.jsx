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
        Save all FinFlow data whenever transactions change.

        We store an object so we can add more data later:
        - transactions
        - user settings
        - financial goals
        - preferences

        This keeps the user's data available
        even after refreshing the browser.
    */
    useEffect(() => {

        const finflowData = {

            // save all user transactions.
            transactions: transactions,

            //Save all financial goals.
            goals: goals,

            //Save all monthly budgets.
            budgets: budgets,

            // placeholder for future settings.
            settings:{}

        };

        // convert the object into text, 
        // because localStorage stores only text.
        localStorage.setItem(
            "finflow_data",
            JSON.stringify(finflowData)
        );

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

    /*
        Store the currently selected goal filter.

        "All" means that every financial goal should be displayed.
    */
    const [goalFilter, setGoalFilter] = useState("All");


    /*
      Add a new financial goal or update an existing one.
      Always use the latest goals array.
    */
    function addGoal(goal) {
        setGoals((previousGoals) => {
            // Check whether this goal already exists.
            const existingGoal = previousGoals.some(
                (item) => item.id === goal.id
            );

            // Update the existing goal if it is found.
            if (existingGoal) {
                return previousGoals.map((item) =>
                    item.id === goal.id ? goal : item
                );
            }

            // Otherwise, add the new goal.
            return [...previousGoals, goal];
        });
    }

    /*
        Add money to a specific financial goal.

        Functional state updates ensure we always use
        the latest version of the goals array.
    */
    function addMoneyToGoal(goalId, amount) {

        // Convert the amount into a number.
        const numericAmount = Number(amount);

        // Reject invalid amounts.
        if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
            return;
        }

        setGoals((previousGoals) =>
            previousGoals.map((goal) => {

                // Find the goal receiving the money.
                if (goal.id === goalId) {

                    // Convert the existing savings into a number.
                    const currentSaved = Number(goal.currentAmount) || 0;

                    // Add the new amount to the existing savings.
                    return {
                        ...goal,
                        currentAmount: currentSaved + numericAmount
                    };
                }

                return goal;
            })
        );
    }

    /*
      Delete a financial goal after user confirmation.
    */
    function deleteGoal(goalId) {
        // Ask the user to confirm the deletion.
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this financial goal?"
        );

        // Stop if the user cancels.
        if (!confirmDelete) {
            return;
        }

        // Remove the goal using the latest goals array.
        setGoals((previousGoals) =>
            previousGoals.filter((goal) => goal.id !== goalId)
        );
    }


    /*
        Select the goal that the user wants to edit.

        We find the goal using its ID and store it
        in editingGoal.
    */
    function editGoal(goalId) {

        // Find the selected goal.
        const goalToEdit = goals.find(
            (goal) => goal.id === goalId
        );


        // Stop if the goal cannot be found.
        if (!goalToEdit) {
            return;
        }


        // Store the selected goal.
        setEditingGoal(goalToEdit);

    }

    function handleEditGoal(goal) {
        setEditingGoal(goal);
    }

        // PART D


    /*
      Add a new transaction or update an existing one.
    */
    function addTransaction(transaction) {
        // Use the latest transactions array.
        setTransactions((previousTransactions) => {
            // Check whether the transaction already exists.
            const existingTransaction = previousTransactions.some(
                (item) => item.id === transaction.id
            );

            // Update the existing transaction.
            if (existingTransaction) {
                return previousTransactions.map((item) =>
                    item.id === transaction.id ? transaction : item
                );
            }

            // Add a new transaction.
            return [...previousTransactions, transaction];
        });
    }

        // PART E


    // Stop editing the current transaction.
    function finishEditing() {

        // Clear the currently edited transaction.
        setEditingTransaction(null);
    }


    /*
      Delete a transaction after user confirmation.
    */
    function deleteTransaction(id) {
        // Ask the user to confirm before deleting.
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this transaction?"
        );

        // Stop if the user cancels.
        if (!confirmDelete) {
            return false;
        }

        // Remove the transaction using the latest state.
        setTransactions((previousTransactions) =>
            previousTransactions.filter(
                (transaction) => transaction.id !== id
            )
        );

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


    // Add a new budget or update an existing category's budget.
    function addBudget(newBudget) {

        setBudgets((previousBudgets) => {

            // Compare category names without case differences.
            const existingBudget = previousBudgets.find(
                (budget) =>
                    String(budget.category).trim().toLowerCase() ===
                    String(newBudget.category).trim().toLowerCase()
            );

            // Update the existing category budget.
            if (existingBudget) {

                return previousBudgets.map((budget) =>
                    budget.id === existingBudget.id
                        ? { ...budget, amount: Number(newBudget.amount) }
                        : budget
                );
            }

            // Otherwise, create a new budget.
            return [
                ...previousBudgets,
                {
                    ...newBudget,
                    amount: Number(newBudget.amount),
                    id: Date.now().toString()
                }
            ];
        });
    }

    // Delete a budget.
    function deleteBudget(id) {
        setBudgets((previousBudgets) =>
            previousBudgets.filter((budget) => budget.id !== id)
        );
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
        <section className="bg-slate-50">

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


                    <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
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