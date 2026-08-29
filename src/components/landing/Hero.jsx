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

// Import chart component.
import FinanceChart from "../charts/FinanceChart";
import ExpenseChart from "../charts/ExpenseChart";
import MonthlySummary from "../charts/MonthlySummary";



//   PART A

function Hero() {

    // Store the user's starting balance.
    // We start with an initial balance of ₦250,000.
    const startingBalance = 250000;


    // Store all transactions created by the user.
    /*
        When FinFlow opens:
        - check if saved transactions exist in localStorage.
        - if they exist, load them.
        - if not, start with an empty array.
     */
    const [transactions, setTransactions] = useState(() => {

        // Get saved FinFlow data from the browser.
        const savedData = localStorage.getItem(
            "finflow_data"
        );

        // if data exists:
        // convert it back from text into JavaScript.
        if (savedData) {

            const parsedData = JSON.parse(savedData);

            // Make sure transactions is always an array.
            // This prevents errors like:
            // Cannot read properties of undefined (reading 'filter')
            return Array.isArray(parsedData.transactions) 
                ? parsedData.transactions 
                : [];
        }

        // If there is no saved data, start with an empty array.
        return [];
    });


    // PART B

    /*
        Store financial goal.

        When FinFlow opens:
        - Check whether saved goals exist in localStorage.
        - If they exist, load them.
        - If they don't exist, start with an empty array.
    */
    const [goals, setGoals] = useState(() => {

        // Get the saved FinFlow data from the browser.
        const savedData = localStorage.getItem("finflow_data");

        // If saved data exists, convert it back into javascript.
        if (savedData) {

            const parsedData = JSON.parse(savedData);

            //Make sure goals is always an array.
            return Array.isArray(parsedData.goals)
                ? parsedData.goals
                : [];

        }

        // If there is no saved data, start with no goals.
        return [];

    });


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

            // placeholder for future settings.
            settings:{}

        };

        // convert the object into text, 
        // because localStorage stores only text.
        localStorage.setItem(
            "finflow_data",
            JSON.stringify(finflowData)
        );

    }, [transactions, goals]);


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
        Add or update a financial goal.

        If the goal already exists, we update it.
        If it does not exist, we create a new goal.
    */
    function addGoal(goal) {

        // Check whether this goal already exists.
        const existingGoal = goals.find(
            (item) => item.id === goal.id
        );


        // If the goal already exists, update it.
        if (existingGoal) {

            setGoals(
                goals.map((item) =>
                    item.id === goal.id
                        ? goal
                        : item
                )
            );

            return;
        }


        // If the goal does not exist,
        // add it as a new goal.
        setGoals([...goals, goal]);

    }

    /*
    Add money to a specific financial goal.

    GoalCard sends the amount the user entered.
    This function finds the correct goal and
    increases its current amount.
*/
    function addMoneyToGoal(goalId, amount) {

        setGoals(
            goals.map((goal) => {

                // Find the goal that the user is updating.
                if (goal.id === goalId) {

                    // Increase the amount saved toward the goal.
                    return {
                        ...goal,
                        currentAmount: goal.currentAmount + amount
                    };
                }

                // Leave all other goals unchanged.
                return goal;
            })
        );
    }

    /*
    Delete a financial goal.

    We first ask the user to confirm.
    If they confirm, we remove the goal
    from the goals array.
    */
    function deleteGoal(goalId) {

        // Ask the user to confirm the deletion.
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this financial goal?"
        );


        // Stop if the user clicks Cancel.
        if (!confirmDelete) {
            return;
        }


        // Remove the selected goal from the goals array.
        setGoals(
            goals.filter((goal) => goal.id !== goalId)
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

        // PART D


    // Add a new transaction or update an existing transaction.
    function addTransaction(transaction) {

        // Check whether this transaction already exists.
        const existingTransaction = transactions.find(
            (item) => item.id === transaction.id
        );

        // If the transaction already exists,
        // replace it with the updated transaction.
        if (existingTransaction) {

            // Replace the old transaction with the updated transaction.
            setTransactions(
                transactions.map((item) =>
                    item.id === transaction.id
                        ? transaction
                        : item
                )
            );

            // Stop the function after updating the transaction.
            return;
        }

        // If the transaction does not exist,
        // add it to the transactions array.
        setTransactions([...transactions, transaction]);
    }

        // PART E


    // Stop editing the current transaction.
    function finishEditing() {

        // Clear the currently edited transaction.
        setEditingTransaction(null);
    }


    // Delete a transaction from the transactions array.
    function deleteTransaction(id) {

        // Ask the user to confirm before deleting the transaction.
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this transaction?"
        );

        // If the user clicks Cancel, stop the function.
        if (!confirmDelete) {
            return;
        }

        // Remove the transaction with the matching ID.
        setTransactions(
            transactions.filter(
                (transaction) => transaction.id !== id
            )
        );
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


    // Calculate the total amount of all Income transactions.
    // filter() keeps only Income transactions.
    // reduce() adds all income amounts together.
    const totalIncome = transactions
        .filter((transaction) => transaction.type === "Income")
        .reduce(
            (total, transaction) => total + Number(transaction.amount),
            0
        );


    // Calculate the total amount of all Expense transactions.
    // filter() keeps only Expense transactions.
    // reduce() adds all expense amounts together.
    const totalExpenses = transactions
        .filter((transaction) => transaction.type === "Expense")
        .reduce(
            (total, transaction) => total + Number(transaction.amount),
            0
        );


    // Calculate the current balance.
    // Starting balance + income - expenses.
    const balance = startingBalance + totalIncome - totalExpenses;


    // Calculate savings.
    // Savings = total income - total expenses.
    const savings = totalIncome - totalExpenses;


    /*
        Calculate finanacial goal statistics.

        These values will be used to create a quick summary 
        of the user's goals.
    */

    /*
        Calculate financial goal statistics.

        These values will be used to create
        a quick summary of the user's goals.
    */

    // Count how many goals the user has.
    const totalGoals = goals.length;


    // Add together the amount saved across all goals.
    const totalGoalSaved = goals.reduce(
        (total, goal) => total + Number(goal.currentAmount),
        0
    );


    // Count goals that have been completed.
    const completedGoals = goals.filter(
        (goal) => goal.currentAmount >= goal.targetAmount
    ).length;


    // Add together all goal target amounts.
    const totalGoalTarget = goals.reduce(
        (total, goal) => total + Number(goal.targetAmount),
        0
    );

    /*
        Calculate the total amount still needed 
        across all financial goals.
    */
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

    /*
    Get only expense transactions.

    The ExpenseChart does not need:
    - Income
    - Salary
    - Freelance

    It only needs expenses.
    */
    const expenseTransactions = transactions.filter(
        (transaction) => transaction.type === "Expense"
    );


    // Create a list of transactions based on the selected filter.
    const filteredTransactions = transactions.filter((transaction) => {

        // If "All" is selected, display every transaction.
        if (transactionFilter === "All") {
            return true;
        }

        // Otherwise, only display transactions
        // matching the selected type.
        return transaction.type === transactionFilter;
    });

    // Sort transactions by date:
    // Newest transactions appear first.
    const sortedTransactions = [...filteredTransactions].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
    );


    // Show only the five most recent transactions.
    // The full transaction list remains stored in transactions.
    const recentTransactions = sortedTransactions.slice(0, 5);


    // Create an array containing the information
    // for our four dashboard summary cards.
    const stats = [

        // Display the user's current balance.
        {
            title: "Total Balance",
            amount: `₦${balance.toLocaleString()}`,
            color: "text-emerald-600",
        },

        // Display the total income.
        {
            title: "Total Income",
            amount: `₦${totalIncome.toLocaleString()}`,
            color: "text-blue-600",
        },

        // Display the total expenses.
        {
            title: "Total Expenses",
            amount: `₦${totalExpenses.toLocaleString()}`,
            color: "text-red-600",
        },

        // Display savings.
        {
            title: "Savings",
            amount: `₦${savings.toLocaleString()}`,
            color: "text-purple-600",
        },
    ];


    /*
        Sort goals by priority.

        High goals appear first,
        followed by Medium,
        then Low.
    */
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

    /*
        Filter the goals based on the user's selection.

        Available filters: 
        - All
        -High
        -Medium
        -Low
        -Completed
    */
    const filteredGoals = sortedGoals.filter((goal) => {

        //Show every goal.
        if (goalFilter === "All") {
            return true;

        }

        //Show only completed goals.
        if (goalFilter === "Completed") {
            return Number(goal.currentAmount) >= Number(goal.targetAmount);

        }

        // Show goals matching the selected priority.
        return goal.priority === goalFilter;

    });


        // PART G

    // Return the main Hero section of the FinFlow page.
    return (
        <section className="bg-slate-50">

            {/*
                Main container:
                Keeps the content centered and adds spacing.
            */}
            <div className="max-w-7xl mx-auto px-6 py-24">

                {/*
                    Main content:
                    Contains the welcome message, buttons,
                    dashboard summary, transaction form,
                    and recent transactions.
                */}
                <div>

                    {/* Welcome message. */}
                    <p className="text-emerald-600 font-semibold mb-3">
                        Welcome to Finflow
                    </p>


                    {/* Main page heading. */}
                    <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                        Take Control of Your Money Today
                    </h1>


                    {/* Short description of FinFlow. */}
                    <p className="mt-6 text-lg text-slate-600">
                        Track your income, expenses, savings, and financial goals in one
                        beautiful and secure application.
                    </p>


                    {/*
                        Main action buttons:
                        Get Started and Learn More.
                    */}
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


                    {/*
                        Dashboard Summary:
                        Displays Balance, Income, Expenses, and Savings.
                    */}
                    <div className="mt-10">

                        <DashboardSummary stats={stats} />

                    </div>


                    {/*
                        Finance Chart:

                        Displays a visual comparison
                        between total income and total expenses.
                    */}
                    <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/*
                            Income vs Expenses🧮 shows how much money came in
                            compared with how much was spent.
                        */}

                        <FinanceChart
                            income={totalIncome}
                            expenses={totalExpenses}
                        />


                    {/*
                        Expense Chart:

                        shows where the user's money is being spent by category.
                    */}

                        <ExpenseChart
                            expenses={expenseTransactions}
                        />
                        
                    </div>

                    {/*
                        Monthly Summary:

                        Displays the current income,
                        expenses, and savings totals.
                    */}
                    <div className="mt-8">

                        <MonthlySummary
                            income={totalIncome}
                            expenses={totalExpenses}
                            savings={savings}
                        />

                    </div>


                    {/*
                        Goals Summary: 
                        Gives the user a quick overview of all
                        their financial goals.
                    */}
                    <div className="mt-10">

                        <div className="bg-white rounded-2xl shadow-sm border-slate-100 p-6">

                            {/* Section heading */}
                            <div className="flex item-center justify-between mb-6">

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

                            {/* Overall Progress bar */}
                            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-6">

                                <div
                                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                                    style={{
                                        width: `${overallGoalProgress}%`
                                    }}
                                >

                                </div>
                            </div>


                                {/* Goal statistics */}
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

                                    {/* Total goals */}
                                    <div className="bg-slate-50 rounded-xl p-4">
                                        <p className="text-sm text-slate-500">
                                            Total Goals
                                        </p>

                                        <p className="text-2xl font-bold text-slate-800 mt-1">
                                            {totalGoals}
                                        </p>
                                    </div>

                                    {/* Amount saved */}
                                    <div className="bg-slate-50 rounded-xl p-4">
                                        <p className="text-sm text-slate-500">
                                            Saved
                                        </p>

                                        <p className="text-xl font-bold text-emerald-600 mt-1">
                                            ₦{totalGoalSaved.toLocaleString()}
                                        </p>
                                    </div>

                                    {/* Completed goals */}
                                    <div className="bg-slate-50 rounded-xl p-4">
                                        <p className="text-sm text-slate-500">
                                            Completed
                                        </p>

                                        <p className="text-2xl font-bold text-purple-600 mt-1">
                                            {completedGoals}
                                        </p>
                                    </div>

                                    {/* Target amount */}
                                    <div className="bg-slate-50 rounded-xl p-4">
                                        <p className="text-sm text-slate-500">
                                            Target
                                        </p>

                                        <p className="text-xl font-bold text-blue-600 mt-1">
                                            ₦{totalGoalTarget.toLocaleString()}
                                        </p>
                                    </div>

                                    {/*
                                        Remaining amount:

                                        Shows how much money is still needed 
                                        to complete all financial goals.
                                    */}
                                    <div className="bg-slate-50 rounded-xl p-4">

                                        <p className="text-sm text-slate-500">
                                            Remaining
                                        </p>

                                        <p className="text-xl font-bold text-red-600 mt-1">
                                            ₦{totalGoalRemaining.toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                        </div>

                    </div>



                    {/*
                        Financial Goal:

                        Displays the user's progress
                        toward the current financial goal.
                    */}
                    <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* 
                            GoalForm handles both creating
                            and editing financial goals.
                        */}
                        <GoalForm
                            onAddGoal={addGoal}
                            editingGoal={editingGoal}
                            onFinishEditing={() => setEditingGoal(null)}
                        />


                        {/* Existing Goals */}
                        <div className="space-y-4">

                            <h2 className="text-xl font-bold text-slate-800">
                                Your Financial Goals
                            </h2>

                            {/*
                                Goal filters.

                                The user can quickly switch between
                                different types of goals.
                            */}
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



                            {/* 
                                Display each financial goal.

                                GoalCard sends the amount to add back
                                to this component through addMoneyToGoal.
                            */}

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

                                        onEdit={() =>
                                            editGoal(goal.id)
                                        }

                                        onDelete={() =>
                                            deleteGoal(goal.id)
                                        }
                                    />
                                ))

                            ) : (

                                <div className="bg-white rounded-2xl border border-dashed
                                    border-slate-300 p-8 text-center">

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


                    {/*
                        Transaction Area:
                        Contains the transaction form and
                        recent transactions.

                        On small screens:
                        They appear one below another.

                        On large screens:
                        They appear side-by-side.
                    */}
                    <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">


                        {/*
                            Transaction Form:
                            Allows the user to add or edit transactions.
                        */}
                        <TransactionForm
                            onAddTransaction={addTransaction}
                            editingTransaction={editingTransaction}
                            onFinishEditing={finishEditing}
                        />


                        {/*
                            Recent Transactions:
                            Displays the user's recent transactions.
                        */}
                        <div className="mt-10">

                            {/*
                                Section heading:
                                Displays the title and number
                                of transactions currently shown.
                            */}
                            <div className="flex items-center justify-between mb-4">

                                {/* Recent transactions heading. */}
                                <h2 className="text-2xl font-bold">
                                    Recent Transactions
                                </h2>

                                {/*
                                    Transaction count:
                                    Shows how many transactions are
                                    currently displayed.
                                */}
                                <span className="text-sm text-slate-500">
                                    {recentTransactions.length}{" "}
                                    {recentTransactions.length === 1
                                        ? "transaction"
                                        : "transactions"}
                                </span>

                            </div>


                            {/*
                                Filter buttons:
                                Allow the user to display
                                All, Income, or Expenses.
                            */}
                            <div className="flex flex-wrap gap-2 mb-6">

                                {/* All transactions button. */}
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


                                {/* Income transactions button. */}
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


                                {/* Expense transactions button. */}
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


                            {/*
                                Transaction list:
                                max-h-[500px] prevents the list from
                                making the page extremely tall.

                                overflow-y-auto adds a vertical scrollbar
                                when the content becomes taller than 500px.
                            */}
                            <div className="max-h-[500px] overflow-y-auto pr-2">

                                {/*
                                    Check whether there are transactions
                                    to display.
                                */}
                                {recentTransactions.length > 0 ? (

                                    /*
                                        Display each recent transaction
                                        using the reusable TransactionCard.
                                    */
                                    recentTransactions.map((transaction) => (

                                        <TransactionCard
                                            key={transaction.id}
                                            title={transaction.title}
                                            amount={transaction.amount}
                                            type={transaction.type}
                                            category={transaction.category}
                                            date={transaction.date}

                                            // Allow the user to edit this transaction.
                                            onEdit={() =>
                                                editTransaction(transaction.id)
                                            }

                                            // Allow the user to delete this transaction.
                                            onDelete={() =>
                                                deleteTransaction(transaction.id)
                                            }
                                        />

                                    ))

                                ) : (

                                    /*
                                        Empty state:
                                        Display this when there are no
                                        transactions matching the filter.
                                    */
                                    <div
                                        className="bg-white border border-dashed
                                        border-slate-300 rounded-2xl p-8 text-center"
                                    >

                                        {/*
                                            Empty-state icon:
                                            Gives the user a visual indication that there are 
                                            currently no transactions.

                                         */}

                                        <div className="flex justify-center mb-4">
                                            <div className="w-14 h-14 rounded-full bg-slate-100
                                                flex items-center justify-center">
                                                    <FiInbox className="text-slate-400 text-2xl" />
                                                </div>

                                        </div>

                                        {/* Empty-state heading. */}
                                        <h3 className="text-lg font-semibold text-slate-700">
                                            No transaction found
                                        </h3>

                                        {/* Empty-state description. */}
                                        <p className="text-sm text-slate-500 mt-2">
                                            {transactionFilter === "All"
                                                ? "Add your first transaction to start tracking your money."
                                                : `No ${transactionFilter.toLowerCase()} transactions found.`}
                                        </p>

                                    </div>
                                )}

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
}


export default Hero;