
import React from "react";

// =========================================
// SMART SAVINGS GOAL INSIGHTS
// =========================================

// Display currency in Nigerian Naira.
const formatCurrency = (amount) => {
    return `₦${Number(amount).toLocaleString("en-NG", {
        maximumFractionDigits: 2,
    })}`;
};

// Convert a date into a local date without timezone shifting.
const parseLocalDate = (dateValue) => {
    if (!dateValue) return null;

    // Handle an existing JavaScript Date object.
    if (dateValue instanceof Date) {
        if (Number.isNaN(dateValue.getTime())) return null;

        return new Date(
            dateValue.getFullYear(),
            dateValue.getMonth(),
            dateValue.getDate()
        );
    }

    const dateString = String(dateValue).trim();

    // Handle YYYY-MM-DD and ISO date strings.
    const isoMatch = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);

    if (isoMatch) {
        const [, year, month, day] = isoMatch;
        const date = new Date(Number(year), Number(month) - 1, Number(day));

        // Reject invalid calendar dates.
        if (
            date.getFullYear() !== Number(year) ||
            date.getMonth() !== Number(month) - 1 ||
            date.getDate() !== Number(day)
        ) {
            return null;
        }

        return date;
    }

    // Handle DD/MM/YYYY date strings.
    const localMatch = dateString.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

    if (localMatch) {
        const [, day, month, year] = localMatch;
        const date = new Date(Number(year), Number(month) - 1, Number(day));

        if (
            date.getFullYear() !== Number(year) ||
            date.getMonth() !== Number(month) - 1 ||
            date.getDate() !== Number(day)
        ) {
            return null;
        }

        return date;
    }

    // Try the browser's date parser for other supported formats.
    const parsed = new Date(dateString);

    if (Number.isNaN(parsed.getTime())) return null;

    return new Date(
        parsed.getFullYear(),
        parsed.getMonth(),
        parsed.getDate()
    );
};

// Prepare and validate the savings goal information.
const getGoalDetails = (goal) => {
    const target = Number(goal.targetAmount ?? goal.target ?? 0);

    const saved = Number(
        goal.currentAmount ??
        goal.savedAmount ??
        goal.currentSaved ??
        0
    );

    const safeTarget = Number.isFinite(target) && target > 0 ? target : 0;
    const safeSaved = Number.isFinite(saved) && saved >= 0 ? saved : 0;

    const remaining = Math.max(safeTarget - safeSaved, 0);

    const progress =
        safeTarget > 0
            ? Math.min((safeSaved / safeTarget) * 100, 100)
            : 0;

    const isCompleted =
        goal.completed === true ||
        goal.isCompleted === true ||
        String(goal.status || "").toLowerCase() === "completed" ||
        (safeTarget > 0 && safeSaved >= safeTarget);

    return {
        name: goal.name || goal.title || "Unnamed savings goal",
        target: safeTarget,
        saved: safeSaved,
        remaining,
        progress,
        isCompleted,
        deadline: parseLocalDate(goal.targetDate),
    };
};

// Display an individual goal insight.
const InsightCard = ({ goal, message, color }) => {
    const progressColor =
        color === "red"
            ? "bg-red-500"
            : color === "yellow"
            ? "bg-yellow-500"
            : color === "green"
            ? "bg-green-500"
            : "bg-purple-500";

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            {/* Goal name and insight message. */}
            <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                    <h4 className="font-semibold text-gray-800">
                        {goal.name}
                    </h4>

                    <p className="mt-1 text-sm text-gray-500">
                        {message}
                    </p>
                </div>

                <span className="text-sm font-bold text-gray-700">
                    {goal.progress.toFixed(0)}%
                </span>
            </div>

            {/* Show how much of the goal has been saved. */}
            <div className="mb-3 h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                    className={`h-full rounded-full ${progressColor}`}
                    style={{ width: `${goal.progress}%` }}
                />
            </div>

            {/* Display the saved and remaining amounts. */}
            <div className="flex flex-wrap justify-between gap-2 text-sm">
                <span className="text-gray-500">
                    Saved: {formatCurrency(goal.saved)}
                </span>

                <span className="font-medium text-gray-700">
                    Remaining: {formatCurrency(goal.remaining)}
                </span>
            </div>

            {/* Show the deadline when one is available. */}
            {goal.deadline && (
                <p className="mt-2 text-xs text-gray-500">
                    Deadline:{" "}
                    {goal.deadline.toLocaleDateString("en-NG", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                    })}
                </p>
            )}
        </div>
    );
};

