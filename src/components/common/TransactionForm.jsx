
import { useEffect, useState } from "react";

// Receive the functions and transaction information from Hero.jsx.
function TransactionForm({
    onAddTransaction,
    editingTransaction,
    onFinishEditing
}) {

    // Store the transaction title.
    const [title, setTitle] = useState("");

    // Store the transaction amount.
    const [amount, setAmount] = useState("");

    // Store whether the transaction is Income or Expense.
    const [type, setType] = useState("Income");

    // Store the transaction category.
    const [category, setCategory] = useState("Salary");

    // Store the transaction date.
    const [date, setDate] = useState("");

    // Store validation error messages.
    const [error, setError] = useState("");

    // Available transaction categories.
    const categories = [
        "Salary",
        "Freelance",
        "Business",
        "Investment",
        "Food",
        "Transport",
        "Bills",
        "Shopping",
        "Entertainment"
    ];

    // Load the selected transaction into the form when editing.
    useEffect(() => {

        // Reset the form when no transaction is being edited.
        if (!editingTransaction) {
            setTitle("");
            setAmount("");
            setType("Income");
            setCategory("Salary");
            setDate("");
            setError("");
            return;
        }

        // Fill the form with the existing transaction information.
        setTitle(editingTransaction.title || "");
        setAmount(String(editingTransaction.amount ?? ""));
        setType(editingTransaction.type || "Income");
        setCategory(editingTransaction.category || "Salary");
        setDate(editingTransaction.date || "");
        setError("");

    }, [editingTransaction]);

    /*
      VALIDATE THE TRANSACTION DATE

      Checks the date format and confirms that
      the selected day actually exists.
    */
    function isValidDate(dateValue) {

        // Check the expected YYYY-MM-DD format.
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
            return false;
        }

        // Split the date into year, month and day.
        const [year, month, day] = dateValue.split("-").map(Number);

        // Create a local date.
        const selectedDate = new Date(year, month - 1, day);

        // Confirm that the date components match.
        return (
            selectedDate.getFullYear() === year &&
            selectedDate.getMonth() === month - 1 &&
            selectedDate.getDate() === day
        );
    }

    /*
      SUBMIT THE TRANSACTION FORM

      Validate the information before saving.
    */
    function handleSubmit(event) {

        // Prevent the browser from refreshing the page.
        event.preventDefault();

        // Clean up the entered information.
        const trimmedTitle = title.trim();
        const trimmedAmount = amount.trim();
        const trimmedDate = date.trim();

        // Convert the amount into a number.
        const numericAmount = Number(trimmedAmount);

        // Validate the transaction title.
        if (trimmedTitle === "") {
            setError("Please enter a transaction title.");
            return;
        }

        // Validate the transaction amount.
        if (
            trimmedAmount === "" ||
            !Number.isFinite(numericAmount) ||
            numericAmount <= 0
        ) {
            setError("Please enter a valid positive amount.");
            return;
        }

        // Validate the transaction type.
        if (!["Income", "Expense"].includes(type)) {
            setError("Please select a valid transaction type.");
            return;
        }

        // Validate the selected category.
        if (!categories.includes(category)) {
            setError("Please select a valid transaction category.");
            return;
        }

        // Validate the transaction date.
        if (!isValidDate(trimmedDate)) {
            setError("Please select a valid transaction date.");
            return;
        }

        // Prepare the transaction information.
        const transactionData = {

            // Keep the existing ID when editing.
            // Generate a new ID when creating a transaction.
            id: editingTransaction
                ? editingTransaction.id
                : Date.now(),

            title: trimmedTitle,
            amount: numericAmount,
            type,
            category,
            date: trimmedDate,
        };

        // Send the transaction information to Hero.jsx.
        onAddTransaction(transactionData);

        // Exit editing mode after updating a transaction.
        if (editingTransaction) {
            onFinishEditing();
        }

        // Clear the form after successful submission.
        setTitle("");
        setAmount("");
        setType("Income");
        setCategory("Salary");
        setDate("");
        setError("");
    }

    /*
      CLEAR THE CURRENT ERROR MESSAGE
      whenever the user changes an input.
    */
    function clearError() {
        if (error) {
            setError("");
        }
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md">

            {/* Change the heading when editing a transaction. */}
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
                {editingTransaction
                    ? "Edit Transaction"
                    : "Add New Transaction"}
            </h2>

            <form onSubmit={handleSubmit}>

                {/* Display validation errors inside the form. */}
                {error && (
                    <div
                        role="alert"
                        className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
                    >
                        {error}
                    </div>
                )}

                {/* Transaction title input. */}
                <div className="mb-4">
                    <label className="block mb-2 font-medium">
                        Title
                    </label>

                    <input
                        type="text"
                        placeholder="e.g. Salary"
                        value={title}
                        onChange={(event) => {
                            setTitle(event.target.value);
                            clearError();
                        }}
                        className="w-full border rounded-lg px-4 py-2"
                        required
                    />
                </div>

                {/* Transaction amount input. */}
                <div className="mb-4">
                    <label className="block mb-2 font-medium">
                        Amount
                    </label>

                    <input
                        type="number"
                        placeholder="e.g. 50000"
                        value={amount}
                        onChange={(event) => {
                            setAmount(event.target.value);
                            clearError();
                        }}
                        className="w-full border rounded-lg px-4 py-2"
                        min="0.01"
                        step="0.01"
                        required
                    />
                </div>

                {/* Select the transaction type. */}
                <div className="mb-4">
                    <label className="block mb-2 font-medium">
                        Type
                    </label>

                    <select
                        value={type}
                        onChange={(event) => {
                            setType(event.target.value);
                            clearError();
                        }}
                        className="w-full border rounded-lg px-4 py-2"
                    >
                        <option value="Income">Income</option>
                        <option value="Expense">Expense</option>
                    </select>
                </div>

                {/* Select the transaction category. */}
                <div className="mb-4">
                    <label className="block mb-2 font-medium">
                        Category
                    </label>

                    <select
                        value={category}
                        onChange={(event) => {
                            setCategory(event.target.value);
                            clearError();
                        }}
                        className="w-full border rounded-lg px-4 py-2"
                    >
                        {categories.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Select the transaction date. */}
                <div className="mb-4">
                    <label className="block mb-2 font-medium">
                        Date
                    </label>

                    <input
                        type="date"
                        value={date}
                        onChange={(event) => {
                            setDate(event.target.value);
                            clearError();
                        }}
                        className="w-full border rounded-lg px-4 py-2"
                        required
                    />
                </div>

                {/* Transaction form action buttons. */}
                <div className="flex gap-3">

                    {/* Save or update the transaction. */}
                    <button
                        type="submit"
                        className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-semibold shadow-sm hover:bg-emerald-700 transition-all duration-200 hover:shadow-md"
                    >
                        {editingTransaction
                            ? "Update Transaction"
                            : "Save Transaction"}
                    </button>

                    {/* Cancel editing without saving changes. */}
                    {editingTransaction && (
                        <button
                            type="button"
                            onClick={onFinishEditing}
                            className="flex-1 bg-slate-200 text-slate-700 py-3 rounded-lg font-semibold border border-slate-200 hover:bg-slate-300 transition-all duration-200"
                        >
                            Cancel
                        </button>
                    )}

                </div>
            </form>
        </div>
    );
}

export default TransactionForm;
