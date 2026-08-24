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
    onAddMoney
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
            <div className="flex items-center justify-between mb-3">

                <h3 className="text-lg font-bold text-slate-800">
                    {name}
                </h3>

                <span className="text-sm font-semibold text-emerald-600">
                    {Math.round(progress)}%
                </span>

            </div>


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

        </div>

    );

}


export default GoalCard;