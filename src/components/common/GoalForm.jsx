import {  useEffect, useState } from "react";


/*
    GoalForm allows the user to create
    a new financial goal.

    The form collects:
    - Goal name
    - Target amount
    - Starting amount

    GoalForm can now handle both creating
    and editing financial goals.
*/
function GoalForm({

    onAddGoal,
    editingGoal,
    onFinishEditing
}) {



    // Store the name of the goal.
    const [name, setName] = useState("");

    // Store the target amount.
    const [targetAmount, setTargetAmount] = useState("");

    // Store the amount already saved.
    const [currentAmount, setCurrentAmount] = useState("");

    /*
        When the user clicks Edit, load the selected
        goal's current information into the form.
    */
    useEffect(() => {

        // If no goal is selected for editing, do nothing.
        if (!editingGoal) {
            return;
        }

        // Fill the inputs with the existing goal information.
        setName(editingGoal.name);
        setTargetAmount(String(editingGoal.targetAmount));
        setCurrentAmount(String(editingGoal.currentAmount));

    }, [editingGoal]);


    /*
        This function runs when
        the user submits the form.
    */
    function handleSubmit(event) {

        // Prevent the browser from refreshing.
        event.preventDefault();


        // Make sure the user entered a goal name.
        if (name.trim() === "") {

            alert("Please enter a goal name.");

            return;
        }


        // Make sure the target amount is valid.
        if (
            targetAmount === "" ||
            Number(targetAmount) <= 0
        ) {

            alert("Please enter a valid target amount.");

            return;
        }


        // Convert the starting amount to a number.
        const startingAmount =
            currentAmount === ""
                ? 0
                : Number(currentAmount);


        // Make sure the starting amount is not negative.
        if (startingAmount < 0) {

            alert("Starting amount cannot be negative.");

            return;
        }


        // Make sure the starting amount
        // does not exceed the target.
        if (startingAmount > Number(targetAmount)) {

            alert(
                "Starting amount cannot be greater than the target."
            );

            return;
        }


        /*
            Create the goal information.

            When editing:
            Keep the existing ID.

            When creating:
            Generate a new ID.
        */
        const newGoal = {

            id: editingGoal
                ? editingGoal.id
                : Date.now(),

            name: name.trim(),

            targetAmount: Number(targetAmount),

            currentAmount: startingAmount

        };


        // Send the goal to Hero.jsx.
        onAddGoal(newGoal);

        // If we were editing a goal, leave edit mode after saving.
        if (editingGoal) {
            onFinishEditing();
        }


        // Clear the form after saving.
        setName("");

        setTargetAmount("");

        setCurrentAmount("");

    }


    return (

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

            {/* Form heading */}
            <div className="mb-6">

                <h2 className="text-xl font-bold text-slate-800">
                    {editingGoal
                        ? "Edit Financial Goal"
                        : "Create Financial Goal"}
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                    Set a target and start working toward it.
                </p>

            </div>


            <form onSubmit={handleSubmit}>


                {/* Goal name */}
                <div className="mb-4">

                    <label className="block mb-2 font-medium text-slate-700">
                        Goal Name
                    </label>

                    <input
                        type="text"
                        placeholder="e.g. Emergency Fund"
                        value={name}
                        onChange={(event) =>
                            setName(event.target.value)
                        }
                        className="w-full border rounded-lg px-4 py-2"
                    />

                </div>


                {/* Target amount */}
                <div className="mb-4">

                    <label className="block mb-2 font-medium text-slate-700">
                        Target Amount
                    </label>

                    <input
                        type="number"
                        placeholder="e.g. 500000"
                        value={targetAmount}
                        onChange={(event) =>
                            setTargetAmount(event.target.value)
                        }
                        className="w-full border rounded-lg px-4 py-2"
                    />

                </div>


                {/* Current amount */}
                <div className="mb-6">

                    <label className="block mb-2 font-medium text-slate-700">
                        Amount Already Saved
                    </label>

                    <input
                        type="number"
                        placeholder="e.g. 100000"
                        value={currentAmount}
                        onChange={(event) =>
                            setCurrentAmount(event.target.value)
                        }
                        className="w-full border rounded-lg px-4 py-2"
                    />

                </div>


                {/* Submit button */}
                <button
                    type="submit"
                    className="w-full bg-emerald-600 text-white py-3 rounded-lg
                    font-semibold hover:bg-emerald-700"
                >
                    {editingGoal
                        ? "Update Goal"
                        : "Create Goal"}
                </button>

            </form>

        </div>

    );

}


export default GoalForm;