const SmartSavingsInsights = ({ goals = [] }) => {
    // Use today's local date for deadline comparisons.
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate the date 30 days from today.
    const next30Days = new Date(today);
    next30Days.setDate(next30Days.getDate() + 30);

    // Prepare valid goal information.
    const goalDetails = Array.isArray(goals)
        ? goals.map((goal) => ({
              ...getGoalDetails(goal),
              originalGoal: goal,
          }))
        : [];

    // Identify goals whose deadlines have passed.
    const overdueGoals = goalDetails.filter(
        (goal) =>
            !goal.isCompleted &&
            goal.deadline &&
            goal.deadline < today
    );

    // Identify goals with deadlines within the next 30 days.
    const upcomingGoals = goalDetails.filter(
        (goal) =>
            !goal.isCompleted &&
            goal.deadline &&
            goal.deadline >= today &&
            goal.deadline <= next30Days
    );

    // Identify active goals that have reached at least 80% progress.
    const almostCompletedGoals = goalDetails.filter(
        (goal) =>
            !goal.isCompleted &&
            goal.target > 0 &&
            goal.progress >= 80
    );

    // Identify completed savings goals.
    const completedGoals = goalDetails.filter(
        (goal) => goal.isCompleted
    );

    // Prepare monthly savings recommendations for active goals.
    const monthlyRecommendations = goalDetails
        .filter(
            (goal) =>
                !goal.isCompleted &&
                goal.remaining > 0 &&
                goal.target > 0 &&
                goal.deadline &&
                goal.deadline >= today
        )
        .map((goal) => {
            // Calculate the number of calendar months remaining.
            const monthDifference =
                (goal.deadline.getFullYear() - today.getFullYear()) * 12 +
                (goal.deadline.getMonth() - today.getMonth());

            // Use at least one month for goals due this month.
            const monthsRemaining = Math.max(monthDifference, 1);

            // Add a small practical rounding allowance.
            const monthlyAmount = Math.ceil(
                (goal.remaining / monthsRemaining) / 1000
            ) * 1000;

            return {
                ...goal,
                monthsRemaining,
                monthlyAmount,
            };
        });

    // Show an empty state when the user has no savings goals.
    if (goalDetails.length === 0) {
        return (
            <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-800">
                    Smart Savings Insights
                </h2>

                <p className="mt-3 text-sm text-gray-500">
                    You haven't created any savings goals yet.
                    Create your first goal to start receiving
                    personalised savings insights.
                </p>
            </section>
        );
    }

    return (
        <section className="mt-6 space-y-6">
            {/* Section heading. */}
            <div>
                <h2 className="text-xl font-bold text-gray-800">
                    Smart Savings Insights
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Helpful insights to keep your savings goals on track.
                </p>
            </div>

            {/* Overdue savings goals. */}
            {overdueGoals.length > 0 && (
                <div className="space-y-3">
                    <h3 className="font-semibold text-red-600">
                        Overdue Goals ({overdueGoals.length})
                    </h3>

                    {overdueGoals.map((goal, index) => (
                        <InsightCard
                            key={`${goal.name}-overdue-${index}`}
                            goal={goal}
                            message="This goal has passed its target date. Review your savings plan."
                            color="red"
                        />
                    ))}
                </div>
            )}

            {/* Goals with deadlines approaching within 30 days. */}
            {upcomingGoals.length > 0 && (
                <div className="space-y-3">
                    <h3 className="font-semibold text-yellow-600">
                        Upcoming Deadlines ({upcomingGoals.length})
                    </h3>

                    {upcomingGoals.map((goal, index) => (
                        <InsightCard
                            key={`${goal.name}-upcoming-${index}`}
                            goal={goal}
                            message="Your deadline is within the next 30 days. Keep making progress."
                            color="yellow"
                        />
                    ))}
                </div>
            )}

            {/* Goals that are almost completed. */}
            {almostCompletedGoals.length > 0 && (
                <div className="space-y-3">
                    <h3 className="font-semibold text-green-600">
                        Almost There ({almostCompletedGoals.length})
                    </h3>

                    {almostCompletedGoals.map((goal, index) => (
                        <InsightCard
                            key={`${goal.name}-almost-${index}`}
                            goal={goal}
                            message="Great progress! You have saved at least 80% of your target."
                            color="green"
                        />
                    ))}
                </div>
            )}

            {/* Monthly savings recommendations. */}
            {monthlyRecommendations.length > 0 && (
                <div className="space-y-3">
                    <h3 className="font-semibold text-purple-700">
                        Monthly Savings Recommendations
                    </h3>

                    {monthlyRecommendations.map((goal, index) => (
                        <div
                            key={`${goal.name}-recommendation-${index}`}
                            className="rounded-xl border border-purple-100 bg-purple-50 p-4"
                        >
                            <h4 className="font-semibold text-gray-800">
                                {goal.name}
                            </h4>

                            <p className="mt-2 text-sm text-gray-600">
                                Save approximately{" "}
                                <strong className="text-purple-700">
                                    {formatCurrency(goal.monthlyAmount)}
                                </strong>{" "}
                                per month to reach your target.
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                                {goal.monthsRemaining} calendar month(s)
                                remaining.
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Completed savings goals. */}
            {completedGoals.length > 0 && (
                <div className="space-y-3">
                    <h3 className="font-semibold text-green-700">
                        Completed Goals ({completedGoals.length})
                    </h3>

                    {completedGoals.map((goal, index) => (
                        <InsightCard
                            key={`${goal.name}-completed-${index}`}
                            goal={goal}
                            message="Congratulations! You have reached this savings target."
                            color="green"
                        />
                    ))}
                </div>
            )}

            {/* Encouraging message when there are no active insights. */}
            {overdueGoals.length === 0 &&
                upcomingGoals.length === 0 &&
                almostCompletedGoals.length === 0 &&
                monthlyRecommendations.length === 0 &&
                completedGoals.length === 0 && (
                    <div className="rounded-xl border border-gray-200 bg-white p-5 text-center">
                        <p className="font-medium text-gray-700">
                            Your savings journey is underway!
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                            Keep updating your savings goals to receive
                            useful insights here.
                        </p>
                    </div>
                )}
        </section>
    );
};

export default SmartSavingsInsights;
