// Import useState so we can store and update the search,
// filter, and sorting values.
import { useState } from "react";


// TransactionHistory displays the user's complete transaction history.
//
// It allows the user to:
// - Search transactions
// - Filter by All, Income, or Expense
// - Sort transactions
// - See how many transactions are displayed
// - Edit transactions
// - Delete transactions
// - Clearly identify Income and Expense transactions

function TransactionHistory({
    transactions,
    onEdit,
    onDelete
}) {

    // Store the text entered into the transaction search box.
    const [searchTerm, setSearchTerm] = useState("");

    // Store the selected transaction type filter.
    const [historyFilter, setHistoryFilter] = useState("All");

    // Store the selected sorting option.
    const [sortOption, setSortOption] = useState("newest");


    // Reset the search, filter, and sorting options.
    function clearFilters() {
        setSearchTerm("");
        setHistoryFilter("All");
        setSortOption("newest");
    }


    /*
        First filter the transactions.

        A transaction must:
        - Match the selected Income/Expense filter.
        - Match the search text.
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


        // Both conditions must be true.
        return matchesFilter && matchesSearch;
    });


    /*
        Sort the filtered transactions.

        We create a copy using [...filteredTransactions]
        so we don't accidentally change the original
        transactions array.
    */
    const sortedTransactions = [...filteredTransactions].sort(
        (a, b) => {

            // Newest transaction first.
            if (sortOption === "newest") {
                return new Date(b.date) - new Date(a.date);
            }


            // Oldest transaction first.
            if (sortOption === "oldest") {
                return new Date(a.date) - new Date(b.date);
            }


            // Highest transaction amount first.
            if (sortOption === "highest") {
                return Number(b.amount) - Number(a.amount);
            }


            // Lowest transaction amount first.
            if (sortOption === "lowest") {
                return Number(a.amount) - Number(b.amount);
            }


            // Keep the original order if no option matches.
            return 0;
        }
    );

        // Export the currently displayed transactions as a CSV file.
function exportTransactions() {
    // Stop if there are no transactions to export.
    if (sortedTransactions.length === 0) {
        return;
    }

    // These are the column headings in the downloaded file.
    const headers = [
        "Date",
        "Title",
        "Category",
        "Type",
        "Amount"
    ];

    // Convert each transaction into a CSV row.
    const rows = sortedTransactions.map((transaction) => [
        transaction.date,
        transaction.title,
        transaction.category,
        transaction.type,
        transaction.amount
    ]);

    // Combine the headings and transaction rows.
    const csvContent = [headers, ...rows]
        .map((row) =>
            row.map((value) =>
                `"${String(value ?? "").replace(/"/g, '""')}"`
            ).join(",")
        )
        .join("\n");

    // Create a downloadable CSV file.
    const file = new Blob(
        ["\uFEFF" + csvContent],
        { type: "text/csv;charset=utf-8;" }
    );

        // Create a temporary download link.
        const url = URL.createObjectURL(file);
        const link = document.createElement("a");

        link.href = url;
        link.download = "FinFlow-Transactions.csv";

        // Start the download.
        document.body.appendChild(link);
        link.click();

        // Clean up the temporary link and URL.
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }


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

                The search box, filters, sorting controls,
                count, and transaction list all belong
                to this card.
            */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">


                {/* Search, filter, and sorting controls */}
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
                    <div className="mb-5">

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


                            {/* Clear filters */}
                            {(searchTerm || historyFilter !== "All" || sortOption !== "newest") && (
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

                            <button
                                type="button"
                                onClick={exportTransactions}
                                disabled={sortedTransactions.length === 0}
                                className="px-4 py-3 rounded-xl bg-emerald-600
                                text-white text-sm font-semibold
                                hover:bg-emerald-700 transition
                                disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Export CSV
                            </button>

                        </div>

                    </div>


                    {/* Sorting control */}
                    <div>

                        <label
                            htmlFor="transaction-sort"
                            className="block text-sm font-medium text-slate-700 mb-2"
                        >
                            Sort transactions
                        </label>

                        <select
                            id="transaction-sort"
                            value={sortOption}
                            onChange={(event) =>
                                setSortOption(event.target.value)
                            }
                            className="w-full sm:w-auto min-w-52 px-4 py-3
                            rounded-xl border border-slate-200 bg-white
                            text-slate-700
                            focus:outline-none focus:ring-2
                            focus:ring-emerald-500
                            focus:border-transparent"
                        >
                            <option value="newest">
                                Newest first
                            </option>

                            <option value="oldest">
                                Oldest first
                            </option>

                            <option value="highest">
                                Highest amount
                            </option>

                            <option value="lowest">
                                Lowest amount
                            </option>
                        </select>

                    </div>

                </div>


                {/*
                    Transaction count.

                    sortedTransactions contains the same number
                    of transactions as filteredTransactions, but
                    now in the selected order.
                */}
                <div className="px-5 py-3 bg-slate-50 border-b border-slate-100">

                    <p className="text-sm text-slate-500">

                        Showing{" "}

                        <span className="font-semibold text-slate-700">
                            {sortedTransactions.length}
                        </span>

                        {" "}

                        {sortedTransactions.length === 1
                            ? "transaction"
                            : "transactions"}

                    </p>

                </div>


                {/*
                    Transaction list.

                    We display sortedTransactions so the user's
                    selected sorting option controls the order.
                */}
                {sortedTransactions.length > 0 ? (

                    <div className="divide-y divide-slate-100">

                        {sortedTransactions.map((transaction) => (

                            <div
                                key={transaction.id}
                                className="p-5 flex flex-col sm:flex-row
                                sm:items-center sm:justify-between gap-4"
                            >

                                {/* Transaction information */}
                                <div className="flex items-center gap-3">

                                    {/*
                                        Small coloured circle showing
                                        the transaction type.

                                        Green = Income
                                        Red = Expense
                                    */}
                                    <div
                                        className={`w-10 h-10 rounded-full
                                        flex items-center justify-center
                                        flex-shrink-0 ${
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


                                {/*
                                    Amount, transaction type, and actions.

                                    flex-wrap allows these controls
                                    to move onto another line on
                                    smaller screens.
                                */}
                                <div className="flex items-center gap-4 flex-wrap">

                                    {/* Transaction type badge */}
                                    <span
                                        className={`px-3 py-1 rounded-full
                                        text-xs font-semibold ${
                                            transaction.type === "Income"
                                                ? "bg-emerald-100 text-emerald-700"
                                                : "bg-red-100 text-red-700"
                                        }`}
                                    >
                                        {transaction.type}
                                    </span>


                                    {/* Transaction amount */}
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