import React, { useState } from "react";

function BudgetPlanner({
    budgets = [],
    transactions = [],
    onAddBudget,
    onDeleteBudget
}) {
    const [category, setCategory] = useState("Food");
    const [amount, setAmount] = useState("");

    // Identify the current month.
    const today = new Date();

    const currentMonth = `${today.getFullYear()}-${String(
        today.getMonth() + 1
    ).padStart(2, "0")}`;

    // Calculate spending for each budget category with normalised keys.
    const spendingByCategory = {};

    transactions.forEach((transaction) => {
        if (!transaction.date || !transaction.type) return;

        const type = String(transaction.type).trim().toLowerCase();
        if (
            type !== "expense" ||
            String(transaction.date).slice(0, 7) !== currentMonth
        ) {
            return;
        }

        const rawCategory = transaction.category || "Other";
        const normalizedCategory = String(rawCategory).trim().toLowerCase();

        spendingByCategory[normalizedCategory] =
            (spendingByCategory[normalizedCategory] || 0) +
            (Number(transaction.amount) || 0);
    });

    // Format amounts as Nigerian Naira.
    const formatCurrency = (value) =>
        `₦${Number(value).toLocaleString("en-NG")}`;

    // Add a new budget.
    function handleSubmit(event) {
        event.preventDefault();

        const budgetAmount = Number(amount);

        // Robust amount validation checking for finite numbers and empty strings
        if (
            amount.trim() === "" ||
            !Number.isFinite(budgetAmount) ||
            budgetAmount <= 0
        ) {
            alert("Please enter a valid budget amount.");
            return;
        }

        onAddBudget({
            category,
            amount: budgetAmount
        });

        setAmount("");
    }

    return (
        <section className="w-full rounded-2xl bg-white p-5 sm:p-6 shadow-sm border border-gray-100">

            {/* Section heading */}
            <div className="mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                    Monthly Budget Planner
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                    Set spending limits and keep track of your expenses.
                </p>
            </div>

            {/* Budget creation form */}
            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6"
            >
                <select
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    className="w-full rounded-lg border border-gray-200 p-3 text-sm outline-none focus:border-blue-500"
                >
                    <option value="Food">Food</option>
                    <option value="Transport">Transport</option>
                    <option value="Bills">Bills</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Other">Other</option>
                </select>

                <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="Budget amount (₦)"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    className="w-full rounded-lg border border-gray-200 p-3 text-sm outline-none focus:border-blue-500"
                    required
                />

                <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition"
                >
                    Set Budget
                </button>
            </form>

            {/* Display budget cards */}
            {budgets.length === 0 ? (
                <div className="rounded-xl bg-gray-50 p-6 text-center">
                    <p className="font-semibold text-gray-700">
                        No budgets created yet
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                        Choose a category and set your first monthly budget.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {budgets.map((budget) => {
                        // Normalise budget category for robust matching against transactions
                        const normalizedBudgetCategory = budget.category
                            ? String(budget.category).trim().toLowerCase()
                            : "";

                        const spent =
                            spendingByCategory[normalizedBudgetCategory] || 0;

                        const limit = Number(budget.amount) || 0;

                        const percentage =
                            limit > 0 ? (spent / limit) * 100 : 0;

                        // Limit progress bar width to 100% while keeping actual percentage visible
                        const progressWidth = Math.min(percentage, 100);

                        const isOverBudget = spent > limit;

                        const isNearLimit =
                            percentage >= 80 && !isOverBudget;

                        return (
                            <div
                                key={budget.id}
                                className="rounded-xl border border-gray-100 bg-gray-50 p-4"
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <h3 className="font-bold text-gray-800">
                                        {budget.category}
                                    </h3>

                                    <button
                                        type="button"
                                        onClick={() => onDeleteBudget(budget.id)}
                                        className="text-sm font-medium text-red-500 hover:text-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>

                                <div className="mt-4 flex justify-between gap-2 text-sm">
                                    <span className="text-gray-500">
                                        Spent: {formatCurrency(spent)}
                                    </span>

                                    <span className="font-semibold text-gray-700">
                                        Limit: {formatCurrency(limit)}
                                    </span>
                                </div>

                                {/* Spending progress bar */}
                                <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-gray-200">
                                    <div
                                        className={`h-full rounded-full transition-all ${
                                            isOverBudget
                                                ? "bg-red-500"
                                                : isNearLimit
                                                    ? "bg-orange-500"
                                                    : "bg-green-500"
                                        }`}
                                        style={{
                                            width: `${progressWidth}%`
                                        }}
                                    />
                                </div>

                                <div className="mt-3 flex justify-between gap-2 text-xs">
                                    <span
                                        className={`font-semibold ${
                                            isOverBudget
                                                ? "text-red-600"
                                                : isNearLimit
                                                    ? "text-orange-600"
                                                    : "text-green-600"
                                        }`}
                                    >
                                        {isOverBudget
                                            ? "Budget exceeded"
                                            : isNearLimit
                                                ? "Almost at limit"
                                                : "Within budget"}
                                    </span>

                                    <span className="text-gray-500">
                                        {percentage.toFixed(1)}%
                                    </span>
                                </div>

                                {isOverBudget && (
                                    <p className="mt-2 text-xs text-red-600">
                                        You have exceeded this budget by{" "}
                                        {formatCurrency(spent - limit)}.
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}

export default BudgetPlanner;