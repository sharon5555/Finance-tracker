
import React from "react";

function GoalsPerformanceDashboard({ goals = [] }) {

    // Format amounts as Nigerian Naira.
    const formatCurrency = (amount) =>
        `₦${Number(amount).toLocaleString("en-NG")}`;

    // Read the target amount for each goal.
    const getTargetAmount = (goal) =>
        Number(goal.targetAmount ?? goal.target ?? 0) || 0;

    // Read the amount already saved for each goal.
    const getSavedAmount = (goal) =>
        Number(
            goal.currentAmount ??
            goal.savedAmount ??
            goal.currentSaved ??
            0
        ) || 0;

    // Calculate the overall savings statistics.
    const totalGoals = goals.length;

    const totalTarget = goals.reduce(
        (total, goal) => total + getTargetAmount(goal),
        0
    );

    const totalSaved = goals.reduce(
        (total, goal) => total + getSavedAmount(goal),
        0
    );

    // Calculate overall progress.
    const overallProgress = totalTarget > 0
        ? Math.min((totalSaved / totalTarget) * 100, 100)
        : 0;

    // Count completed goals.
    const completedGoals = goals.filter(
        (goal) =>
            getTargetAmount(goal) > 0 &&
            getSavedAmount(goal) >= getTargetAmount(goal)
    ).length;

    // Count goals that are not yet completed.
    const activeGoals = totalGoals - completedGoals;

    // Calculate the remaining amount needed.
    const remainingAmount = Math.max(
        totalTarget - totalSaved,
        0
    );

    return (
        <section className="w-full rounded-2xl bg-white p-5 sm:p-6 shadow-sm border border-gray-100">

            {/* Dashboard heading */}
            <div className="mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                    Goals Performance Dashboard
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                    Track your savings goals and see how far you've come.
                </p>
            </div>

            {totalGoals === 0 ? (
                /* Display an empty state when there are no goals. */
                <div className="rounded-xl bg-purple-50 border border-purple-100 p-6 text-center">
                    <h3 className="font-semibold text-gray-800">
                        No savings goals yet.
                    </h3>

                    <p className="text-sm text-gray-600 mt-2">
                        Create your first savings goal to start tracking
                        your financial progress.
                    </p>
                </div>
            ) : (
                <>
                    {/* Summary cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                        {/* Total goals */}
                        <div className="rounded-xl bg-purple-50 p-4">
                            <p className="text-sm text-gray-500">
                                Total Goals
                            </p>

                            <h3 className="text-2xl font-bold text-purple-700 mt-2">
                                {totalGoals}
                            </h3>
                        </div>

                        {/* Total savings */}
                        <div className="rounded-xl bg-green-50 p-4">
                            <p className="text-sm text-gray-500">
                                Total Saved
                            </p>

                            <h3 className="text-xl font-bold text-green-700 mt-2">
                                {formatCurrency(totalSaved)}
                            </h3>
                        </div>

                        {/* Total target */}
                        <div className="rounded-xl bg-blue-50 p-4">
                            <p className="text-sm text-gray-500">
                                Total Target
                            </p>

                            <h3 className="text-xl font-bold text-blue-700 mt-2">
                                {formatCurrency(totalTarget)}
                            </h3>
                        </div>

                        {/* Remaining savings */}
                        <div className="rounded-xl bg-orange-50 p-4">
                            <p className="text-sm text-gray-500">
                                Remaining Amount
                            </p>

                            <h3 className="text-xl font-bold text-orange-700 mt-2">
                                {formatCurrency(remainingAmount)}
                            </h3>
                        </div>
                    </div>

                    {/* Overall savings progress */}
                    <div className="mt-6 rounded-xl bg-gray-50 p-5">

                        <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                            <h3 className="font-semibold text-gray-800">
                                Overall Savings Progress
                            </h3>

                            <span className="font-bold text-purple-700">
                                {overallProgress.toFixed(1)}%
                            </span>
                        </div>

                        <div className="h-4 w-full rounded-full bg-gray-200 overflow-hidden">
                            <div
                                className="h-full rounded-full bg-purple-600 transition-all duration-500"
                                style={{
                                    width: `${overallProgress}%`
                                }}
                            />
                        </div>

                        <p className="text-sm text-gray-500 mt-3">
                            {formatCurrency(totalSaved)} saved out of{" "}
                            {formatCurrency(totalTarget)}.
                        </p>
                    </div>

                    {/* Completed and active goals summary */}
                    <div className="grid grid-cols-2 gap-4 mt-6">

                        <div className="rounded-xl border border-green-100 p-4">
                            <p className="text-sm text-gray-500">
                                Completed Goals
                            </p>

                            <h3 className="text-2xl font-bold text-green-600 mt-2">
                                {completedGoals}
                            </h3>
                        </div>

                        <div className="rounded-xl border border-blue-100 p-4">
                            <p className="text-sm text-gray-500">
                                Active Goals
                            </p>

                            <h3 className="text-2xl font-bold text-blue-600 mt-2">
                                {activeGoals}
                            </h3>
                        </div>
                    </div>

                    {/* Individual savings goal performance */}
                    <div className="mt-7">
                        <h3 className="font-bold text-gray-800 mb-4">
                            Individual Goal Progress
                        </h3>

                        <div className="space-y-4">

                            {goals.map((goal, index) => {

                                // Get the current goal's amounts.
                                const targetAmount = getTargetAmount(goal);
                                const savedAmount = getSavedAmount(goal);

                                // Calculate this goal's progress.
                                const progress = targetAmount > 0
                                    ? Math.min(
                                        (savedAmount / targetAmount) * 100,
                                        100
                                    )
                                    : 0;

                                // Determine whether the goal is completed.
                                const isCompleted =
                                    targetAmount > 0 &&
                                    savedAmount >= targetAmount;

                                return (
                                    <div
                                        key={goal.id ?? index}
                                        className="rounded-xl border border-gray-100 p-4"
                                    >

                                        {/* Goal title and status */}
                                        <div className="flex flex-wrap justify-between items-center gap-2">

                                            <h4 className="font-semibold text-gray-800">
                                                {goal.title || goal.name || "Savings Goal"}
                                            </h4>

                                            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                                                isCompleted
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-blue-100 text-blue-700"
                                            }`}>
                                                {isCompleted ? "Completed" : "In Progress"}
                                            </span>
                                        </div>

                                        {/* Goal savings progress */}
                                        <div className="flex justify-between text-sm mt-4 mb-2">
                                            <span className="text-gray-500">
                                                {formatCurrency(savedAmount)}
                                            </span>

                                            <span className="font-semibold text-gray-700">
                                                {progress.toFixed(1)}%
                                            </span>
                                        </div>

                                        <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${
                                                    isCompleted
                                                        ? "bg-green-500"
                                                        : "bg-purple-500"
                                                }`}
                                                style={{
                                                    width: `${progress}%`
                                                }}
                                            />
                                        </div>

                                        <p className="text-xs text-gray-500 mt-2">
                                            Target: {formatCurrency(targetAmount)}
                                        </p>
                                    </div>
                                );
                            })}

                        </div>
                    </div>
                </>
            )}
        </section>
    );
}

export default GoalsPerformanceDashboard;
