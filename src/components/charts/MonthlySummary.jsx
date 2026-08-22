// This component displays a simple summary
// of the user's current month's finances.

function MonthlySummary({

    income,
    expenses,
    savings
}) {

    return (

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

            {/* Section heading */}
            <div className="mb-6">

                <h2 className="text-xl font-bold text-slate-800">
                    Monthly Summary
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                    Your financial activity for this month.
                </p>
            </div>

            {/* Summary values */}
            <div className="grid grid-cols-1 sm:grid-col-3 gap-4">

                {/* Monthly Income*/}
                <div className="bg-emerald-50 rounded-xl p-4">

                    <p className="text-sm text-slate-500">
                        Income
                    </p>

                    <p className="text-1l font-bold text-emerald-600 mt-1">
                        ₦{income.toLocaleString()}
                    </p>
                </div>

                {/* Monthly Expenses */}
                <div className="bg-red-50 rounded-xl p-4">

                    <p className="text-sm text-slate-500">

                        Expenses
                    </p>

                    <p className="text-xl font-bold text-red-600 mt-1">
                        ₦{expenses.toLocaleString()}
                    </p>
                </div>

                {/* Monthly savings */}
                <div className="bg-purple-50 rounded-xl p-4">

                    <p className="text-xl font-bold text-purple-600 mt-1">
                        ₦{savings.toLocaleString()}
                    </p>
                </div>
            </div>
        </div>
    );

}


export default MonthlySummary;