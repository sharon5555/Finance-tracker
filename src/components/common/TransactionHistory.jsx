// TransactionHistory display the users complete transaction history.
// Unlike the dashboard's Recent Transactions section,
// this component will eventually show every transaction.


function TransactionHistory({
    transactions,
    onEdit,
    onDelete
}) {

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

            {/* Transaction list */}
            <div className="bg-white rounded-2xl shadow-sm border-slate-100 overflow-hidden">

                {transactions.length > 0 ? (

                    <div className="divide-y divide-slate-100">

                        {transactions.map((transaction) => (

                            <div 
                                key={transaction.id}
                                className="p-5 flex items-center justify-between"
                            >

                                {/* Transaction information */}
                                <div>
                                    <h3 className="font-semibold text-slate-800">
                                        {transaction.title}
                                    </h3>

                                    <p className="text-sm text-slate-500 mt-1">
                                        {transaction.catergory} {" "}
                                        {transaction.date}
                                    </p>
                                </div>

                                {/* Amount and actions */}
                                <div className="flex items-center gap-4">

                                    <p
                                        className={` font-bold ${
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
                                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                        >
                                            Edit
                                    </button>


                                    {/* Delete button */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            onDelete(transaction.id)
                                        }
                                        className="text-sm text-red-600 hover:text-red-700 font-medium"
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
                            No transaction yet
                        </h3>

                        <p className="text-sm text-slate-500 mt-2">
                            Your transaction history will appear here.
                        </p>

                    </div>
                )}

            </div>

        </section>
    );
}


export default TransactionHistory;