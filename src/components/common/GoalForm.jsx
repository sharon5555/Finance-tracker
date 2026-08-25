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
        Store the deadline for the financial goal.
    */
    const [targetDate, setTargetDate] = useState("");

    /*
        store the priority level of the financial goal.

        High   → Most important
        Medium → Normal priority
        Low    → Less urgent 
    */
    const [priority, setPriority] = useState("Medium");


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

        // Load the existing goal deadline when editing.
        setTargetDate(editingGoal.targetDate || "");

        // Load the existing goal priority when editing.
        setPriority(editingGoal.priority || "Medium");

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

            targetDate stores the deadline chosen by the user.
        */
        const newGoal = {

            // keep the existing ID when editing.
            id: editingGoal
                ? editingGoal.id
                : Date.now(),

                // Goal name.
            name: name.trim(),

            // Amount the user wants to reach.
            targetAmount: Number(targetAmount),

            // Amount already saved.
            currentAmount: startingAmount,

            // Deadline for completing the goal.
            targetDate: targetDate,

            // Goal priority.
            priority: priority

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

        // Clear the target date after saving.
        setTargetDate("");

        //Reset the priority back to Medium.
        setPriority("Medium");

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


                {/* 
                    Target amount. 
                    
                */}
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

                {/*
                    Target Date: 
                    The user chooses when they want to 
                    complete this financial goal.
                */}
                <div className="mb-4">

                    <label className="block mb-2 font-medium text-slate-700">
                        Target Date
                    </label>

                    <input 
                        type="date"
                        value={targetDate}
                        onChange={(event) =>
                            setTargetDate(event.target.value)
                        }
                        className="w-full border rounded-lg px-4 py-2"
                        required
                    />
                </div>

                {/*
                    Goal Priority: 
                    Allows the user to decide how important this
                    financial goal is.
                */}
                <div className="mb-4">

                    <label className="block mb-2 font-medium text-slate-700">
                        Priority
                    </label>

                    <select
                        value={priority}
                        onChange={(event) =>
                            setPriority(event.target.value)
                        }
                        className="w-full border rounded-lg px-4 py-2"
                    >

                        <option value="High">
                            High
                        </option>

                        <option value="Medium">
                            Medium
                        </option>

                        <option value="Low">
                            Low
                        </option>

                    </select>

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