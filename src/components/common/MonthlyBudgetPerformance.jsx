import React from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register the Chart.js features used by this component.
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
);

function MonthlyBudgetPerformance({
    transactions = [],
    budgets = []
}) {
    // Format amounts as Nigerian Naira.
    const formatCurrency = (amount) =>
        `₦${Number(amount).toLocaleString("en-NG")}`;

    // Get the last six calendar months.
    const today = new Date();

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
                month: "short",
                year: "2-digit"
            }),
            spent: 0,
            budget: budgets.reduce(
                (total, item) => total + (Number(item.amount) || 0),
                0
            )
        };
    });

    // Normalise budgeted categories (trimmed and lowercase) to prevent case-mismatch issues.
    const budgetCategories = new Set(
        budgets
            .filter((budget) => budget.category)
            .map((budget) => String(budget.category).trim().toLowerCase())
    );

    // Add each eligible expense to its matching month after normalising category names.
    transactions.forEach((transaction) => {
        if (!transaction.date || !transaction.type) return;

        const type = String(transaction.type).trim().toLowerCase();
        if (type !== "expense") {
            return;
        }

        const rawCategory = transaction.category || "Other";
        const normalizedCategory = String(rawCategory).trim().toLowerCase();

        if (!budgetCategories.has(normalizedCategory)) {
            return;
        }

        const transactionMonth = String(transaction.date).slice(0, 7);

        const monthData = monthlyData.find(
            (month) => month.key === transactionMonth
        );

        if (!monthData) return;

        monthData.spent += Number(transaction.amount) || 0;
    });

    // All 6 months are considered active in the performance comparison so that
    // months with zero spending against a budget are correctly accounted for.
    const activeMonths = monthlyData;

    // Count months where spending stayed within or equal to the budget.
    const monthsWithinBudget = activeMonths.filter(
        (month) => month.spent <= month.budget
    ).length;

    // Calculate total and average spending across all 6 months.
    const totalSpent = monthlyData.reduce(
        (total, month) => total + month.spent,
        0
    );

    const averageMonthlySpending =
        activeMonths.length > 0
            ? totalSpent / activeMonths.length
            : 0;

    // Prepare the chart information.
    const chartData = {
        labels: monthlyData.map((month) => month.label),

        datasets: [
            {
                label: "Budget allowance",
                data: monthlyData.map((month) => month.budget),
                backgroundColor: "#93C5FD",
                borderRadius: 6
            },
            {
                label: "Actual spending",
                data: monthlyData.map((month) => month.spent),
                backgroundColor: monthlyData.map((month) =>
                    month.spent > month.budget
                        ? "#EF4444"
                        : "#16A34A"
                ),
                borderRadius: 6
            }
        ]
    };

    // Configure the chart.
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
            legend: {
                position: "top",
                labels: {
                    usePointStyle: true,
                    padding: 18
                }
            },

            tooltip: {
                callbacks: {
                    label: (context) =>
                        `${context.dataset.label}: ${formatCurrency(
                            context.raw
                        )}`
                }
            }
        },

        scales: {
            y: {
                beginAtZero: true,

                ticks: {
                    callback: (value) =>
                        `₦${Number(value).toLocaleString("en-NG")}`
                }
            }
        }
    };

    return (
        <section className="w-full rounded-2xl bg-white p-5 sm:p-6 shadow-sm border border-gray-100">

            {/* Section heading */}
            <div className="mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                    Monthly Budget Performance
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                    Compare your spending in budgeted categories with your budget allowance
                    over the last six months.
                </p>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

                <div className="rounded-xl bg-blue-50 p-4">
                    <p className="text-sm text-gray-600">
                        Spending in Budgeted Categories
                    </p>

                    <h3 className="text-xl font-bold text-gray-800 mt-2">
                        {formatCurrency(totalSpent)}
                    </h3>
                </div>

                <div className="rounded-xl bg-green-50 p-4">
                    <p className="text-sm text-gray-600">
                        Months Within Budget
                    </p>

                    <h3 className="text-xl font-bold text-gray-800 mt-2">
                        {monthsWithinBudget} / {activeMonths.length}
                    </h3>

                    <p className="text-xs text-gray-500 mt-1">
                        Over the last 6 months.
                    </p>
                </div>

                <div className="rounded-xl bg-purple-50 p-4">
                    <p className="text-sm text-gray-600">
                        Average Monthly Spending
                    </p>

                    <h3 className="text-xl font-bold text-gray-800 mt-2">
                        {formatCurrency(averageMonthlySpending)}
                    </h3>

                    <p className="text-xs text-gray-500 mt-1">
                        Based on the 6-month period.
                    </p>
                </div>

            </div>

            {/* Show the chart or a helpful message. */}
            {budgets.length === 0 ? (
                <div className="rounded-xl bg-gray-50 p-6 text-center">
                    <p className="font-semibold text-gray-700">
                        No budgets available
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                        Create category budgets in your Budget Planner
                        to compare spending with your limits.
                    </p>
                </div>
            ) : (
                <>
                    <div className="relative h-72 sm:h-80 w-full">
                        <Bar data={chartData} options={chartOptions} />
                    </div>

                    {/* Explain the comparison. */}
                    <p className="mt-5 text-xs text-gray-400">
                        Historical spending is compared against your
                        current category budget limits. Past budget
                        changes are not stored in this version.
                    </p>
                </>
            )}

        </section>
    );
}

export default MonthlyBudgetPerformance;