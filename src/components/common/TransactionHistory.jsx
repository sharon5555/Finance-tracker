// Import useState and useEffect so we can store state and manage effects.
import { useEffect, useState } from "react";
// Import jsPDF for generating downloadable transaction receipts.
import { jsPDF } from "jspdf";
// Import XLSX for generating Excel workbooks.
import * as XLSX from "xlsx";


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
// - View detailed transaction info via modal (with PDF receipt download, printing, copyable Reference ID)
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

    // Store the transaction the user wants to view.
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    // Tracks whether the transaction reference ID has been copied.
    const [copiedReference, setCopiedReference] = useState(false);


    // =========================================
    // DOWNLOAD TRANSACTION RECEIPT AS PDF
    // =========================================

    function downloadReceipt() {
        if (!selectedTransaction) return;

        // Create a new PDF document.
        const doc = new jsPDF();

        // Generate the transaction reference.
        const referenceId = `FIN-${String(
            selectedTransaction.id
        ).slice(-8).toUpperCase()}`;

        // Format the transaction date.
        const formattedDate = selectedTransaction.date
            ? new Date(
                selectedTransaction.date + "T00:00:00"
            ).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric"
            })
            : "No date available";

        // Format the transaction amount.
        const amount = Number(
            selectedTransaction.amount
        ).toLocaleString("en-NG");

        // Receipt heading.
        doc.setFont("helvetica", "bold");
        doc.setFontSize(24);
        doc.setTextColor(37, 99, 235);
        doc.text("FinFlow", 105, 25, { align: "center" });

        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text("Transaction Receipt", 105, 34, {
            align: "center"
        });

        // Horizontal divider.
        doc.setDrawColor(220, 220, 220);
        doc.line(20, 43, 190, 43);

        // Transaction amount.
        doc.setFontSize(11);
        doc.setTextColor(100, 100, 100);
        doc.text("Transaction Amount", 20, 58);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.setTextColor(
            selectedTransaction.type === "Income" ? 22 : 220,
            selectedTransaction.type === "Income" ? 163 : 38,
            selectedTransaction.type === "Income" ? 74 : 38
        );

        const sign =
            selectedTransaction.type === "Income" ? "+" : "-";

        doc.text(`${sign} NGN ${amount}`, 20, 70);

        // Transaction information.
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.setTextColor(80, 80, 80);

        let yPosition = 92;

        const addDetail = (label, value) => {
            doc.setFont("helvetica", "normal");
            doc.setTextColor(100, 100, 100);
            doc.text(label, 20, yPosition);

            doc.setFont("helvetica", "bold");
            doc.setTextColor(40, 40, 40);

            const lines = doc.splitTextToSize(
                String(value || "Not provided"),
                95
            );

            doc.text(lines, 190, yPosition, {
                align: "right"
            });

            yPosition += Math.max(12, lines.length * 6 + 4);
        };

        addDetail("Description", selectedTransaction.title);
        addDetail("Category", selectedTransaction.category);
        addDetail("Transaction Type", selectedTransaction.type);
        addDetail("Date", formattedDate);
        addDetail("Reference ID", referenceId);

        // Receipt footer.
        doc.setDrawColor(220, 220, 220);
        doc.line(20, yPosition + 5, 190, yPosition + 5);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(37, 99, 235);

        doc.text(
            "Thank you for using FinFlow!",
            105,
            yPosition + 17,
            { align: "center" }
        );

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(120, 120, 120);

        doc.text(
            "Personal finance record - Not proof of payment.",
            105,
            yPosition + 24,
            { align: "center" }
        );

        // Download the PDF.
        doc.save(`FinFlow-Receipt-${referenceId}.pdf`);
    }


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


    /*
        Close the transaction details modal
        when the user presses the Escape key.
    */
    useEffect(() => {
        // Do nothing if the modal is not open.
        if (!selectedTransaction) {
            return;
        }

        function handleEscapeKey(event) {
            if (event.key === "Escape") {
                setSelectedTransaction(null);
            }
        }

        // Listen for keyboard input.
        window.addEventListener("keydown", handleEscapeKey);

        // Remove the listener when the modal closes
        // or the component is removed.
        return () => {
            window.removeEventListener("keydown", handleEscapeKey);
        };
    }, [selectedTransaction]);


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


    // =========================================
    // EXPORT TRANSACTIONS WITH FINANCIAL SUMMARY
    // =========================================
    function exportTransactions() {

        // Stop if there are no transactions to export.
        if (sortedTransactions.length === 0) {
            window.alert("There are no transactions to export.");
            return;
        }

        // Calculate income from the displayed transactions.
        const totalIncome = sortedTransactions
            .filter((transaction) => transaction.type === "Income")
            .reduce(
                (total, transaction) => total + Number(transaction.amount),
                0
            );

        // Calculate expenses from the displayed transactions.
        const totalExpenses = sortedTransactions
            .filter((transaction) => transaction.type === "Expense")
            .reduce(
                (total, transaction) => total + Number(transaction.amount),
                0
            );

        // Calculate the net amount.
        const netBalance = totalIncome - totalExpenses;

        // Prepare CSV headings.
        const headers = [
            "Date",
            "Title",
            "Category",
            "Type",
            "Amount"
        ];

        // Convert transaction records into CSV rows.
        const rows = sortedTransactions.map((transaction) => [
            transaction.date,
            transaction.title,
            transaction.category,
            transaction.type,
            Number(transaction.amount)
        ]);

        // Escape commas, quotes and special characters in CSV values.
        const escapeCSV = (value) => {
            const text = String(value ?? "");
            return `"${text.replace(/"/g, '""')}"`;
        };

        // Build the transaction CSV.
        const transactionCSV = [
            headers.map(escapeCSV).join(","),
            ...rows.map((row) => row.map(escapeCSV).join(","))
        ];

        // Add a financial summary at the bottom.
        const summaryRows = [
            [],
            ["FINANCIAL SUMMARY"],
            ["Total Income", totalIncome],
            ["Total Expenses", totalExpenses],
            ["Net Balance", netBalance],
            ["Transactions Exported", sortedTransactions.length]
        ];

        // Convert summary rows into CSV format.
        const summaryCSV = summaryRows.map((row) =>
            row.map(escapeCSV).join(",")
        );

        // Combine transaction records and summary.
        const csvContent = [
            ...transactionCSV,
            ...summaryCSV
        ].join("\n");

        // Create a downloadable CSV file.
        const blob = new Blob(
            ["\uFEFF" + csvContent],
            { type: "text/csv;charset=utf-8;" }
        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "FinFlow-Transactions.csv";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    }


    // =========================================
    // EXPORT TRANSACTIONS TO EXCEL
    // =========================================

    function exportToExcel() {

        // Check whether there are transactions to export.
        if (sortedTransactions.length === 0) {
            window.alert("There are no transactions to export.");
            return;
        }

        // Calculate total income.
        const totalIncome = sortedTransactions
            .filter((transaction) => transaction.type === "Income")
            .reduce(
                (total, transaction) =>
                    total + Number(transaction.amount || 0),
                0
            );

        // Calculate total expenses.
        const totalExpenses = sortedTransactions
            .filter((transaction) => transaction.type === "Expense")
            .reduce(
                (total, transaction) =>
                    total + Number(transaction.amount || 0),
                0
            );

        // Calculate the net balance.
        const netBalance = totalIncome - totalExpenses;

        // Prepare transaction data for Excel.
        const transactionData = sortedTransactions.map((transaction) => ({
            Date: transaction.date,
            Title: transaction.title,
            Category: transaction.category,
            Type: transaction.type,
            Amount: Number(transaction.amount),
            "Reference ID": `FIN-${String(transaction.id)
                .slice(-8)
                .toUpperCase()}`
        }));

        // Create the Transactions worksheet.
        const transactionSheet = XLSX.utils.json_to_sheet(
            transactionData
        );

        // Set column widths.
        transactionSheet["!cols"] = [
            { wch: 15 },
            { wch: 25 },
            { wch: 20 },
            { wch: 15 },
            { wch: 18 },
            { wch: 22 }
        ];

        // Prepare financial summary data.
        const summaryData = [
            ["FINFLOW FINANCIAL SUMMARY"],
            [],
            ["Financial Overview", "Amount"],
            ["Total Income", totalIncome],
            ["Total Expenses", totalExpenses],
            ["Net Balance", netBalance],
            [],
            ["Transactions Exported", sortedTransactions.length]
        ];

        // Create the Financial Summary worksheet.
        const summarySheet = XLSX.utils.aoa_to_sheet(
            summaryData
        );

        // Set summary column widths.
        summarySheet["!cols"] = [
            { wch: 30 },
            { wch: 20 }
        ];

        // Create a new Excel workbook.
        const workbook = XLSX.utils.book_new();

        // Add both worksheets to the workbook.
        XLSX.utils.book_append_sheet(
            workbook,
            transactionSheet,
            "Transactions"
        );

        XLSX.utils.book_append_sheet(
            workbook,
            summarySheet,
            "Financial Summary"
        );

        // Download the Excel workbook.
        XLSX.writeFile(
            workbook,
            "FinFlow-Financial-Report.xlsx"
        );
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

                            {/* Export Transactions to Excel */}
                            <button
                                type="button"
                                onClick={exportToExcel}
                                disabled={sortedTransactions.length === 0}
                                className="rounded-xl bg-green-600 px-5 py-3
                                text-white font-semibold hover:bg-green-700
                                transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Export Excel
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
                {/* Display the current transaction range */}
                <div className="px-5 py-3 bg-slate-50 border-b border-slate-100">

                    <p className="text-sm text-slate-500">
                        Showing{" "}

                        <span className="font-semibold text-slate-700">
                            {sortedTransactions.length === 0
                                ? 0
                                : startIndex + 1}
                        </span>

                        {" - "}

                        <span className="font-semibold text-slate-700">
                            {Math.min(
                                startIndex + paginatedTransactions.length,
                                sortedTransactions.length
                            )}
                        </span>

                        {" "}of{" "}

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


                                    {/* View Details button */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setCopiedReference(false);
                                            setSelectedTransaction(transaction);
                                        }}
                                        className="px-3 py-2 rounded-lg text-sm font-medium
                                        text-emerald-700 bg-emerald-50
                                        hover:bg-emerald-100 transition"
                                    >
                                        View Details
                                    </button>


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


            {/* =========================================
                TRANSACTION DETAILS MODAL
            ========================================= */}

            {selectedTransaction && (
                <div
                    onClick={() => setSelectedTransaction(null)}
                    className="fixed inset-0 z-50 flex items-center justify-center
                    bg-black/60 backdrop-blur-sm p-4"
                >
                    {/* Modal Container */}
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="transaction-modal-title"
                        onClick={(event) => event.stopPropagation()}
                        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto
                        rounded-2xl bg-white p-5 sm:p-7 shadow-2xl"
                    >

                        {/* Modal Header */}
                        <div className="flex items-start justify-between gap-4 mb-6">

                            <div>
                                <p className="text-sm text-gray-500 mb-1">
                                    Transaction Details
                                </p>

                                <h2
                                    id="transaction-modal-title"
                                    className="text-xl sm:text-2xl font-bold text-gray-800"
                                >
                                    {selectedTransaction.title}
                                </h2>
                            </div>

                            {/* Close Button */}
                            <button
                                type="button"
                                onClick={() => setSelectedTransaction(null)}
                                aria-label="Close transaction details"
                                className="flex-shrink-0 w-9 h-9 rounded-full
                                bg-gray-100 text-gray-600 hover:bg-gray-200
                                transition"
                            >
                                ✕
                            </button>

                        </div>


                        {/* Transaction Amount */}
                        <div className="rounded-2xl bg-gray-50 p-5 mb-6">

                            <p className="text-sm text-gray-500 mb-2">
                                Transaction Amount
                            </p>

                            <h3
                                className={`text-3xl sm:text-4xl font-bold ${
                                    selectedTransaction.type === "Income"
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}
                            >
                                {selectedTransaction.type === "Income" ? "+" : "-"}
                                ₦{Number(selectedTransaction.amount).toLocaleString()}
                            </h3>

                            <span
                                className={`inline-block mt-3 px-3 py-1 rounded-full
                                text-xs font-semibold ${
                                    selectedTransaction.type === "Income"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                }`}
                            >
                                {selectedTransaction.type}
                            </span>

                        </div>


                        {/* Transaction Information */}
                        <div className="space-y-4 mb-7">

                            <div className="flex justify-between gap-4 border-b
                            border-gray-100 pb-3">
                                <span className="text-sm text-gray-500">
                                    Category
                                </span>

                                <span className="text-sm font-semibold text-gray-800">
                                    {selectedTransaction.category}
                                </span>
                            </div>

                            <div className="flex justify-between gap-4 border-b
                            border-gray-100 pb-3">
                                <span className="text-sm text-gray-500">
                                    Date
                                </span>

                                <span className="text-sm font-semibold text-gray-800">
                                    {selectedTransaction.date
                                        ? new Date(
                                            selectedTransaction.date + "T00:00:00"
                                        ).toLocaleDateString("en-GB", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric"
                                        })
                                        : "No date available"}
                                </span>
                            </div>

                            {/* Transaction Reference ID */}
                            <div className="flex flex-col sm:flex-row sm:items-center
                            justify-between gap-3 border-b border-gray-100 pb-3">

                                <span className="text-sm text-gray-500">
                                    Reference ID
                                </span>

                                <div className="flex items-center justify-between gap-3">

                                    <span className="text-sm font-semibold text-blue-600
                                    break-all">
                                        FIN-{String(selectedTransaction.id)
                                            .slice(-8)
                                            .toUpperCase()}
                                    </span>

                                    {/* Copy Reference ID Button */}
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            const referenceId = `FIN-${String(
                                                selectedTransaction.id
                                            ).slice(-8).toUpperCase()}`;

                                            try {
                                                await navigator.clipboard.writeText(referenceId);
                                                setCopiedReference(true);
                                            } catch (error) {
                                                window.alert(
                                                    "Unable to copy the reference ID. Please copy it manually."
                                                );
                                            }
                                        }}
                                        className="shrink-0 rounded-lg bg-blue-50
                                        px-3 py-2 text-xs font-semibold text-blue-600
                                        hover:bg-blue-100 transition"
                                    >
                                        {copiedReference ? "Copied!" : "Copy ID"}
                                    </button>

                                </div>

                            </div>

                            <div className="flex justify-between gap-4">
                                <span className="text-sm text-gray-500">
                                    Transaction Type
                                </span>

                                <span className="text-sm font-semibold text-gray-800">
                                    {selectedTransaction.type}
                                </span>
                            </div>

                        </div>


                        {/* =========================================
                            PRINTABLE TRANSACTION RECEIPT
                        ========================================= */}

                        <div id="transaction-receipt" className="hidden">

                            <div className="max-w-md mx-auto border border-gray-200
                            rounded-xl p-8 bg-white">

                                {/* Receipt Header */}
                                <div className="text-center border-b border-dashed
                                border-gray-300 pb-5 mb-5">

                                    <h1 className="text-3xl font-bold text-blue-600">
                                        FinFlow
                                    </h1>

                                    <p className="text-sm text-gray-500 mt-2">
                                        Transaction Receipt
                                    </p>

                                    <p className="text-xs text-gray-400 mt-1">
                                        Your finances, organised.
                                    </p>

                                </div>

                                {/* Receipt Amount */}
                                <div className="text-center mb-6">

                                    <p className="text-sm text-gray-500">
                                        Transaction Amount
                                    </p>

                                    <h2 className="text-3xl font-bold text-gray-900 mt-2">
                                        {selectedTransaction.type === "Income" ? "+" : "-"}
                                        ₦{Number(selectedTransaction.amount).toLocaleString()}
                                    </h2>

                                    <span className="inline-block mt-3 text-sm font-semibold
                                    text-gray-600">
                                        {selectedTransaction.type}
                                    </span>

                                </div>

                                {/* Receipt Information */}
                                <div className="space-y-4 text-sm">

                                    <div className="flex justify-between gap-4">
                                        <span className="text-gray-500">Description</span>
                                        <span className="font-semibold text-gray-800 text-right">
                                            {selectedTransaction.title}
                                        </span>
                                    </div>

                                    <div className="flex justify-between gap-4">
                                        <span className="text-gray-500">Category</span>
                                        <span className="font-semibold text-gray-800">
                                            {selectedTransaction.category}
                                        </span>
                                    </div>

                                    <div className="flex justify-between gap-4">
                                        <span className="text-gray-500">Date</span>
                                        <span className="font-semibold text-gray-800">
                                            {selectedTransaction.date}
                                        </span>
                                    </div>

                                    <div className="flex justify-between gap-4">
                                        <span className="text-gray-500">Reference ID</span>
                                        <span className="font-semibold text-blue-600 text-right
                                        break-all">
                                            FIN-{String(selectedTransaction.id)
                                                .slice(-8)
                                                .toUpperCase()}
                                        </span>
                                    </div>

                                </div>

                                {/* Receipt Footer */}
                                <div className="border-t border-dashed border-gray-300
                                mt-7 pt-5 text-center">

                                    <p className="text-sm font-semibold text-gray-700">
                                        Thank you for using FinFlow!
                                    </p>

                                    <p className="text-xs text-gray-400 mt-2">
                                        This is a personal finance record.
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* Modal Action Buttons */}
                        <div className="space-y-3">

                            {/* Download PDF Receipt */}
                            <button
                                type="button"
                                onClick={downloadReceipt}
                                className="w-full rounded-xl bg-blue-600 py-3
                                text-white font-semibold hover:bg-blue-700
                                transition"
                            >
                                Download PDF Receipt
                            </button>


                            {/* Print Transaction Receipt */}
                            <button
                                type="button"
                                onClick={() => window.print()}
                                className="w-full rounded-xl bg-gray-800 py-3
                                text-white font-semibold hover:bg-gray-900
                                transition"
                            >
                                Print Receipt
                            </button>


                            {/* Edit Transaction */}
                            <button
                                type="button"
                                onClick={() => {
                                    onEdit(selectedTransaction.id);
                                    setSelectedTransaction(null);
                                }}
                                className="w-full rounded-xl bg-blue-600 py-3
                                text-white font-semibold hover:bg-blue-700
                                transition"
                            >
                                Edit Transaction
                            </button>


                            {/* Delete Transaction */}
                            <button
                                type="button"
                                onClick={() => {
                                    const deleted = onDelete(selectedTransaction.id);

                                    if (deleted) {
                                        setSelectedTransaction(null);
                                    }
                                }}
                                className="w-full rounded-xl bg-red-50 py-3
                                text-red-600 font-semibold hover:bg-red-100
                                transition"
                            >
                                Delete Transaction
                            </button>


                            {/* Close Modal */}
                            <button
                                type="button"
                                onClick={() => setSelectedTransaction(null)}
                                className="w-full rounded-xl border border-gray-200
                                py-3 text-gray-600 font-semibold
                                hover:bg-gray-50 transition"
                            >
                                Close
                            </button>

                        </div>

                    </div>
                </div>
            )}

        </section>
    );
}


export default TransactionHistory;