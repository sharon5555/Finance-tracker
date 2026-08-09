function TransactionCard({ title, amount, type }) {
    return (
        <div className="flex justify-between items-center p-4 
        border rounded-lg mb-3">
            <div>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-gray-500">{type}</p>
            </div>

            <p className="font-bold">
                ₦{amount.toLocalString()}
            </p>
        </div>
    );
}

export default TransactionCard;