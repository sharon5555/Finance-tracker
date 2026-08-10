// Import icons for income and expense transactions.
import { FiArrowDownLeft, FiArrowUpRight } from "react-icons/fi";


function TransactionCard({ title, amount, type, category, date }) {

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