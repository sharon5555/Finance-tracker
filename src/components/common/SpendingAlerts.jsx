import React from "react";

function SpendingAlerts({ transactions = [] }) {
    // Get the current and previous month.
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonthIndex = today.getMonth();
    const currentDay = today.getDate();

    const currentMonth = `${currentYear}-${String(
        currentMonthIndex + 1
    ).padStart(2, "0")}`;

    const previousDate = new Date(
        currentYear,
        currentMonthIndex - 1,
        1
    );

    const previousMonth = `${previousDate.getFullYear()}-${String(
        previousDate.getMonth() + 1
    ).padStart(2, "0")}`;

    // Store this month's financial information and period-matched previous expenses.
    let monthlyIncome = 0;
    let monthlyExpenses = 0;
    let previousExpensesEquivalent = 0;

    // Store expenses according to their categories.
    const categorySpending = {};

    // Go through all transactions.
    transactions.forEach((transaction) => {
        if (!transaction.date) return;

        const transactionDateStr = String(transaction.date);
        const transactionMonth = transactionDateStr.slice(0, 7);
        const amount = Number(transaction.amount) || 0;
        
        // Normalise transaction type to handle variations safely
        const type = transaction.type ? String(transaction.type).trim().toLowerCase() : "";

        // Calculate current month's income and expenses.
        if (transactionMonth === currentMonth) {
            if (type === "income") {
                monthlyIncome += amount;
            }

            if (type === "expense") {
                monthlyExpenses += amount;

                const category = transaction.category || "Other";

                categorySpending[category] =
                    (categorySpending[category] || 0) + amount;
            }
        }

        // Calculate previous month's expenses up to the equivalent day-of-month (month-to-date comparison)
        if (type === "expense" && transactionMonth === previousMonth) {
            const dayOfTransaction = parseInt(transactionDateStr.slice(8, 10), 10);
            if (!isNaN(dayOfTransaction) && dayOfTransaction <= currentDay) {
                previousExpensesEquivalent += amount;
            }
        }
    });

    // Find the category with the highest spending.
    const highestCategory = Object.entries(categorySpending).sort(
        (a, b) => b[1] - a[1]
    )[0];

    // Calculate the increase in spending using equivalent month-to-date periods.
    const spendingIncrease =
        previousExpensesEquivalent > 0
            ? ((monthlyExpenses - previousExpensesEquivalent) / previousExpensesEquivalent) * 100
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

    // Alert 2: Spending has increased by more than 20% compared to the same period last month.
    if (
        previousExpensesEquivalent > 0 &&
        spendingIncrease > 20
    ) {
        alerts.push({
            title: "Your spending has increased",
            message: `Your month-to-date expenses have increased by ${spendingIncrease.toFixed(
                1
            )}% compared with the same period last month.`,
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
                    Important updates about your spending habits (Month-to-Date comparison).
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