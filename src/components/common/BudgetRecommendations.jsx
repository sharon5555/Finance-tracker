import React from "react";

function BudgetRecommendations({
    transactions = [],
    budgets = [],
    onApplyRecommendation
}) {
    // Find the last three completed calendar months.
    const today = new Date();

    const completedMonths = Array.from({ length: 3 }, (_, index) => {
        const date = new Date(
            today.getFullYear(),
            today.getMonth() - (index + 1),
            1
        );

        return `${date.getFullYear()}-${String(
            date.getMonth() + 1
        ).padStart(2, "0")}`;
    });

    // Calculate total spending for each category with normalised keys.
    const categoryTotals = {};

    transactions.forEach((transaction) => {
        if (!transaction.date || !transaction.type) return;

        const type = String(transaction.type).trim().toLowerCase();
        if (type !== "expense") {
            return;
        }

        const transactionMonth = String(transaction.date).slice(0, 7);

        // Only use the last three completed months.
        if (!completedMonths.includes(transactionMonth)) {
            return;
        }

        const rawCategory = transaction.category || "Other";
        const normalizedCategory = String(rawCategory).trim().toLowerCase();
        const amount = Number(transaction.amount) || 0;

        if (!categoryTotals[normalizedCategory]) {
            categoryTotals[normalizedCategory] = {
                originalName: rawCategory,
                total: 0
            };
        }

        categoryTotals[normalizedCategory].total += amount;
    });

    // Create a recommendation for each category with recorded spending.
    const recommendations = Object.entries(categoryTotals)
        .map(([normalizedCategory, data]) => {
            // Include months with no spending in the three-month average (averaged over 3 months).
            const averageSpending = data.total / 3;

            // Add a 10% buffer and round up to the nearest ₦1,000.
            const suggestedBudget =
                Math.ceil((averageSpending * 1.1) / 1000) * 1000;

            // Normalise category matching for existing budgets
            const existingBudget = budgets.find(
                (budget) =>
                    budget.category &&
                    String(budget.category).trim().toLowerCase() === normalizedCategory
            );

            return {
                category: data.originalName,
                normalizedCategory,
                averageSpending,
                suggestedBudget,
                currentBudget: existingBudget
                    ? Number(existingBudget.amount)
                    : null
            };
        })
        .filter((item) => item.suggestedBudget > 0)
        .sort((a, b) => b.averageSpending - a.averageSpending);

    // Format amounts as Nigerian Naira.
    const formatCurrency = (amount) =>
        `₦${Number(amount).toLocaleString("en-NG")}`;

    return (
        <section className="w-full rounded-2xl bg-white p-5 sm:p-6 shadow-sm border border-gray-100">

            {/* Section heading */}
            <div className="mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                    Budget Recommendations
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                    Suggestions based on your spending over the last three
                    completed months (averaged across 3 months, including zero-spend months).
                </p>
            </div>

            {/* Recommendation cards */}
            {recommendations.length === 0 ? (
                <div className="rounded-xl bg-gray-50 p-6 text-center">
                    <p className="font-semibold text-gray-700">
                        Not enough spending history yet
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                        Record expenses over the previous three months
                        to receive budget recommendations.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendations.map((item) => {
                        const hasBudget = item.currentBudget !== null;

                        const budgetIsLow =
                            hasBudget &&
                            item.currentBudget < item.suggestedBudget;

                        const budgetIsHigh =
                            hasBudget &&
                            item.currentBudget > item.suggestedBudget;

                        const budgetIsMatching =
                            hasBudget &&
                            item.currentBudget === item.suggestedBudget;

                        return (
                            <div
                                key={item.normalizedCategory}
                                className="rounded-xl border border-gray-100 bg-gray-50 p-4"
                            >
                                <h3 className="font-bold text-gray-800">
                                    {item.category}
                                </h3>

                                <div className="mt-4 space-y-2 text-sm">
                                    <div className="flex justify-between gap-3">
                                        <span className="text-gray-500">
                                            3-Month Monthly Average
                                        </span>

                                        <span className="font-medium text-gray-800">
                                            {formatCurrency(item.averageSpending)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between gap-3">
                                        <span className="text-gray-500">
                                            Suggested budget (with buffer)
                                        </span>

                                        <span className="font-bold text-blue-700">
                                            {formatCurrency(item.suggestedBudget)}
                                        </span>
                                    </div>

                                    {hasBudget && (
                                        <div className="flex justify-between gap-3">
                                            <span className="text-gray-500">
                                                Current budget
                                            </span>

                                            <span className="font-medium text-gray-800">
                                                {formatCurrency(item.currentBudget)}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Explain how the current budget compares. */}
                                <p className="mt-3 text-xs text-gray-500">
                                    {budgetIsLow
                                        ? "Your current budget is below this suggestion."
                                        : budgetIsHigh
                                            ? "Your current budget is above this suggestion."
                                            : budgetIsMatching
                                                ? "Your current budget matches this suggestion."
                                                : "You have not set a budget for this category yet."}
                                </p>

                                {/* Apply the suggested amount. */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        onApplyRecommendation({
                                            category: item.category,
                                            amount: item.suggestedBudget
                                        })
                                    }
                                    className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition"
                                >
                                    {hasBudget
                                        ? "Update My Budget"
                                        : "Use This Budget"}
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            <p className="mt-5 text-xs text-gray-400">
                Recommendations are estimates based on recorded expenses over 3 calendar months (including months without expenses).
                They are suggestions, not financial advice.
            </p>
        </section>
    );
}

export default BudgetRecommendations;