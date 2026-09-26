// Import useState so we can store and update the search
// and transaction filter values.
import { useState } from "react";


// TransactionHistory displays the user's complete transaction history.
//
// It allows the user to:
// - Search transactions
// - Filter by All, Income, or Expense
// - See how many transactions are displayed
// - Edit transactions
// - Delete transactions

function TransactionHistory({
    transactions,
    onEdit,
    onDelete
}) {

    // Store the text entered into the transaction search box.
    const [searchTerm, setSearchTerm] = useState("");

    // Store the selected transaction type filter.
    const [historyFilter, setHistoryFilter] = useState("All");

    // Reset both the search box and transaction filter.
    function clearFilters() {
        setSearchTerm("");
        setHistoryFilter("All");
    }

    /*
        Filter transactions using two conditions:

        1. The selected transaction type.
        2. The search text.

        Both conditions must be satisfied before
        a transaction is displayed.
    */
    const filteredTransactions = transactions.filter((transaction) => {

        // Check whether the transaction matches the selected filter.
        const matchesFilter =
            historyFilter === "All" ||
            transaction.type === historyFilter;


        // Convert the search text to lowercase.
        const search = searchTerm.toLowerCase();


        // Convert the transaction information to lowercase
        // so the search is not affected by capital letters.
        const title = transaction.title.toLowerCase();
        const category = transaction.category.toLowerCase();


        // Check whether the search text exists in the
        // transaction title or category.
        const matchesSearch =
            title.includes(search) ||
            category.includes(search);


        // A transaction must match BOTH conditions.
        return matchesFilter && matchesSearch;
    });


    return (
        <section className="mt-10">

            {/* Section heading */}
            <div className="mb-6">

                <p className="text-sm text-emerald-600 font-semibold">
                    Transaction Management
                </p>

                <h2 className="text-2xl font-bold text-slate-800">
                    Transaction History
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                    View and manage all your financial transactions.
                </p>

            </div>


            {/*
                Transaction history card.

                The search box, filters, count, and
                transaction list all belong to this card.
            */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">


                {/* Search and filter controls */}
                <div className="p-5 border-b border-slate-100">

                    {/* Search transactions */}
                    <div className="mb-5">

                        <label
                            htmlFor="transaction-search"
                            className="block text-sm font-medium text-slate-700 mb-2"
                        >
                            Search transactions
                        </label>

                        <input
                            id="transaction-search"
                            type="text"
                            value={searchTerm}
                            onChange={(event) =>
                                setSearchTerm(event.target.value)
                            }
                            placeholder="Search by title or category..."
                            className="w-full px-4 py-3 rounded-xl border border-slate-200
                            focus:outline-none focus:ring-2 focus:ring-emerald-500
                            focus:border-transparent"
                        />

                    </div>


                    {/* Transaction type filters */}
                    <div>

                        <p className="text-sm font-medium text-slate-700 mb-2">
                            Filter transactions
                        </p>

                        <div className="flex flex-wrap gap-2">

                            {/* All transactions */}
                            <button
                                type="button"
                                onClick={() => setHistoryFilter("All")}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                                    historyFilter === "All"
                                        ? "bg-slate-800 text-white"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                            >
                                All
                            </button>


                            {/* Income transactions */}
                            <button
                                type="button"
                                onClick={() => setHistoryFilter("Income")}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                                    historyFilter === "Income"
                                        ? "bg-emerald-600 text-white"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                            >
                                Income
                            </button>


                            {/* Expense transactions */}
                            <button
                                type="button"
                                onClick={() => setHistoryFilter("Expense")}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                                    historyFilter === "Expense"
                                        ? "bg-red-600 text-white"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                            >
                                Expense
                            </button>

                            {/* Clear search and filter */}
                            {(searchTerm || historyFilter !== "All") && (
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="px-4 py-2 rounded-lg text-sm font-medium
                                    text-slate-600 bg-white border border-slate-200
                                    hover:bg-slate-50 transition"
                                >
                                    Clear Filters
                                </button>
                            )}

                        </div>

                    </div>

                </div>


                {/*
                    Transaction count:

                    filteredTransactions.length tells us how many
                    transactions are currently visible.

                    The count automatically changes when the user
                    searches or changes the filter.
                */}
                <div className="px-5 py-3 bg-slate-50 border-b border-slate-100">

                    <p className="text-sm text-slate-500">

                        Showing{" "}

                        <span className="font-semibold text-slate-700">
                            {filteredTransactions.length}
                        </span>

                        {" "}

                        {filteredTransactions.length === 1
                            ? "transaction"
                            : "transactions"}

                    </p>

                </div>


                {/*
                    Transaction list.

                    We use filteredTransactions instead of
                    the original transactions array.
                */}
                {filteredTransactions.length > 0 ? (

                    <div className="divide-y divide-slate-100">

                        {filteredTransactions.map((transaction) => (

                            <div
                                key={transaction.id}
                                className="p-5 flex flex-col sm:flex-row sm:items-center
                                sm:justify-between gap-4"
                            >

                                {/* Transaction information */}
                                {/* Transaction information */}


                            <div className="flex items-center gap-3">

                            {/*
                                Small coloured circle showing the transaction type.

                                Green = Income
                                Red = Expense
                            */}
                            <div
                                className={`w-10 h-10 rounded-full flex items-center
                                justify-center flex-shrink-0 ${
                                    transaction.type === "Income"
                                        ? "bg-emerald-100"
                                        : "bg-red-100"
                                }`}
                            >

                                <span
                                    className={`w-3 h-3 rounded-full ${
                                        transaction.type === "Income"
                                            ? "bg-emerald-500"
                                            : "bg-red-500"
                                    }`}
                                ></span>

                            </div>


                            {/* Transaction title, category and date */}
                            <div>

                                <h3 className="font-semibold text-slate-800">
                                    {transaction.title}
                                </h3>

                                <p className="text-sm text-slate-500 mt-1">
                                    {transaction.category}
                                    {" • "}
                                    {transaction.date}
                                </p>

                            </div>

                        </div>


                                {/* Amount and actions */}
                                <div className="flex items-center gap-4">

                                    <p
                                        className={`font-bold ${
                                            transaction.type === "Income"
                                                ? "text-emerald-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {transaction.type === "Income"
                                            ? "+"
                                            : "-"}
                                        ₦{Number(transaction.amount).toLocaleString()}
                                    </p>


                                    {/* Edit button */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            onEdit(transaction.id)
                                        }
                                        className="text-sm text-blue-600
                                        hover:text-blue-700 font-medium"
                                    >
                                        Edit
                                    </button>


                                    {/* Delete button */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            onDelete(transaction.id)
                                        }
                                        className="text-sm text-red-600
                                        hover:text-red-700 font-medium"
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                ) : (

                    /* Empty state */
                    <div className="p-10 text-center">

                        <h3 className="font-semibold text-slate-700">

                            {transactions.length === 0
                                ? "No transactions yet"
                                : "No matching transactions"}

                        </h3>

                        <p className="text-sm text-slate-500 mt-2">

                            {transactions.length === 0
                                ? "Your transaction history will appear here."
                                : "Try changing your search or filter."}

                        </p>

                    </div>

                )}

            </div>

        </section>
    );
}


export default TransactionHistory;
