import React, { useState } from "react";

// Import the reusable Nigerian Naira currency formatter.
import formatCurrency from "../../utils/formatCurrency";

function BudgetPlanner({
    budgets = [],
    transactions = [],
    onAddBudget,
    onDeleteBudget
}) {
    // Store the selected budget category.
    const [category, setCategory] = useState("Food");

    // Store the budget amount entered by the user.
    const [amount, setAmount] = useState("");

    // Track the ID of the budget currently being edited.
    const [editingBudgetId, setEditingBudgetId] = useState(null);

    // Identify the current month.
    const today = new Date();

    const currentMonth = `${today.getFullYear()}-${String(
        today.getMonth() + 1
    ).padStart(2, "0")}`;

    // Calculate spending for each budget category.
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

    /*
      LOAD A BUDGET FOR EDITING

      Fill the form with the selected budget's information.
    */
    function handleEditBudget(budget) {
        setEditingBudgetId(budget.id);
        setCategory(budget.category);
        setAmount(String(budget.amount));
    }

    /*
      CANCEL EDITING

      Clear the form and return to normal budget creation.
    */
    function handleCancelEdit() {
        setEditingBudgetId(null);
        setCategory("Food");
        setAmount("");
    }

    /*
      DELETE A BUDGET

      If the deleted budget is currently being edited,
      also clear the editing form.
    */
    function handleDeleteBudget(id) {
        onDeleteBudget(id);

        if (editingBudgetId === id) {
            handleCancelEdit();
        }
    }

    /*
      SUBMIT THE BUDGET FORM

      This function handles both creating and updating budgets.
    */
    function handleSubmit(event) {
        event.preventDefault();

        const budgetAmount = Number(amount);

        // Validate the entered budget amount.
        if (
            amount.trim() === "" ||
            !Number.isFinite(budgetAmount) ||
            budgetAmount <= 0
        ) {
            alert("Please enter a valid budget amount.");
            return;
        }

        // Send the budget to Hero.jsx.
        // The existing addBudget function handles both adding and updating.
        onAddBudget({
            category,
            amount: budgetAmount
        });

        // Reset the form after submission.
        handleCancelEdit();
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

            {/* Budget creation and editing form */}
            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6"
            >
                {/* Select a budget category. */}
                <select
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    disabled={editingBudgetId !== null}
                    className="w-full rounded-lg border border-gray-200 p-3 text-sm outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                    <option value="Food">Food</option>
                    <option value="Transport">Transport</option>
                    <option value="Bills">Bills</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Other">Other</option>
                </select>

                {/* Enter the monthly budget amount. */}
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

                {/* Change the button label when editing. */}
                <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition"
                >
                    {editingBudgetId !== null
                        ? "Update Budget"
                        : "Set Budget"}
                </button>

                {/* Show the cancel button only while editing. */}
                {editingBudgetId !== null && (
                    <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="sm:col-span-3 rounded-lg border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition"
                    >
                        Cancel Edit
                    </button>
                )}
            </form>

            {/* Display budget cards. */}
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

                        // Normalize the budget category.
                        const normalizedBudgetCategory = budget.category
                            ? String(budget.category).trim().toLowerCase()
                            : "";

                        // Get the total spending for this category.
                        const spent =
                            spendingByCategory[normalizedBudgetCategory] || 0;

                        // Get the budget limit.
                        const limit = Number(budget.amount) || 0;

                        // Calculate the percentage spent.
                        const percentage =
                            limit > 0 ? (spent / limit) * 100 : 0;

                        // Prevent the progress bar from exceeding 100%.
                        const progressWidth = Math.min(percentage, 100);

                        // Identify budget status.
                        const isOverBudget = spent > limit;

                        const isNearLimit =
                            percentage >= 80 && !isOverBudget;

                        return (
                            <div
                                key={budget.id}
                                className="rounded-xl border border-gray-100 bg-gray-50 p-4"
                            >

                                {/* Budget category and action buttons. */}
                                <div className="flex items-center justify-between gap-3">
                                    <h3 className="font-bold text-gray-800">
                                        {budget.category}
                                    </h3>

                                    <div className="flex items-center gap-3">

                                        {/* Edit the selected budget. */}
                                        <button
                                            type="button"
                                            onClick={() => handleEditBudget(budget)}
                                            className="text-sm font-medium text-blue-600 hover:text-blue-800"
                                        >
                                            Edit
                                        </button>

                                        {/* Delete the selected budget. */}
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteBudget(budget.id)}
                                            className="text-sm font-medium text-red-500 hover:text-red-700"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>

                                {/* Display spending and budget limit. */}
                                <div className="mt-4 flex justify-between gap-2 text-sm">
                                    <span className="text-gray-500">
                                        Spent: {formatCurrency(spent)}
                                    </span>

                                    <span className="font-semibold text-gray-700">
                                        Limit: {formatCurrency(limit)}
                                    </span>
                                </div>

                                {/* Spending progress bar. */}
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

                                {/* Display the budget status. */}
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

                                {/* Show how much the user exceeded the budget by. */}
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