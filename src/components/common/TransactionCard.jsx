function TransactionCard({ title, amount, type }) {
    return (
        <div className="flex justify-between items-center p-4 
        border rounded-lg mb-3">
            <div>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-gray-500">{type}</p>
            </div>

            <p className={`font-bold ${
                type === "Income" 
                ? "text-green-600" 
                : "text-red-600"
            }`}
            >
                {type === "Income" ? "+" : "-"}₦{amount.toLocaleString()}
            </p>
        </div>
    );
}

export default TransactionCard;