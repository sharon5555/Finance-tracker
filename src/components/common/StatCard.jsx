import { 
    FaWallet,
    FaArrowTrendUp,
    FaArrowTrendDown,
    FaPiggyBank
} from "react-icons/fa6";

// The StatCard receives three pieces of information from DashboardSummary:
// title  → the name of the financial statistic
// amount → the amount to display
// color  → the text color for the amount
function StatCard({title, amount, color}) {

    // Choose an icon based on the title of the card.
    // This allows one reusable component to display different icons.

    let Icon = FaWallet;

    if(title === "Total Income") {
        Icon = FaArrowTrendUp;
    }

    if(title === "Total Expenses") {
        Icon = FaArrowTrendDown;
    }

    if (title === "Savings") {
        Icon = FaPiggyBank;
    }

     // Display the financial statistic inside a reusable card.

    return(
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">

            {/* 
                Top section:
                Displays the title on the left
                and the appropriate icon on the right.
            */}

            <div className="flex justify-between items-center">

                <p className="text-slate-500 text-sm font-medium">

                    {title}
                </p>

                {/* 
                    Icon:
                    The icon changes depending on whether
                    the card represents income, expenses, savings,
                    or balance.
                */}

                <Icon className={`${color} text-xl`} />

            </div>

            {/* 
                Amount:
                Displays the actual financial value,
                such as ₦250,000.
            */}

            <h2 className={`text-3xl font-bold mt-3 ${color}`}>

                {amount}
            </h2>

            {/* 
                Supporting text:
                This is temporary information for our UI.
                Later, we can make this percentage dynamic.
            */}

            <p className="text-sm text-slate-400 mt-2">
                Updated this month
            </p>
        </div>

        
    )
}

export default StatCard;