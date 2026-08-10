// Import icons for income and expense transactions.
import { 
    FiArrowDownLeft, 
    FiArrowUpRight,
    FiTrash2,
    FiEdit3
} from "react-icons/fi";


// Receive the transaction details and the delete function from Hero.jsx.
function TransactionCard({ 
    title, 
    amount, 
    type, 
    category, 
    date ,
    onEdit,
    onDelete
}) {

    // Check whether this transaction is an income.
    // This value will help us choose the correct icon and colors.
    const isIncome = type === "Income";


    // Income uses a downward-left arrow because money is coming into
    // the user's account. Expenses use an upward-right arrow because
    // money is leaving the user's account.
    const Icon = isIncome ? FiArrowDownLeft : FiArrowUpRight;


    // Convert the amount into a number so that toLocaleString()
    // always formats it correctly.
    const formattedAmount = Number(amount).toLocaleString();


    return (
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-4
                        hover:shadow-md transition-shadow duration-200">

            {/* 
                Main transaction row:
                The left side contains the icon and transaction information.
                The right side contains the amount and transaction type.
            */}
            <div className="flex items-center justify-between gap-4">


                {/* 
                    Left section:
                    Contains the transaction icon and details.
                */}
                <div className="flex items-center gap-4">

                    {/* 
                        Transaction icon:
                        Income and Expense transactions get different
                        background colors.
                    */}
                    <div
                        className={`w-11 h-11 rounded-full flex items-center justify-center ${
                            isIncome
                                ? "bg-emerald-100 text-emerald-600"
                                : "bg-red-100 text-red-600"
                        }`}
                    >
                        <Icon size={21} />
                    </div>


                    {/* 
                        Transaction information:
                        Displays the title, category, and date.
                    */}
                    <div>

                        {/* Transaction title */}
                        <h3 className="font-semibold text-slate-800">
                            {title}
                        </h3>


                        {/* Transaction category */}
                        <p className="text-sm text-slate-500 mt-1">
                            {category}
                        </p>


                        {/* Transaction date */}
                        <p className="text-xs text-slate-400 mt-1">
                            {date}
                        </p>

                    </div>

                </div>


                {/* 
                    Right section:
                    Displays the transaction amount and whether
                    the transaction is Income or Expense.
                */}
                <div className="text-right">

                    {/* 
                        Action buttons:
                        This container keeps the Edit and Delete buttons together
                        and adds space between them.
                    */}
                    <div className="flex justify-end gap-4 mb-2">

                        {/* Edit transaction button */}
                        <button
                            // Call the edit function when the user clicks this button.
                            onClick={onEdit}

                            // Show a small message when the mouse is over the button.
                            title="Edit transaction"

                            // Give the edit button a blue hover effect.
                            className="text-slate-400 hover:text-blue-600"
                        >
                            <FiEdit3 size={17} />
                        </button>


                        {/* Delete transaction button */}
                        <button
                            // Call the delete function when the user clicks this button.
                            onClick={onDelete}

                            // Show a small message when the mouse is over the button.
                            title="Delete transaction"

                            // Give the delete button a red hover effect.
                            className="text-slate-400 hover:text-red-600"
                        >
                            <FiTrash2 size={17} />
                        </button>

                    </div>

                    {/* 
                        Amount:
                        Income gets a "+" sign and green color.
                        Expense gets a "-" sign and red color.
                    */}
                    <p
                        className={`font-bold text-lg ${
                            isIncome
                                ? "text-emerald-600"
                                : "text-red-600"
                        }`}
                    >
                        {isIncome ? "+" : "-"}₦{formattedAmount}
                    </p>


                    {/* Transaction type */}
                    <p className="text-xs text-slate-500 mt-1">
                        {type}
                    </p>

                </div>

            </div>

        </div>
    );
}


export default TransactionCard;