/*
    REUSABLE AMOUNT VALIDATOR

    Checks whether an amount is a valid positive number.
    Rejects empty values, invalid numbers, zero and negative amounts.
*/

function isValidAmount(amount) {

    // Convert the supplied value into a number.
    const numericAmount = Number(amount);

    // Confirm that the amount is valid and greater than zero.
    return (
        amount !== "" &&
        amount !== null &&
        amount !== undefined &&
        Number.isFinite(numericAmount) &&
        numericAmount > 0
    );
}

export default isValidAmount;