// Import useState and useEffect so we can store state and manage effects.
import { useEffect, useState } from "react";


// TransactionHistory displays the user's complete transaction history.
//
// It allows the user to:
// - Search transactions
// - Filter by All, Income, or Expense
// - Filter by Date Range
// - Choose transactions per page (10, 20, 50)
// - Sort transactions
// - Paginate through transaction results with compact numbered buttons and ellipses
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

    // Store the beginning and ending dates for filtering transactions.
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // Store the current transaction history page.
    const [currentPage, setCurrentPage] = useState(1);

    // Allow users to choose how many transactions appear per page.
    const [itemsPerPage, setItemsPerPage] = useState(10);


    /*
        Reset pagination whenever the filters or page size change.
    */
    useEffect(() => {
        setCurrentPage(1);
    }, [
        searchTerm,
        historyFilter,
        startDate,
        endDate,
        itemsPerPage
    ]);


    // Reset the search, filter, date range, sorting, and pagination options.
    function clearFilters() {
        setSearchTerm("");
        setHistoryFilter("All");
        setSortOption("newest");
        setStartDate("");
        setEndDate("");
        setCurrentPage(1);
        setItemsPerPage(10);
    }


    /*
        First filter the transactions.

        A transaction must:
        - Match the selected Income/Expense filter.
        - Match the search text.
        - Fall within the selected date range.
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


        // Check whether a transaction falls within the selected date range.
        const matchesStartDate =
            !startDate || transaction.date >= startDate;

        const matchesEndDate =
            !endDate || transaction.date <= endDate;


        // All conditions must be true.
        return matchesFilter && matchesSearch && matchesStartDate && matchesEndDate;
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


    // Calculate how many pages are needed.
    const totalPages = Math.max(
        Math.ceil(sortedTransactions.length / itemsPerPage),
        1
    );

    // Keep the current page within the available page range.
    const safeCurrentPage = Math.min(currentPage, totalPages);


    /*
        Create compact pagination numbers.

        Show:
        - The first page.
        - Nearby pages.
        - The last page.
        - Ellipses when some pages are hidden.
    */
    const pageNumbers = (() => {
        // Show all pages when there are 5 or fewer.
        if (totalPages <= 5) {
            return Array.from(
                { length: totalPages },
                (_, index) => index + 1
            );
        }

        const pages = [];

        // Always show the first page.
        pages.push(1);

        // Add an ellipsis when earlier pages are hidden.
        if (safeCurrentPage > 3) {
            pages.push("...");
        }

        // Show the page before, current page, and page after.
        const startPage = Math.max(2, safeCurrentPage - 1);
        const endPage = Math.min(totalPages - 1, safeCurrentPage + 1);

        for (let page = startPage; page <= endPage; page++) {
            pages.push(page);
        }

        // Add an ellipsis when later pages are hidden.
        if (safeCurrentPage < totalPages - 2) {
            pages.push("...");
        }

        // Always show the last page.
        pages.push(totalPages);

        return pages;
    })();


    // Calculate where the current page's transactions begin.
    const startIndex = (safeCurrentPage - 1) * itemsPerPage;

    // Get only the transactions for the current page.
    const paginatedTransactions = sortedTransactions.slice(
        startIndex,
        startIndex + itemsPerPage
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

                The search box, date filters, transaction filters, 
                sorting controls, count, and transaction list all belong
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


                    {/* Date range filters */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">

                        {/* Starting date */}
                        <div>
                            <label
                                htmlFor="start-date"
                                className="block text-sm font-medium text-slate-700 mb-2"
                            >
                                From date
                            </label>

                            <input
                                type="date"
                                id="start-date"
                                value={startDate}
                                onChange={(event) => setStartDate(event.target.value)}
                                className="w-full px-4 py-3 rounded-xl border
                                border-slate-200 bg-white text-slate-700
                                focus:outline-none focus:ring-2
                                focus:ring-emerald-500"
                            />
                        </div>

                        {/* Ending date */}
                        <div>
                            <label
                                htmlFor="end-date"
                                className="block text-sm font-medium text-slate-700 mb-2"
                            >
                                To date
                            </label>

                            <input
                                type="date"
                                id="end-date"
                                value={endDate}
                                min={startDate || undefined}
                                onChange={(event) => setEndDate(event.target.value)}
                                className="w-full px-4 py-3 rounded-xl border
                                border-slate-200 bg-white text-slate-700
                                focus:outline-none focus:ring-2
                                focus:ring-emerald-500"
                            />
                        </div>

                    </div>


                    {/* Transactions per page selector */}
                    <div className="mb-5 flex flex-col sm:flex-row items-start sm:items-center gap-3">

                        <label
                            htmlFor="items-per-page"
                            className="text-sm font-medium text-slate-700"
                        >
                            Transactions per page:
                        </label>

                        <select
                            id="items-per-page"
                            value={itemsPerPage}
                            onChange={(event) =>
                                setItemsPerPage(Number(event.target.value))
                            }
                            className="px-4 py-2 rounded-lg border
                            border-slate-200 bg-white text-sm text-slate-700
                            focus:outline-none focus:ring-2
                            focus:ring-emerald-500"
                        >
                            <option value={10}>10 transactions</option>
                            <option value={20}>20 transactions</option>
                            <option value={50}>50 transactions</option>
                        </select>

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
                            {(searchTerm || historyFilter !== "All" || sortOption !== "newest" || startDate || endDate || itemsPerPage !== 10) && (
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

                    sortedTransactions contains the total number
                    of matching transactions.
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
                    Transaction list (paginated).

                    We display paginatedTransactions so only the current
                    page's items are rendered.
                */}
                {sortedTransactions.length > 0 ? (

                    <div className="divide-y divide-slate-100">

                        {paginatedTransactions.map((transaction) => (

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
                                : "Try changing your search, date range, or filter."}

                        </p>

                    </div>

                )}


                {/* Transaction history pagination */}
                {sortedTransactions.length > itemsPerPage && (
                    <div className="p-5 flex flex-col sm:flex-row items-center
                    justify-between gap-4 border-t border-slate-100 bg-slate-50/50">

                        {/* Show the current page */}
                        <p className="text-sm text-slate-500">
                            Page{" "}
                            <span className="font-semibold text-slate-700">
                                {safeCurrentPage}
                            </span>
                            {" "}of{" "}
                            <span className="font-semibold text-slate-700">
                                {totalPages}
                            </span>
                        </p>

                        {/* Pagination buttons */}
                        <div className="flex flex-wrap items-center justify-center gap-2">

                            {/* Previous button */}
                            <button
                                type="button"
                                onClick={() => setCurrentPage(safeCurrentPage - 1)}
                                disabled={safeCurrentPage === 1}
                                className="px-3 py-2 rounded-lg border
                                border-slate-200 text-sm text-slate-700
                                hover:bg-slate-50 transition
                                disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>

                            {/* Compact numbered page buttons */}
                            {pageNumbers.map((pageNumber, index) => (
                                pageNumber === "..." ? (
                                    // Display ellipsis instead of a clickable button.
                                    <span
                                        key={`ellipsis-${index}`}
                                        className="px-2 text-slate-400"
                                    >
                                        ...
                                    </span>
                                ) : (
                                    // Display clickable page numbers.
                                    <button
                                        key={pageNumber}
                                        type="button"
                                        onClick={() => setCurrentPage(pageNumber)}
                                        aria-current={
                                            safeCurrentPage === pageNumber
                                                ? "page"
                                                : undefined
                                        }
                                        className={`w-10 h-10 rounded-lg text-sm
                                        font-semibold transition ${
                                            safeCurrentPage === pageNumber
                                                ? "bg-emerald-600 text-white"
                                                : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                                        }`}
                                    >
                                        {pageNumber}
                                    </button>
                                )
                            ))}

                            {/* Next button */}
                            <button
                                type="button"
                                onClick={() => setCurrentPage(safeCurrentPage + 1)}
                                disabled={safeCurrentPage === totalPages}
                                className="px-3 py-2 rounded-lg bg-emerald-600
                                text-white text-sm hover:bg-emerald-700
                                transition disabled:opacity-40
                                disabled:cursor-not-allowed"
                            >
                                Next
                            </button>

                        </div>

                    </div>
                )}

            </div>

        </section>
    );
}


export default TransactionHistory;