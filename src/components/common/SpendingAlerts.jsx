
import React from "react";

function SpendingAlerts({ transactions = [] }) {
    // Get the current and previous month.
    const today = new Date();

    const currentMonth = `${today.getFullYear()}-${String(
        today.getMonth() + 1
    ).padStart(2, "0")}`;

    const previousDate = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        1
    );

    const previousMonth = `${previousDate.getFullYear()}-${String(
        previousDate.getMonth() + 1
    ).padStart(2, "0")}`;

    // Store this month's financial information.
    let monthlyIncome = 0;
    let monthlyExpenses = 0;
    let previousExpenses = 0;

    // Store expenses according to their categories.
    const categorySpending = {};

    // Go through all transactions.
    transactions.forEach((transaction) => {
        if (!transaction.date) return;

        const transactionMonth = String(transaction.date).slice(0, 7);
        const amount = Number(transaction.amount) || 0;

        // Calculate current month's income and expenses.
        if (transactionMonth === currentMonth) {
            if (transaction.type === "Income") {
                monthlyIncome += amount;
            }

            if (transaction.type === "Expense") {
                monthlyExpenses += amount;

                const category = transaction.category || "Other";

                categorySpending[category] =
                    (categorySpending[category] || 0) + amount;
            }
        }

        // Calculate previous month's expenses.
        if (
            transactionMonth === previousMonth &&
            transaction.type === "Expense"
        ) {
            previousExpenses += amount;
        }
    });

    // Find the category with the highest spending.
    const highestCategory = Object.entries(categorySpending).sort(
        (a, b) => b[1] - a[1]
    )[0];

    // Calculate the increase in spending.
    const spendingIncrease =
        previousExpenses > 0
            ? ((monthlyExpenses - previousExpenses) / previousExpenses) * 100
            : 0;

    // Format amounts as Nigerian Naira.
    const formatCurrency = (amount) =>
        `₦${Number(amount).toLocaleString("en-NG")}`;

    // Store alerts here.
    const alerts = [];

    // Alert 1: Expenses are higher than income.
    if (monthlyExpenses > monthlyIncome) {
        alerts.push({
            title: "Your spending is higher than your income",
            message: `You have spent ${formatCurrency(
                monthlyExpenses - monthlyIncome
            )} more than you received this month.`,
            type: "warning",
            icon: "⚠️"
        });
    }

    // Alert 2: Spending has increased by more than 20%.
    if (
        previousExpenses > 0 &&
        spendingIncrease > 20
    ) {
        alerts.push({
            title: "Your spending has increased",
            message: `Your expenses have increased by ${spendingIncrease.toFixed(
                1
            )}% compared with last month.`,
            type: "warning",
            icon: "📈"
        });
    }

    // Alert 3: Identify the highest spending category.
    if (highestCategory && highestCategory[1] > 0) {
        alerts.push({
            title: "Your highest spending category",
            message: `${highestCategory[0]} is currently your highest spending category at ${formatCurrency(
                highestCategory[1]
            )}.`,
            type: "info",
            icon: "💡"
        });
    }

    // Show a positive message when no alerts are found.
    const hasTransactions = transactions.some(
        (transaction) =>
            String(transaction.date || "").slice(0, 7) === currentMonth
    );

    return (
        <section className="w-full rounded-2xl bg-white p-5 sm:p-6 shadow-sm border border-gray-100">

            {/* Section heading */}
            <div className="mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                    Smart Spending Alerts
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                    Important updates about your spending habits.
                </p>
            </div>

            {/* Display alerts */}
            <div className="space-y-4">

                {alerts.length > 0 ? (
                    alerts.map((alert, index) => (
                        <div
                            key={index}
                            className={`flex items-start gap-3 rounded-xl p-4 ${
                                alert.type === "warning"
                                    ? "bg-orange-50 border border-orange-100"
                                    : "bg-blue-50 border border-blue-100"
                            }`}
                        >
                            <span className="text-xl">
                                {alert.icon}
                            </span>

                            <div>
                                <h3 className="font-semibold text-gray-800">
                                    {alert.title}
                                </h3>

                                <p className="text-sm text-gray-600 mt-1">
                                    {alert.message}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="rounded-xl bg-green-50 border border-green-100 p-5 text-center">
                        <p className="text-2xl mb-2">🎉</p>

                        <h3 className="font-semibold text-gray-800">
                            {hasTransactions
                                ? "No spending alerts"
                                : "No spending data yet"}
                        </h3>

                        <p className="text-sm text-gray-600 mt-1">
                            {hasTransactions
                                ? "There are no spending warnings based on your current records."
                                : "Add transactions this month to start receiving financial insights."}
                        </p>
                    </div>
                )}

            </div>
        </section>
    );
}

export default SpendingAlerts;
