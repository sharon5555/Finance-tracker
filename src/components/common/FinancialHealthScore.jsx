
import React from "react";

function FinancialHealthScore({
    transactions = [],
    budgets = []
}) {
    // Get the current calendar month.
    const today = new Date();

    const currentMonth = `${today.getFullYear()}-${String(
        today.getMonth() + 1
    ).padStart(2, "0")}`;

    // Convert different date formats into YYYY-MM.
    const getTransactionMonth = (date) => {
        if (!date) return "";

        // Handle JavaScript Date objects.
        if (date instanceof Date && !isNaN(date)) {
            return `${date.getFullYear()}-${String(
                date.getMonth() + 1
            ).padStart(2, "0")}`;
        }

        const dateString = String(date).trim();

        // Handle YYYY-MM-DD and ISO date formats.
        const standardDate = dateString.match(
            /^(\d{4})-(\d{1,2})/
        );

        if (standardDate) {
            return `${standardDate[1]}-${String(
                standardDate[2]
            ).padStart(2, "0")}`;
        }

        // Handle DD/MM/YYYY or MM/DD/YYYY-style dates
        // using the day/month/year format.
        const alternateDate = dateString.match(
            /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/
        );

        if (alternateDate) {
            return `${alternateDate[3]}-${String(
                alternateDate[2]
            ).padStart(2, "0")}`;
        }

        // Handle other date formats supported by JavaScript.
        const parsedDate = new Date(dateString);

        if (!isNaN(parsedDate)) {
            return `${parsedDate.getFullYear()}-${String(
                parsedDate.getMonth() + 1
            ).padStart(2, "0")}`;
        }

        return "";
    };

    // Calculate current-month income and expenses.
    let monthlyIncome = 0;
    let monthlyExpenses = 0;
    let budgetedExpenses = 0;

    // Keep only valid budgets.
    const validBudgets = budgets.filter(
        (budget) =>
            budget.category &&
            Number(budget.amount) > 0
    );

    // Collect all budget categories.
    const budgetCategories = new Set(
        validBudgets.map((budget) =>
            String(budget.category).trim().toLowerCase()
        )
    );

    // Calculate the total allocated budget.
    const totalBudget = validBudgets.reduce(
        (total, budget) =>
            total + (Number(budget.amount) || 0),
        0
    );

    // Analyse current-month transactions.
    transactions.forEach((transaction) => {
        const transactionMonth = getTransactionMonth(
            transaction.date
        );

        // Ignore transactions outside the current month.
        if (transactionMonth !== currentMonth) return;

        const amount = Number(transaction.amount) || 0;

        // Normalise transaction type.
        const transactionType = String(
            transaction.type || ""
        ).trim().toLowerCase();

        // Identify income transactions.
        if (transactionType === "income") {
            monthlyIncome += amount;
        }

        // Identify expense transactions.
        if (transactionType === "expense") {
            monthlyExpenses += amount;

            const category = String(
                transaction.category || "Other"
            ).trim().toLowerCase();

            // Count expenses belonging to budgeted categories.
            if (budgetCategories.has(category)) {
                budgetedExpenses += amount;
            }
        }
    });

    // Check whether enough information is available.
    const hasIncome = monthlyIncome > 0;
    const hasBudget = totalBudget > 0;

    const canCalculateScore = hasIncome && hasBudget;

    // Calculate remaining income after expenses.
    const savings = monthlyIncome - monthlyExpenses;

    // Calculate savings rate.
    const savingsRate = hasIncome
        ? (savings / monthlyIncome) * 100
        : 0;

    // Award up to 50 points for savings performance.
    // Saving 20% or more earns the full 50 points.
    const savingsScore = Math.min(
        50,
        Math.max(0, (savingsRate / 20) * 50)
    );

    // Calculate budget utilisation.
    const budgetUtilisation = hasBudget
        ? (budgetedExpenses / totalBudget) * 100
        : 0;

    // Award up to 50 points for budget performance.
    let budgetScore = 0;

    if (budgetUtilisation <= 80) {
        budgetScore = 50;
    } else if (budgetUtilisation <= 100) {
        budgetScore =
            50 - ((budgetUtilisation - 80) / 20) * 10;
    } else {
        budgetScore = Math.max(
            0,
            40 - (budgetUtilisation - 100) * 0.8
        );
    }

    // Calculate the final financial health score.
    const healthScore = canCalculateScore
        ? Math.round(savingsScore + budgetScore)
        : 0;

    // Assign a rating based on the final score.
    let rating = "Needs Attention";
    let ratingColor = "text-red-600";
    let ratingBackground = "bg-red-50";
    let ratingMessage =
        "Review your spending and savings habits.";

    if (healthScore >= 80) {
        rating = "Excellent";
        ratingColor = "text-green-700";
        ratingBackground = "bg-green-50";
        ratingMessage =
            "You're maintaining healthy financial habits.";
    } else if (healthScore >= 60) {
        rating = "Good";
        ratingColor = "text-blue-700";
        ratingBackground = "bg-blue-50";
        ratingMessage =
            "You're making progress. Keep improving your habits.";
    } else if (healthScore >= 40) {
        rating = "Needs Improvement";
        ratingColor = "text-orange-700";
        ratingBackground = "bg-orange-50";
        ratingMessage =
            "Look for ways to improve your savings and budget control.";
    }

    // Format amounts as Nigerian Naira.
    const formatCurrency = (amount) =>
        `₦${Number(amount).toLocaleString("en-NG")}`;

    return (
        <section className="w-full rounded-2xl bg-white p-5 sm:p-6 shadow-sm border border-gray-100">

            {/* Section heading */}
            <div className="mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                    Financial Health Score
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                    An overview of your savings and budget performance
                    this month.
                </p>
            </div>

            {!canCalculateScore ? (
                /* Explain what is missing before calculating the score. */
                <div className="rounded-xl bg-blue-50 border border-blue-100 p-5">
                    <h3 className="font-semibold text-gray-800">
                        Your financial score is not ready yet.
                    </h3>

                    <p className="text-sm text-gray-600 mt-2">
                        To calculate your score, you need:
                    </p>

                    <ul className="mt-3 space-y-2 text-sm text-gray-700">
                        <li>
                            {hasIncome ? "✓" : "○"} Record income
                            for the current month.
                        </li>

                        <li>
                            {hasBudget ? "✓" : "○"} Create at least
                            one category budget.
                        </li>
                    </ul>
                </div>
            ) : (
                <>
                    {/* Main financial health score display */}
                    <div className={`rounded-2xl ${ratingBackground} p-6 text-center`}>
                        <p className="text-sm font-medium text-gray-600">
                            Your Financial Health Score
                        </p>

                        <div className="my-4 flex items-center justify-center">
                            <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full border-8 border-white shadow-sm">
                                <span className={`text-5xl font-extrabold ${ratingColor}`}>
                                    {healthScore}
                                </span>

                                <span className="text-xs text-gray-500">
                                    out of 100
                                </span>
                            </div>
                        </div>

                        <h3 className={`text-xl font-bold ${ratingColor}`}>
                            {rating}
                        </h3>

                        <p className="text-sm text-gray-600 mt-2">
                            {ratingMessage}
                        </p>
                    </div>

                    {/* Savings and budget score breakdown */}
                    <div className="mt-6 space-y-5">

                        {/* Savings performance */}
                        <div>
                            <div className="flex justify-between gap-3 text-sm mb-2">
                                <span className="font-semibold text-gray-700">
                                    Savings Performance
                                </span>

                                <span className="font-bold text-gray-800">
                                    {savingsScore.toFixed(1)} / 50
                                </span>
                            </div>

                            <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-green-500"
                                    style={{
                                        width: `${(savingsScore / 50) * 100}%`
                                    }}
                                />
                            </div>

                            <p className="mt-2 text-xs text-gray-500">
                                Savings rate: {savingsRate.toFixed(1)}%
                                ({formatCurrency(savings)})
                            </p>
                        </div>

                        {/* Budget performance */}
                        <div>
                            <div className="flex justify-between gap-3 text-sm mb-2">
                                <span className="font-semibold text-gray-700">
                                    Budget Performance
                                </span>

                                <span className="font-bold text-gray-800">
                                    {budgetScore.toFixed(1)} / 50
                                </span>
                            </div>

                            <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${
                                        budgetUtilisation > 100
                                            ? "bg-red-500"
                                            : budgetUtilisation >= 80
                                                ? "bg-orange-500"
                                                : "bg-blue-500"
                                    }`}
                                    style={{
                                        width: `${(budgetScore / 50) * 100}%`
                                    }}
                                />
                            </div>

                            <p className="mt-2 text-xs text-gray-500">
                                Budget utilisation: {budgetUtilisation.toFixed(1)}%
                            </p>
                        </div>
                    </div>

                    {/* Monthly financial overview */}
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">

                        <div className="rounded-xl bg-gray-50 p-4">
                            <p className="text-xs text-gray-500">
                                Income
                            </p>

                            <p className="font-bold text-gray-800 mt-1">
                                {formatCurrency(monthlyIncome)}
                            </p>
                        </div>

                        <div className="rounded-xl bg-gray-50 p-4">
                            <p className="text-xs text-gray-500">
                                Expenses
                            </p>

                            <p className="font-bold text-gray-800 mt-1">
                                {formatCurrency(monthlyExpenses)}
                            </p>
                        </div>

                        <div className="rounded-xl bg-gray-50 p-4">
                            <p className="text-xs text-gray-500">
                                Remaining Income
                            </p>

                            <p className={`font-bold mt-1 ${
                                savings >= 0
                                    ? "text-green-700"
                                    : "text-red-600"
                            }`}>
                                {formatCurrency(savings)}
                            </p>
                        </div>
                    </div>
                </>
            )}

            {/* Explain how the score is calculated. */}
            <p className="mt-6 text-xs text-gray-400">
                This is an educational indicator based on your recorded
                current-month transactions and budgets. It is not a
                credit score or a professional financial assessment.
            </p>
        </section>
    );
}

export default FinancialHealthScore;
