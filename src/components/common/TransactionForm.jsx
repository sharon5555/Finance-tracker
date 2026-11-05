import { useEffect, useState } from "react";


//Receive the function for adding transactions 
//and the transactions that may currently be edited.
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

     // Store the transaction date
    const [date, setDate] = useState("");

    // load the selected transaction into the form when the user clicks Edit.
    useEffect(() => {

        // Only run this when a transaction has been selected for editing.
        if (!editingTransaction) {
            setTitle("");
            setAmount("");
            setType("Income");
            setCategory("Salary");
            setDate("");
            return;
        }

        // Fill the form with the existing transaction information.
        setTitle(editingTransaction.title);
        setAmount(String(editingTransaction.amount));
        setType(editingTransaction.type);
        setCategory(editingTransaction.category);
        setDate(editingTransaction.date);

    }, [editingTransaction]);

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

    // This function runs when the user clicks "Save Transaction".

    function handleSubmit(event) {

        // Prevent the browser from refreshing the page.
        event.preventDefault();

        // Trim input values consistently
        const trimmedTitle = title.trim();
        const trimmedAmount = amount.trim();
        const trimmedDate = date.trim();

        // Check if the user entered a title.
        if (trimmedTitle === "") {
            alert("Please enter a transaction title.");
            return;
        }

        // Convert the entered amount into a number and validate it.
        const numericAmount = Number(trimmedAmount);

        // Make sure the amount is a valid, finite, positive number.
        if (
            trimmedAmount === "" ||
            !Number.isFinite(numericAmount) ||
            numericAmount <= 0
        ) {
            alert("Please enter a valid positive amount.");
            return;
        }

        // Check if the user selected a date.
        if (trimmedDate === "") {
            alert("Please select a transaction date.");
            return;
        }

        // create the transaction information.
        const transactionData = {

            // Keep the old ID when editing.
            // Create a new ID when adding a transaction.
            id: editingTransaction
                ? editingTransaction.id
                : Date.now(),

            title: trimmedTitle,
            amount: numericAmount,
            type: type,
            category: category,
            date: trimmedDate,
        }

        // Send the new transaction to Hero.jsx.
        // Hero.jsx will decide whether to add or update it.
        onAddTransaction(transactionData);

        // if we were editing, exit edit mode.
        if (editingTransaction) {
            onFinishEditing();
        }

         // Clear the form after successfully saving.
        setTitle("");
        setAmount("");
        setType("Income");
        setCategory("Salary");
        setDate("");
    }


    /*
        Change the heading depending on whether 
        the user is adding or editing a transaction.
    */
    return(
        <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
                {editingTransaction
                    ? "Edit Transaction"
                    : "Add New Transaction"}
            </h2>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">

                    {/* 
                        Title input:
                        The user must enter a name for the transaction.
                    */}
                    
                    <label className="block mb-2 font-medium">
                        Title 
                    </label>

                    <input
                        type="text"
                        placeholder="e.g. Salary"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        className="w-full border rounded-lg px-4 py-2"
                        required
                    />
                </div>

                {/* 
                    Amount input:
                    The user must enter an amount for the transaction.
                */}

                <div className="mb-4">
                    <label className="block mb-2 font-medium">
                        Amount
                    </label>

                    <input 
                        type="number"
                        placeholder="e.g. 50000"
                        value={amount}
                        onChange={(event) => setAmount(event.target.value)}
                        className="w-full border rounded-lg px-4 py-2"
                        min="0.01"
                        step="0.01"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2 font-medium">
                        Type
                    </label>

                    <select
                        value={type}
                        onChange={(event) => setType(event.target.value)}
                        className="w-full border rounded-lg px-4 py-2"
                    >
                        <option value="Income">Income</option>
                        <option value="Expense">Expense</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block mb-2 font-medium">
                        Category
                    </label>

                    <select
                        value={category}
                        onChange={(event) => setCategory(event.target.value)}
                        className="w-full border rounded-lg px-4 py-2"
                    >
                        {categories.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block mb-2 font-medium">
                        Date
                    </label>

                    <input type="date"
                        value={date}
                        onChange={(event) => setDate(event.target.value)}
                        className="w-full border rounded-lg px-4 py-2"
                        required
                    />
                </div>

                    {/* 
                        Form action buttons:
                        The main button saves or updates the transaction.
                        The Cancel button only appears while editing.
                    */}
                    <div className="flex gap-3">

                    {/* 
                        Save/Update button:
                        Changes its text depending on whether
                        the user is adding or editing.
                    */}
                    <button
                        type="submit"
                        className="flex-1 bg-emerald-600 text-white py-3 rounded-lg
                        font-semibold shadow-sm hover:bg-emerald-700 transition-all duration-200
                        hover:shadow-md"
                    >
                        {editingTransaction
                            ? "Update Transaction"
                            : "Save Transaction"}
                    </button>


                    {/* 
                        Cancel button:
                        Only appears when the user is editing a transaction.
                    */}
                    {editingTransaction && (
                        <button
                            type="button"

                            // Exit edit mode without saving changes.
                            onClick={onFinishEditing}

                            className="flex-1 bg-slate-200 text-slate-700 py-3 rounded-lg
                            font-semibold border border-slate-200 hover:bg-slate-200
                            transition-all duration-200"
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