import { useState } from "react";
import StatCard from "../common/StatCard"
import Button from "../common/button"
import TransactionCard from "../common/TransactionCard"
import TransactionForm from "../common/TransactionForm";
function Hero() {

    const [balance, setBalance] = useState(250000);
    const [transactions, setTransactions] = useState([]);

    function addTransaction(transaction) {
        setTransactions([...transaction, transaction]);

        if(transaction.type === "Income") {
            setBalance(balance + Number(transaction.amount));
        } else {
            setBalance(balance - Number(transaction.amount));
        }
    }

    const stats = [

        {
            title: "Total Balance",
            amount: `₦${balance.toLocaleString()}`,
            color: "text-emerald-600",
        },

        {
            title: "Total Balance",
            amount: "₦320,000",
            color: "text-blue-600",
        },

        {
            title: "Expenses",
            amount: "₦70,000",
            color: "text-red-600",
        },
        
    ];
    return(
        <section className="bg-slate-50">
            <div className="max-w-7xl mx-auto px-6 py-24 flex flex-col
            lg:flex-row items-center justify-between gap-16">

                {/* Left Side */}
                <div className="flex-1">
                    <p className="text-emerald-600 font-semibold mb-3">
                        Welcome to Finflow
                    </p>

                    <h1 className="text-5xl lg:text-6xl font-bold text-slate-900
                    leading-tight">
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

                    <TransactionForm onAddTranaction={addTransaction} />

                    <div className="mt-10">
                        <h2 className="text-2xl font-bold mb-4">
                            Recent Transaction
                        </h2>

                        {transactions.map((transaction) => (
                            <TransactionCard 
                                key={transaction.id}
                                title={transaction.title}
                                amount={transaction.amount}
                                type={transaction.type}
                            />
                        ))}
                    </div>
                </div>

                {/* Right Side */}
                <div className="flex-1 flex justify-center">
                    <div className="w-full max-w-md bg-white rounded-3xl 
                        shadow-8xl p-6">
                        <h3 className="text-xl font-bold text-slate-800 mb-6">
                            Dashboard Preview
                        </h3>

                        <div className="space-y-4">
                            {stats.map((stat) => (
                                <StatCard
                                key={stat.title}
                                title={stat.title}
                                amount={stat.amount}
                                color={stat.color}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero;