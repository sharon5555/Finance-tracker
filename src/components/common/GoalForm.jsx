import { useEffect, useState } from "react";

// Import the reusable date validator.
import isValidDate from "../../utils/isValidDate";

/*
    GOAL FORM

    Allows users to create and edit financial goals.

    The form collects:
    - Goal name
    - Target amount
    - Amount already saved
    - Target date
    - Priority
*/
function GoalForm({
    onAddGoal,
    editingGoal,
    onFinishEditing
}) {

    // Store the goal name.
    const [name, setName] = useState("");

    // Store the target amount.
    const [targetAmount, setTargetAmount] = useState("");

    // Store the amount already saved.
    const [currentAmount, setCurrentAmount] = useState("");

    // Store the optional goal deadline.
    const [targetDate, setTargetDate] = useState("");

    // Store the goal priority.
    const [priority, setPriority] = useState("Medium");

    // Store validation and submission errors.
    const [error, setError] = useState("");

    /*
        Load existing goal information when editing.
    */
    useEffect(() => {

        if (!editingGoal) {
            return;
        }

        setName(editingGoal.name || "");
        setTargetAmount(String(editingGoal.targetAmount ?? ""));
        setCurrentAmount(String(editingGoal.currentAmount ?? ""));
        setTargetDate(editingGoal.targetDate || "");
        setPriority(editingGoal.priority || "Medium");

        // Clear previous validation messages.
        setError("");

    }, [editingGoal]);

    /*
        Clear the form after a successful save.
    */
    function resetForm() {
        setName("");
        setTargetAmount("");
        setCurrentAmount("");
        setTargetDate("");
        setPriority("Medium");
        setError("");
    }

    /*
        Validate and submit the financial goal.
    */
    function handleSubmit(event) {

        // Prevent the browser from refreshing.
        event.preventDefault();

        // Clear previous errors before validation.
        setError("");

        // Validate the goal name.
        const trimmedName = name.trim();

        if (!trimmedName) {
            setError("Please enter a goal name.");
            return;
        }

        // Convert the target amount into a number.
        const target = Number(targetAmount);

        if (
            targetAmount.trim() === "" ||
            !Number.isFinite(target) ||
            target <= 0
        ) {
            setError("Please enter a valid positive target amount.");
            return;
        }

        // Convert the starting savings amount.
        const startingAmount = currentAmount.trim() === ""
            ? 0
            : Number(currentAmount);

        if (
            !Number.isFinite(startingAmount) ||
            startingAmount < 0
        ) {
            setError("Please enter a valid starting savings amount.");
            return;
        }

        // Keep the existing rule that starting savings
        // cannot exceed the target amount.
        if (startingAmount > target) {
            setError("Starting amount cannot be greater than the target.");
            return;
        }

        // Validate the selected priority.
        const validPriorities = ["High", "Medium", "Low"];

        if (!validPriorities.includes(priority)) {
            setError("Please select a valid goal priority.");
            return;
        }

        /*
            Validate the optional target date.

            Empty dates are allowed.
            Selected dates must be valid calendar dates.
        */
        if (targetDate && !isValidDate(targetDate)) {
            setError("Please select a valid target date.");
            return;
        }

        /*
            Prepare the goal information.

            Preserve the existing ID when editing.
        */
        const newGoal = {
            id: editingGoal
                ? editingGoal.id
                : Date.now(),

            name: trimmedName,
            targetAmount: target,
            currentAmount: startingAmount,
            targetDate,
            priority
        };

        /*
            Send the goal to Hero.jsx.

            Only clear the form if the parent confirms
            that the goal was accepted.
        */
        try {

            const saveResult = onAddGoal(newGoal);

            // Stop if the parent rejects the goal.
            if (saveResult === false) {
                setError("The goal could not be saved. Please check your information.");
                return;
            }

            // Exit edit mode after a successful update.
            if (editingGoal && typeof onFinishEditing === "function") {
                onFinishEditing();
            }

            // Clear all form fields.
            resetForm();

        } catch (submissionError) {

            // Handle unexpected submission errors.
            console.error("Unable to save financial goal:", submissionError);

            setError("Something went wrong while saving your goal. Please try again.");
        }
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

            <form onSubmit={handleSubmit} noValidate>

                {/* Display validation errors inside the form. */}
                {error && (
                    <div
                        role="alert"
                        className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                    >
                        {error}
                    </div>
                )}

                {/* Goal name */}
                <div className="mb-4">

                    <label className="block mb-2 font-medium text-slate-700">
                        Goal Name
                    </label>

                    <input
                        type="text"
                        placeholder="e.g. Emergency Fund"
                        value={name}
                        onChange={(event) => {
                            setName(event.target.value);
                            setError("");
                        }}
                        className="w-full border rounded-lg px-4 py-2"
                        aria-invalid={!!error}
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
                        onChange={(event) => {
                            setTargetAmount(event.target.value);
                            setError("");
                        }}
                        className="w-full border rounded-lg px-4 py-2"
                        min="0.01"
                        step="0.01"
                        aria-invalid={!!error}
                    />

                </div>

                {/* Current savings amount */}
                <div className="mb-6">

                    <label className="block mb-2 font-medium text-slate-700">
                        Amount Already Saved
                    </label>

                    <input
                        type="number"
                        placeholder="e.g. 100000"
                        value={currentAmount}
                        onChange={(event) => {
                            setCurrentAmount(event.target.value);
                            setError("");
                        }}
                        className="w-full border rounded-lg px-4 py-2"
                        min="0"
                        step="0.01"
                        aria-invalid={!!error}
                    />

                </div>

                {/* Optional target date */}
                <div className="mb-4">

                    <label className="block mb-2 font-medium text-slate-700">
                        Target Date
                    </label>

                    <input
                        type="date"
                        value={targetDate}
                        onChange={(event) => {
                            setTargetDate(event.target.value);
                            setError("");
                        }}
                        className="w-full border rounded-lg px-4 py-2"
                    />

                </div>

                {/* Goal priority */}
                <div className="mb-4">

                    <label className="block mb-2 font-medium text-slate-700">
                        Priority
                    </label>

                    <select
                        value={priority}
                        onChange={(event) => {
                            setPriority(event.target.value);
                            setError("");
                        }}
                        className="w-full border rounded-lg px-4 py-2"
                    >

                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>

                    </select>

                </div>

                {/* Submit button */}
                <button
                    type="submit"
                    className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
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