import { useState } from "react";


/*
    GoalCard displays the progress of one financial goal.

    It also allows the user to add money
    toward the goal.
*/
function GoalCard({
    name,
    targetAmount,
    currentAmount,
    targetDate,
    priority,
    onAddMoney,
    onDelete,
    onEdit
}) {

    // Store the amount the user wants to add.
    const [amountToAdd, setAmountToAdd] = useState("");




    /*
        Calculate the percentage of the goal
        that has already been completed.
    */
    const progress = Math.min(
        (currentAmount / targetAmount) * 100,
        100
    );


    /*
        Determine the current status of the goal.

        100% or more  → Completed
        75% - 99%     → Almost There
        Below 75%     → On Track
    */
    let goalStatus;

    if(progress >= 100) {
        goalStatus = "Completed";
    } else if (progress >= 75) {
        goalStatus ="Almost There";
    } else {
        goalStatus = "On Track";
    }

    /*
        Choose the color of the priority badge based on the 
        selected priority.
    */
    let priorityStyle;

    if(priority === "High") {
        priorityStyle = "bg-red-100 text-red-700";
    } else if (priority === "Low") {
        priorityStyle = "bg-emerald-100 text-emerald-700";
    } else {
        priorityStyle = "bg-amber-100 text-amber-700";
    }

    /*
        calculate how many days are left before the 
        financial goal deadline.
    */
    let daysRemaining = null;

    if (targetDate) {

        // convert the target date into a JavaScript Date.
        const deadline = new Date(targetDate);

        //Get today'sdate.
        const today = new Date();

        //Remove the time portion so we compare dates only.
        today.setHours(0, 0, 0, 0);
        deadline.setHours(0, 0, 0, 0);

        //calculate the difference in milliseconds.
        const difference = deadline - today;

        // convert milliseconds into days.
        daysRemaining = Math.ceil(
            difference / (1000 * 60 * 60 * 24)
        );
    }

    /*
        create a friendly message based on the number of days
        remaining.
    */
    let deadlineMessage = "";

    if(progress >= 100) {

        // the goal has already been completed.
        deadlineMessage = "Goal completed";

    } else if (daysRemaining === null) {

        //No deadline was provided.
        deadlineMessage = "No deadline set";

    } else if (daysRemaining < 0) {

        // The deadline has passed.
        deadlineMessage = "Overdue";

    } else if (daysRemaining === 0) {

        // The deadline is today.
        deadlineMessage = "Due today";

    } else if(daysRemaining === 1) {

        //Exactly one day remains.
        deadlineMessage = "1 day remaining";

    } else {

        // More than one day remains.
        deadlineMessage = `${daysRemaining} days remaining`;
    }



    /*
        Calculate how much money is still needed
        to reach the target.
    */
    const remainingAmount = Math.max(
        targetAmount - currentAmount,
        0
    );


    /*
        Handle the Add Money form.
    */
    function handleAddMoney(event) {

        // Prevent the page from refreshing.
        event.preventDefault();


        // Convert the input into a number.
        const amount = Number(amountToAdd);


        // Check that the amount is valid.
        if (amount <= 0) {

            alert("Please enter a valid amount.");

            return;
        }


        // Do not allow the user to add
        // more than the remaining amount.
        if (amount > remainingAmount) {

            alert(
                `You only need ₦${remainingAmount.toLocaleString()} to complete this goal.`
            );

            return;
        }


        // Send the amount to Hero.jsx.
        onAddMoney(amount);


        // Clear the input.
        setAmountToAdd("");

    }


    return (

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

            {/* Goal heading */}
            <div className="flex items-center justify-between gap-4">


                {/* Goal name */}
                <h3 className="text-xl font-bold text-slate-800">
                    {name}
                </h3>

                {/* Status and priority badges */}
                <div className="flex items-center gap-2">

                    {/* Goal status */}
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        goalStatus === "Completed"
                            ? "bg-emerald-100 text-emerald-700"
                            : goalStatus === "Almost There"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-blue-100 text-blue-700"
                    }`}
                >
                    {goalStatus}
                </span>

                {/* Goal priority */}
                <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${priorityStyle}`}
                >
                    {priority || "Medium"}
                </span>
                </div>

            </div>


            {/*
                Display the goal deadline.
            */}
            {targetDate && (
                <div className="mt-2">

                    {/* Display the target date */}
                    <p className="text-sm text-slate-500">
                        Target date:{" "}
                        <span className="font-medium text-slate-700">
                            {new Date(targetDate).toLocaleDateString()}
                        </span>
                    </p>

                    {/* Display the remaining time */}
                    <p
                        className={`text-sm font-semibold mt-1 ${
                            progress >= 100
                                ? "text-emerald-600"
                                : daysRemaining < 0
                                ? "text-red-600"
                                : daysRemaining <= 7
                                ? "text-amber-600"
                                : "text-slate-500"
                        }`}
                    >
                        {deadlineMessage}
                    </p>

                </div>
            )}


            {/* Amount information */}
            <div className="flex justify-between text-sm mb-2">

                <span className="text-slate-500">
                    ₦{currentAmount.toLocaleString()}
                </span>

                <span className="text-slate-500">
                    Target: ₦{targetAmount.toLocaleString()}
                </span>

            </div>


            {/* Progress bar */}
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">

                <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                />

            </div>


            {/* Remaining amount */}
            <p className="text-sm text-slate-500 mt-3 mb-4">

                {remainingAmount > 0
                    ? `₦${remainingAmount.toLocaleString()} remaining`
                    : "Goal completed 🎉"
                }

            </p>


            {/* 
                Only show Add Money when
                the goal is not completed.
            */}
            {remainingAmount > 0 && (

                <form
                    onSubmit={handleAddMoney}
                    className="flex gap-2"
                >

                    {/* Amount input */}
                    <input
                        type="number"
                        placeholder="Amount"
                        value={amountToAdd}
                        onChange={(event) =>
                            setAmountToAdd(event.target.value)
                        }
                        className="flex-1 border rounded-lg px-3 py-2"
                    />


                    {/* Add money button */}
                    <button
                        type="submit"
                        className="bg-emerald-600 text-white px-4 py-2
                        rounded-lg font-semibold hover:bg-emerald-700"
                    >
                        Add
                    </button>

                </form>

            )}


            {/*
                Goal action buttons:

                Edit allows the user to change the goal.
                Delete removes the goal.
            */}
            <div className="flex gap-3 mt-3">

                {/* Edit Goal button */}
                <button
                    type="button"
                    onClick={onEdit}
                    className="flex-1 border border-blue-200 text-blue-600
                    py-2 rounded-lg font-semibold hover:bg-blue-50"
                >
                    Edit
                </button>


                {/* Delete Goal button */}
                <button
                    type="button"
                    onClick={onDelete}
                    className="flex-1 border border-red-200 text-red-600
                    py-2 rounded-lg font-semibold hover:bg-red-50"
                >
                    Delete
                </button>

            </div>

        </div>

    );

}


export default GoalCard;