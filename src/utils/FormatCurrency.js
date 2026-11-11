
/*
    Reusable currency formatter.

    Converts a number into Nigerian Naira currency format.
    Example: 250000 becomes ₦250,000.
*/

function formatCurrency(amount) {
  // Convert the supplied amount into a number.
    const numericAmount = Number(amount);

  // Return zero if the amount is invalid.
        if (!Number.isFinite(numericAmount)) {
        return "₦0";
    }

  // Format the amount using Nigerian number formatting.
    return `₦${numericAmount.toLocaleString("en-NG")}`;
}

// Make the function available to other components.
export default formatCurrency;
