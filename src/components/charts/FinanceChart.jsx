// Import the Bar Chart Components from react-chartsjs-2.
import { Bar } from "react-chartjs-2";

// import required chart.js features.
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";


// Register Chart.js features.
// Without this, the chart will not display.
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


function FinanceChart({ income, expenses }) {

    /* 
        Chart data:

        Labels:
        The names shown at the bottom.

        Datasets:
        The actual numbers displayed.
     */
    const data = {

        labels: [
            "Income",
            "Expenses"
        ],

        datasets: [
            
            {
                label: "Amount",

                data: [
                    income,
                    expenses
                ],

                backgroundColor: [
                    "#10B981",
                    "#EF4444"
                ],

                borderRadius: 10


            }

        ]
    };

    /* 
        Chart settings:

        Controls:
        -title
        -tooltip
        -legend.
     */
    const options = {

        responsive: true,

        plugins: {

            //Hide the default Chart.js legend.
            legend: {
                display: false
            }

        }
    };

    return (

        /*
            Finance chart card: 
            Create a clean dashboard-style container around the 
            income vs expenses chart.
        */

        <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-6">

            {/* Chart heading */}
            <div className="mb-5">

                <h2 className="text-xl font-bold text-slate-800">
                    Income vs Expenses
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                    Compare your income and spending.
                </p>

            </div>

            {/* Chart */}
            <Bar 
                data={data}
                options={options}
            />

        </div>
    );
}


export default FinanceChart;