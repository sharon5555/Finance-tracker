import { FaArrowTrendUp } from "react-icons/fa6";

function StatCard({title, amount, color}) {
    return(
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl 
        transition duration-300">
            <div className="flex justify-between items-center">
                <p className="text-slate-500 text-sm">
                    {title}
                </p>

                <FaArrowTrendUp className="text-emerald-500 text-xl" />

            </div>

            <h2 className={`text-3xl font-bold mt-2 ${color}`}>
                {amount}
            </h2>

            <p className="text-sm text-emerald-500 mt-2">
                +12% this month
            </p>
        </div>

        
    )
}

export default StatCard;