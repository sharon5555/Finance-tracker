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


    // This function runs whenever a new transaction is submitted.
    function addTransaction(transaction) {

        // Add the new transaction to our transactions array.
        setTransactions([...transactions, transaction]);

        // Check whether the transaction is Income or Expense.
        if (transaction.type === "Income") {

            // If it is Income, add the amount to the balance.
            setBalance(balance + Number(transaction.amount));

        } else {

            // If it is an Expense, subtract the amount from the balance.
            setBalance(balance - Number(transaction.amount));
        }
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
                        */}
                        <TransactionForm
                            onAddTransaction={addTransaction}
                        />


                        {/* 
                            Recent Transactions:
                            Displays all transactions saved
                            by the user.
                        */}
                        <div>

                            <h2 className="text-2xl font-bold mb-4">
                                Recent Transactions
                            </h2>


                            {/* 
                                map() goes through every transaction
                                in the transactions array.

                                For every transaction, React creates
                                one TransactionCard component.
                            */}
                            {transactions.map((transaction) => (

                                <TransactionCard
                                    key={transaction.id}
                                    title={transaction.title}
                                    amount={transaction.amount}
                                    type={transaction.type}
                                    category={transaction.category}
                                    date={transaction.date}
                                />

                            ))}

                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
}


export default Hero;