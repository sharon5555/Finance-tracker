
import React from "react";

// Format amounts as Nigerian Naira.
function formatCurrency(amount) {
    return `₦${Number(amount).toLocaleString("en-NG")}`;
}

function MonthlyInsights({ transactions = [] }) {
    // Get the current month and year.
    const today = new Date();

    const currentMonth = `${today.getFullYear()}-${String(
        today.getMonth() + 1
    ).padStart(2, "0")}`;

    // Get the previous month.
    const previousDate = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        1
    );

    const previousMonth = `${previousDate.getFullYear()}-${String(
        previousDate.getMonth() + 1
    ).padStart(2, "0")}`;

    // Prepare the last six months.
    const monthlyData = Array.from({ length: 6 }, (_, index) => {
        const date = new Date(
            today.getFullYear(),
            today.getMonth() - (5 - index),
            1
        );

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");

        return {
            key: `${year}-${month}`,
            label: date.toLocaleDateString("en-GB", {
                month: "long",
                year: "numeric"
            }),
            income: 0,
            expenses: 0
        };
    });

    // Add each transaction to its correct month.
    transactions.forEach((transaction) => {
        if (!transaction.date) return;

        const transactionMonth = String(transaction.date).slice(0, 7);

        const monthData = monthlyData.find(
            (month) => month.key === transactionMonth
        );

        if (!monthData) return;

        const amount = Number(transaction.amount) || 0;

        if (transaction.type === "Income") {
            monthData.income += amount;
        }

        if (transaction.type === "Expense") {
            monthData.expenses += amount;
        }
    });

    // Find the current and previous month's records.
    const currentMonthData = monthlyData.find(
        (month) => month.key === currentMonth
    );

    const previousMonthData = monthlyData.find(
        (month) => month.key === previousMonth
    );

    const currentExpenses = currentMonthData?.expenses || 0;
    const currentIncome = currentMonthData?.income || 0;
    const previousExpenses = previousMonthData?.expenses || 0;

    // Find the month with the highest expenses.
    const highestExpenseMonth = monthlyData.reduce(
        (highest, month) =>
            month.expenses > highest.expenses ? month : highest,
        monthlyData[0]
    );

    // Calculate the percentage change in spending.
    let spendingChange = "No expenses recorded";
    let spendingColor = "text-gray-500";

    if (previousExpenses > 0) {
        const percentageChange =
            ((currentExpenses - previousExpenses) / previousExpenses) * 100;

        if (percentageChange > 0) {
            spendingChange = `${percentageChange.toFixed(1)}% increase`;
            spendingColor = "text-red-600";
        } else if (percentageChange < 0) {
            spendingChange = `${Math.abs(percentageChange).toFixed(1)}% decrease`;
            spendingColor = "text-green-600";
        } else {
            spendingChange = "No change";
            spendingColor = "text-gray-500";
        }
    } else if (currentExpenses > 0) {
        spendingChange = "Spending started this month";
        spendingColor = "text-orange-600";
    }

    // Check whether any expenses have been recorded.
    const hasExpenses = monthlyData.some(
        (month) => month.expenses > 0
    );

    return (
        <section className="w-full rounded-2xl bg-white p-5 sm:p-6 shadow-sm border border-gray-100">

            {/* Section heading */}
            <div className="mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                    Monthly Spending Insights
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                    Understand how your money is moving.
                </p>
            </div>

            {/* Insight cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Highest spending month */}
                <div className="rounded-xl bg-red-50 p-4">
                    <p className="text-sm text-gray-600">
                        Highest Spending Month
                    </p>

                    <h3 className="text-lg font-bold text-gray-800 mt-2">
                        {hasExpenses
                            ? highestExpenseMonth.label
                            : "No spending yet"}
                    </h3>

                    <p className="text-sm text-red-600 font-semibold mt-1">
                        {formatCurrency(highestExpenseMonth.expenses)}
                    </p>

                    <p className="text-xs text-gray-500 mt-2">
                        Based on the last six months.
                    </p>
                </div>

                {/* Current month expenses */}
                <div className="rounded-xl bg-orange-50 p-4">
                    <p className="text-sm text-gray-600">
                        This Month's Expenses
                    </p>

                    <h3 className="text-xl font-bold text-gray-800 mt-2">
                        {formatCurrency(currentExpenses)}
                    </h3>

                    <p className="text-xs text-gray-500 mt-2">
                        Total money spent this month.
                    </p>
                </div>

                {/* Current month income */}
                <div className="rounded-xl bg-green-50 p-4">
                    <p className="text-sm text-gray-600">
                        This Month's Income
                    </p>

                    <h3 className="text-xl font-bold text-gray-800 mt-2">
                        {formatCurrency(currentIncome)}
                    </h3>

                    <p className="text-xs text-gray-500 mt-2">
                        Total money received this month.
                    </p>
                </div>

                {/* Spending comparison */}
                <div className="rounded-xl bg-blue-50 p-4">
                    <p className="text-sm text-gray-600">
                        Spending Compared to Last Month
                    </p>

                    <h3 className={`text-lg font-bold mt-2 ${spendingColor}`}>
                        {spendingChange}
                    </h3>

                    <p className="text-xs text-gray-500 mt-2">
                        Compared with the previous month.
                    </p>
                </div>

            </div>
        </section>
    );
}

export default MonthlyInsights;
