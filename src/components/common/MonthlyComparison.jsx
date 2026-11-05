import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler
} from "chart.js";

import { Line } from "react-chartjs-2";

// Register the Chart.js features used by this component.
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler
);

function MonthlyComparison({ transactions = [] }) {

    // =========================================
    // PREPARE THE LAST SIX MONTHS
    // =========================================

    const today = new Date();

    const months = Array.from({ length: 6 }, (_, index) => {
        const date = new Date(
            today.getFullYear(),
            today.getMonth() - (5 - index),
            1
        );

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");

        return {
            key: `${year}-${month}`,
            label: date.toLocaleDateString("en-GB", {
                month: "short",
                year: "2-digit"
            }),
            income: 0,
            expenses: 0
        };
    });

    // =========================================
    // CALCULATE MONTHLY INCOME AND EXPENSES
    // =========================================

    transactions.forEach((transaction) => {

        // Ignore transactions without a valid date.
        if (!transaction.date) return;

        // Get the transaction's year and month.
        const transactionMonth = String(
            transaction.date
        ).slice(0, 7);

        // Find the matching month in our six-month period.
        const monthData = months.find(
            (month) => month.key === transactionMonth
        );

        // Ignore transactions outside the selected period.
        if (!monthData) return;

        const amount = Number(transaction.amount) || 0;
        
        // Normalise transaction type to handle variations safely
        const type = transaction.type ? String(transaction.type).trim().toLowerCase() : "";

        if (type === "income") {
            monthData.income += amount;
        }

        if (type === "expense") {
            monthData.expenses += amount;
        }
    });

    // =========================================
    // PREPARE CHART DATA
    // =========================================

    const chartData = {
        labels: months.map((month) => month.label),

        datasets: [
            {
                label: "Income",
                data: months.map((month) => month.income),
                borderColor: "#16A34A",
                backgroundColor: "rgba(22, 163, 74, 0.10)",
                pointBackgroundColor: "#16A34A",
                pointRadius: 5,
                pointHoverRadius: 7,
                tension: 0.4,
                fill: true
            },
            {
                label: "Expenses",
                data: months.map((month) => month.expenses),
                borderColor: "#EF4444",
                backgroundColor: "rgba(239, 68, 68, 0.08)",
                pointBackgroundColor: "#EF4444",
                pointRadius: 5,
                pointHoverRadius: 7,
                tension: 0.4,
                fill: true
            }
        ]
    };

    // =========================================
    // CHART DISPLAY OPTIONS
    // =========================================

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
            legend: {
                position: "top",
                labels: {
                    usePointStyle: true,
                    padding: 20
                }
            },

            tooltip: {
                callbacks: {
                    label: (context) => {
                        return `${context.dataset.label}: ₦${Number(
                            context.raw
                        ).toLocaleString("en-NG")}`;
                    }
                }
            }
        },

        scales: {
            y: {
                beginAtZero: true,

                ticks: {
                    callback: (value) => {
                        if (value >= 1_000_000) {
                            return `₦${(value / 1_000_000).toFixed(1)}m`;
                        }
                        if (value >= 1_000) {
                            return `₦${(value / 1_000).toFixed(0)}k`;
                        }
                        return `₦${value}`;
                    }
                }
            }
        }
    };

    // =========================================
    // DISPLAY MONTHLY COMPARISON
    // =========================================

    return (
        <section className="w-full rounded-2xl bg-white p-5
        sm:p-6 shadow-sm border border-gray-100">

            {/* Chart Heading */}
            <div className="mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                    Monthly Financial Comparison
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                    Compare your income and expenses over the last six months.
                </p>
            </div>

            {/* Line Chart */}
            <div className="relative h-72 sm:h-80 w-full">
                <Line
                    data={chartData}
                    options={chartOptions}
                />
            </div>

        </section>
    );
}

export default MonthlyComparison;