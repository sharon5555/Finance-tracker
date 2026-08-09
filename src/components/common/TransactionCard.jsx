function TransactionCard({ title, amount, type, category, date }) {
    const isIncome = type === "Income";

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-slate-800">
                        {title}
                    </h3>

                    <p className="text-sm text-slate-500">
                        {category}
                    </p>

                    <p className="text-xs text-slate-400 mt-1">
                        {date}
                    </p>
                </div>

                <div className="text-right">
                    <p className={`font-bold ${
                        isIncome 
                        ? "text-emerald-600" 
                        : "text-red-600"
                    }`}>
                        {isIncome ? "+" : "-"}₦{amount.toLocaleString()}
                    </p>

                    <p className="text-xs text-slate-500">
                        {type}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default TransactionCard;