import { useState } from "react";

function TransactionForm() {

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

    return(
        <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
                Add New Transaction
            </h2>

            <form>
                <div className="mb-4">
                    <label className="block mb-2 font-medium">
                        Title 
                    </label>

                    <input
                    type="text"
                    placeholder="e.g. Salary"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    className="w-full border rounded-lg px-4 py-2"
                    />
                </div>

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

                <div className="className mb-4">
                    <label className="block mb-2 font-medium">
                        Date
                    </label>

                    <input type="date"
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    className="w-full border rounded-lg px-4 py-2"
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