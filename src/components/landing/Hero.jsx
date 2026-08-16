// Import useState so we can store and update the balance and transactions.
import { useState } from "react";

// Import the reusable Button component.
import Button from "../common/button";

// Import the reusable TransactionCard component.
import TransactionCard from "../common/TransactionCard";

// Import the form used to create new transactions.
import TransactionForm from "../common/TransactionForm";

// Import the component that displays Balance, Income, Expenses, and Savings.
import DashboardSummary from "../common/DashboardSummary";


function Hero() {

    // Store the user's current balance.
    // We start with an initial balance of ₦250,000.
    const [balance, setBalance] = useState(250000);

    // Store all transactions created by the user.
    const [transactions, setTransactions] = useState([]);

    // store the currently selected transaction filter.
    // "All" means that every transaction should be displayed.
    const [transactionFilter, setTransactionFilter] = useState("All");

    // store the transaction currently being edited.
    const [editingTransaction, setEditingTransaction] = useState(null);


    // This function runs whenever a new transaction is submitted.
    function addTransaction(transaction) {

        // check whether the transaction already exists.
        const existingTransaction = transactions.find(
            (item) => item.id === transaction.id
        );

        // If the transaction already exists,
        // we are editing an existing transaction.
        if (existingTransaction) {

            // calculate the balance before the old transaction was added.
            let updatedBalance = balance;

            // Remove the effect of the old transaction.
            if (existingTransaction.type === "Income") {
                updatedBalance -= Number(existingTransaction.amount);
            } else {
                updatedBalance += Number(existingTransaction.amount);
            }

            // Add the effect of the updated transaction.
            if (transaction.type === "Income") {
                updatedBalance += Number(transaction.amount);
            } else {
                updatedBalance -= Number(transaction.amount);
            }

            // Replace the old transaction with the updated transaction.
            setTransactions(
                transactions.map((item) =>
                    item.id === transaction.id
                        ? transaction
                        : item
                )
            );

            // Update the balance.
            setBalance(updatedBalance);

        } else {

            // If the transaction doesn't already exist,
            // Add it as a new transaction.
            setTransactions([...transactions, transaction]);

            // Update the balance for the new transaction.
            if (transaction.type === "Income") {
                setBalance(balance + Number(transaction.amount));
            } else {
                setBalance(balance - Number(transaction.amount));
            }

        }
    }

    // Stop editing the current transaction.
    function finishEditing() {

        // clear the editing transaction.
        setEditingTransaction(null);
    }

    // This function removes a transaction from the transactions array.
    function deleteTransaction(id) {

        //find the transaction that the user wants to delete.
        const transactionToDelete = transactions.find(
            (transaction) => transaction.id === id
        );

        // If the transaction cannot be found, stop the function.
        if(!transactionToDelete) {
            return;
        }

        //Remove the selected transaction from the array.
        setTransactions(
            transactions.filter(
                (transaction) => transaction.id !== id
            )
        );

        // Reverse the effect that the transaction had on the balance.
        if (transactionToDelete.type === "Income") {

            //If is was income, substract it from the balance.
            setBalance(
                balance - Number(transactionToDelete.amount)
            );
        } else {

            //If it was an expense, add it back to the balance.
            setBalance(
                balance + Number(transactionToDelete.amount)
            );
        }

    }

    // This function finds a transaction and prepare it to be edited.
    function editTransaction(id) {

        // Find the transaction that the user wants to edit.
        const transactionToEdit = transactions.find(
            (transaction) => transaction.id === id
        );

        // If the transaction does not exist, stop the function.
        if(!transactionToEdit) {
            return;
        }

        //store the transaction so TransactionForm can use its information.
        setEditingTransaction(transactionToEdit);
    }

    // Calculate the total amount of all Income transactions.
    // filter() keeps only transactions whose type is "Income".
    // reduce() adds all of those income amounts together.
    const totalIncome = transactions
        .filter((transaction) => transaction.type === "Income")
        .reduce(
            (total, transaction) => total + Number(transaction.amount),
            0
        );


    // Calculate the total amount of all Expense transactions.
    // filter() keeps only transactions whose type is "Expense".
    // reduce() adds all of those expense amounts together.
    const totalExpenses = transactions
        .filter((transaction) => transaction.type === "Expense")
        .reduce(
            (total, transaction) => total + Number(transaction.amount),
            0
        );


    // Savings are calculated from Income minus Expenses.
    const savings = totalIncome - totalExpenses;

    // create a list of transactions based on the selected filter.
    const filteredTransactions = transactions.filter((transaction) => {

        // If "All" is selected, display every transaction.
        if (transactionFilter === "All") {
            return true;
        }

        // Otherwise, only display transactions matching the selected type.
        return transaction.type === transactionFilter;
    });


    // Create an array containing the information for our four summary cards.
    const stats = [

        // Display the user's current balance.
        {
            title: "Total Balance",
            amount: `₦${balance.toLocaleString()}`,
            color: "text-emerald-600",
        },

        // Display the total income calculated from transactions.
        {
            title: "Total Income",
            amount: `₦${totalIncome.toLocaleString()}`,
            color: "text-blue-600",
        },

        // Display the total expenses calculated from transactions.
        {
            title: "Total Expenses",
            amount: `₦${totalExpenses.toLocaleString()}`,
            color: "text-red-600",
        },

        // Display the amount left after subtracting expenses from income.
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
                Keeps our content centered and gives it
                horizontal and vertical spacing.
            */}
            <div className="max-w-7xl mx-auto px-6 py-24">

                {/* 
                    Main Content:
                    Contains the welcome message, buttons,
                    dashboard summary, and transaction area.
                */}
                <div>

                    {/* Welcome message shown at the top of the page. */}
                    <p className="text-emerald-600 font-semibold mb-3">
                        Welcome to Finflow
                    </p>


                    {/* Main heading of the FinFlow page. */}
                    <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                        Take Control of Your Money Today
                    </h1>


                    {/* Short description explaining what FinFlow does. */}
                    <p className="mt-6 text-lg text-slate-600">
                        Track your income, expenses, savings, and financial goals in one
                        beautiful and secure application.
                    </p>


                    {/* 
                        Main buttons:
                        These are currently our Get Started
                        and Learn More buttons.
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
                        Displays our four financial statistics:
                        Balance, Income, Expenses, and Savings.
                    */}
                    <div className="mt-10">

                        <DashboardSummary stats={stats} />

                    </div>


                    {/* 
                        Transaction Area:
                        Contains the transaction form and
                        the list of recent transactions.

                        On small screens:
                        The sections appear one below another.

                        On large screens:
                        The sections appear side-by-side.
                    */}
                    <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">


                        {/* 
                            Transaction Form:
                            Allows the user to enter and save
                            a new income or expense.
                            Receives the transaction being edited.
                            If editingTransaction is null, the form works normally.
                        */}
                        <TransactionForm
                            onAddTransaction={addTransaction}
                            editingTransaction={editingTransaction}
                            onFinishEditing={finishEditing}
                        />


                        {/* 
                            Recent Transactions:
                            Displays all transactions saved
                            by the user.
                        */}
                        <div className="mt-10">

                            <h2 className="text-2xl font-bold mb-4">
                                Recent Transactions
                            </h2>

                            {/* 
                                Filter buttons: 
                                The user can choose to see all transactions,
                                income transactions, or expenses transactions.
                             */}
                            
                            <div className="flex gap-3 mb-6">

                                {/* All transactions button */}
                                <button
                                    onClick={() => setTransactionFilter("All")}
                                    className={`px-4 py-2 rounded-lg font-medium ${
                                        transactionFilter === "All" 
                                            ? "bg-emerald-600 text-white" 
                                            : "bg-white text-slate-600 border"
                                    }`}
                                >
                                    All
                                </button>

                                {/* Income transactions buttons */}
                                <button
                                    onClick={() => setTransactionFilter("Income")}
                                    className={`px-4 py-2 rounded-lg font-medium ${
                                        transactionFilter ==="Income" 
                                            ? "bg-emerald-600 text-white" 
                                            : "bg-white text-slate-600 border"
                                }`}
                                >
                                    Income
                                </button>

                                {/* Expenses transaction button  */}
                                <button
                                    onClick={() => setTransactionFilter("Expense")}
                                    className={`px-4 py-2 rounded-lg font-medium ${
                                        transactionFilter === "Expense"
                                            ? "bg-emerald-600 text-white"
                                            : "bg-white text-slate-600 border"
                                    }`}
                                >
                                    Expenses
                                </button>
                            </div>


                            {/* 
                                map() goes through every transaction
                                in the transactions array.

                                For every transaction, React creates
                                one TransactionCard component.

                                Display only the transaction hat match the selected filter.

                                Transaction list:
                                If there are transactions that match the selected filter,
                                display them using the reusable TransactionCard component.
                                Otherwise, display a helpful message to the user.
                            */}
                            {filteredTransactions.length > 0 ? (
                                filteredTransactions.map((transaction) => (

                                <TransactionCard
                                    key={transaction.id}
                                    title={transaction.title}
                                    amount={transaction.amount}
                                    type={transaction.type}
                                    category={transaction.category}
                                    date={transaction.date}

                                    // Allow the user to edit this transaction.
                                    onEdit={() => editTransaction(transaction.id)}

                                    // Allow the user to delete this transaction.
                                    onDelete={() => deleteTransaction(transaction.id)}
                                />

                            ))

                            ) : (

                                // Display this message when there are no matching transactions.
                                <div className="bg-white border border-dashed border-slate-300
                                                rounded-2xl p-8 text-center">

                                                    {/* Empty-state heading */}
                                                    <h3 className="text-lg font-semibold text-slate-700">
                                                        No transaction found
                                                    </h3>

                                                    {/* Empty-state heading */}
                                                    <p className="text-sm text-slate-500 mt-2">
                                                        {transactionFilter === "All"
                                                            ? "Add your first transaction to start tracking your money."
                                                            : `No ${transactionFilter.toLocaleLowerCase()} transactions found.`}
                                                    </p>
                                                </div>
                            )}

                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
}


export default Hero;