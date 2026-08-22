// Import the pie chart from react-chartjs-2.
import { Pie } from "react-chartjs-2";


// Import Chart.js features needed for pie charts.
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";


//Register Pie chart features.
//Chart.js requires registration before displaying charts.
ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);


function ExpenseChart({ expenses }) {

    /*
        convert expense data into chart format.

        Example:

        [
            category: "Food",
            amount:30000
        ]
        
        becomes:

        Food:30000
     */

    const categories = expenses.reduce((result, transaction) => {

        //Get the transaction category.
        const category = transaction.category;

        // If this category already exists,
        // add the amount to it.
        if (result[category]) {

            result[category] += Number(transaction.amount);

        }

        return result;

    }, {});


    /*
        Prepare data for the pie chart.
     */
    const data = {

        labels: Object.keys(categories),

        datasets: [

            {
                label: "Expenses",

                data: Object.values(categories),

                borderWidth: 1
            }
        ]
    };


    return (

        /*
            Expense chart card: 

            Create a clean dashboard-style container for
            the expense category chart. 
        */

        <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-6">

            <div className="mb-5">

                <h2 className="text-xl font-bold mb-4 text-slate-800">
                    Expense Breakdown
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                    See where your money is being spent.
                </p>
                
            </div>

            {/* 
                Only display the pie chart when expense 
                transactions exist.
            */}

            {
                expenses.length > 0 ? (

                    <Pie data={data} />

                ) : (

                    /*
                        Empty state: 

                        Shows a friendly message when the user 
                        has not added an expense.
                    */

                    <div className="h-64 flex items-center justify-center">

                        <p className="text-slate-500 text-center">
                        No expense data yet.
                    </p>

                    </div>
                )
            }
        </div>
    );
}


export default ExpenseChart;