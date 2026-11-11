
/*
  REUSABLE DATE FORMATTER

  Converts dates into a consistent, readable format.
  Example: 2026-11-11 becomes 11 Nov 2026.
*/

function formatDate(dateValue) {
    // Return a fallback if no date was supplied.
    if (!dateValue) {
        return "No date";
    }

    // Handle date strings from HTML date inputs safely.
    let date;

    if (
        typeof dateValue === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(dateValue)
    ) {
        const [year, month, day] = dateValue.split("-").map(Number);

        // Create a local date to avoid timezone shifting.
        date = new Date(year, month - 1, day);
    } else {
        // Handle other valid date values.
        date = new Date(dateValue);
    }

    // Check whether the date is valid.
    if (Number.isNaN(date.getTime())) {
        return "Invalid date";
    }

    // Return the date in a readable format.
    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

// Make the formatter available to other components.
export default formatDate;
