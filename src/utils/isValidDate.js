/*
    REUSABLE DATE VALIDATOR

    Checks whether a supplied date is valid.
    Returns true for a valid date and false for an invalid date.
*/

function isValidDate(dateValue) {

    // Reject empty values and values that are not strings.
    if (
        typeof dateValue !== "string" ||
        !dateValue.trim()
    ) {
        return false;
    }

    // Check that the date follows YYYY-MM-DD format.
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
        return false;
    }

    // Separate the year, month and day.
    const [year, month, day] = dateValue.split("-").map(Number);

    // Create a date using the supplied values.
    const date = new Date(year, month - 1, day);

    // Confirm that JavaScript did not change the supplied date.
    return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
    );
}

export default isValidDate;