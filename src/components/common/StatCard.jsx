function StatCard({title, amount, color}) {
    return(
        <div className="bg-white rounded-2xl shadow-lg p-6 w-56">
            <p className="text-slate-500 text-sm">
                {title}
            </p>

            <h2 className="{`text-3xl font-bold mt-2 ${color}`}">
                {amount}
            </h2>
        </div>
    )
}

export default StatCard;