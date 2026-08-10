import StatCard from "../common/StatCard";

function DashboardSummary({ stats }) {
    
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {stats.map((stat) => (
                <StatCard 
                    key={stat.title}
                    title={stat.title}
                    amount={stat.amount}
                    color={stat.color}
                />

            ))}
        </div>
    )
}

export default DashboardSummary;