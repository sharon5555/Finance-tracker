import React from "react";

// Format amounts as Nigerian Naira.
function formatCurrency(amount) {
    return `₦${Number(amount).toLocaleString("en-NG")}`;
}

function MonthlyInsights({ transactions = [] }) {
    // Get the current month, year, and day-of-month for month-to-date comparison.
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonthIndex = today.getMonth();
    const currentDay = today.getDate();

    const currentMonth = `${currentYear}-${String(
        currentMonthIndex + 1
    ).padStart(2, "0")}`;

    // Get the previous month.
    const previousDate = new Date(
        currentYear,
        currentMonthIndex - 1,
        1
    );

    const previousMonth = `${previousDate.getFullYear()}-${String(
        previousDate.getMonth() + 1
    ).padStart(2, "0")}`;

    // Prepare the last six months.
    const monthlyData = Array.from({ length: 6 }, (_, index) => {
        const date = new Date(
            currentYear,
            currentMonthIndex - (5 - index),
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

    // Store previous month-to-date expenses for equivalent period comparison
    let previousMonthEquivalentExpenses = 0;

    // Add each transaction to its correct month and calculate equivalent period spending
    transactions.forEach((transaction) => {
        if (!transaction.date) return;

        const transactionDateStr = String(transaction.date);
        const transactionMonth = transactionDateStr.slice(0, 7);
        const amount = Number(transaction.amount) || 0;
        
        // Normalise transaction type to handle variations safely
        const type = transaction.type ? String(transaction.type).trim().toLowerCase() : "";

        const monthData = monthlyData.find(
            (month) => month.key === transactionMonth
        );

        if (monthData) {
            if (type === "income") {
                monthData.income += amount;
            }

            if (type === "expense") {
                monthData.expenses += amount;
            }
        }

        // Calculate previous month's expenses up to the equivalent day-of-month
        if (type === "expense" && transactionMonth === previousMonth) {
            const dayOfTransaction = parseInt(transactionDateStr.slice(8, 10), 10);
            if (!isNaN(dayOfTransaction) && dayOfTransaction <= currentDay) {
                previousMonthEquivalentExpenses += amount;
            }
        }
    });

    // Find the current and previous month's records.
    const currentMonthData = monthlyData.find(
        (month) => month.key === currentMonth
    );

    const currentExpenses = currentMonthData?.expenses || 0;
    const currentIncome = currentMonthData?.income || 0;

    // Find the month with the highest expenses.
    const highestExpenseMonth = monthlyData.reduce(
        (highest, month) =>
            month.expenses > highest.expenses ? month : highest,
        monthlyData[0]
    );

    // Calculate the percentage change using equivalent month-to-date periods.
    let spendingChange = "No expenses recorded";
    let spendingColor = "text-gray-500";

    if (previousMonthEquivalentExpenses > 0) {
        const percentageChange =
            ((currentExpenses - previousMonthEquivalentExpenses) / previousMonthEquivalentExpenses) * 100;

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
                    Understand how your money is moving (Month-to-Date comparison).
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
                        This Month's Expenses (MTD)
                    </p>

                    <h3 className="text-xl font-bold text-gray-800 mt-2">
                        {formatCurrency(currentExpenses)}
                    </h3>

                    <p className="text-xs text-gray-500 mt-2">
                        Total money spent month-to-date.
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
                        Current month-to-date vs. previous month over equivalent days.
                    </p>
                </div>

            </div>
        </section>
    );
}

export default MonthlyInsights;