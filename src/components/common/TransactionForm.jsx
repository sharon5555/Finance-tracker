import { useState } from "react";


function TransactionForm({ onAddTransaction }) {

    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [type, setType] = useState("Income");
    const [category, setCategory] = useState("Salary");
    const [date, setDate] = useState("");

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

        // Check if the user entered a title.
        if(title.trim() === "") {
            alert("Please enter a transaction title.");
            return;
        }

        // Check if the user entered a valid amount.
        if (amount === "" || Number(amount) <= 0) {
            alert("Please enter a valid amount.");
            return;
        }

        // Check if the user selected a date.
        // A transaction should have a date so we can track it later.
        if(date === "") {
            alert("Please select a transaction date.");
            return;
        }

        // Create an object containing all the transaction information.
        const newTransaction = {
            id: Date.now(),
            title: title,
            amount: Number(amount),
            type: type,
            category: category,
            date: date,
        };

        // Send the new transaction to Hero.jsx.
        onAddTransaction(newTransaction);

         // Clear the form after successfully saving.
        setTitle("");
        setAmount("");
        setType("Income");
        setCategory("Salary");
        setDate("");
    }

    return(
        <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
                Add New Transaction
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

                <button
                type="submit"
                className="w-full bg-emerald-600 text-white py-3 rounded-lg
                font-semibold hover:bg-emerald-700"
                >
                    Save Transaction
                </button>
            </form>
        </div>
    );
}

export default TransactionForm;