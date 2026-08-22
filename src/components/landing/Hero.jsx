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

// Import chart component.
import FinanceChart from "../charts/FinanceChart";
import ExpenseChart from "../charts/ExpenseChart";


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

    /* 
        Save all FinFlow data whenever transactions change.

        We store an object so we can add more data later:
        - transactions
        - user settings
        - financial goals
        - preferences
    */
    useEffect(() => {

        const finflowData = {

            // save all user transactions.
            transactions: transactions,

            // placeholder for future settings.
            settings:{}

        };

        // convert the object into text
        // because localStorage stores only text.
        localStorage.setItem(
            "finflow_data",
            JSON.stringify(finflowData)
        );

    }, [transactions]);


    // Store the currently selected transaction filter.
    // "All" means that every transaction should be displayed.
    const [transactionFilter, setTransactionFilter] = useState("All");

    // Store the transaction currently being edited.
    // null means that no transaction is being edited.
    const [editingTransaction, setEditingTransaction] = useState(null);


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
    Get only expense transactions.

    The ExpenseChart does not need:
    - Income
    - Salary
    - Freelance

    It only needs expenses.
    */
    const expenseTransactions = transactions.filter(
        (transaction) => transaction.type === "Expenses"
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
                    <div className="mt-10">

                        <FinanceChart
                            income={totalIncome}
                            expenses={totalExpenses}
                        />

                    </div>

                    {/*
                        Expense Chart:

                        shows where the user's money is being spent by category.
                    */}
                    <div className="mt-10">

                        <ExpenseChart
                            expenses={expenseTransactions}
                        />
                        
                    </div>


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
                                            : "bg-white text-slate-600 border border-slate-200 hover:big-slate-50"
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