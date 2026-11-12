
/*
    FINFLOW DATA LOADER

    Loads saved transactions, goals and budgets
    from the browser's LocalStorage.
*/

function loadFinflowData() {
    // Provide safe default values.
    const defaultData = {
        transactions: [],
        goals: [],
        budgets: [],
        settings: {},
    };

    try {
        // Get the saved FinFlow information.
        const savedData = localStorage.getItem("finflow_data");

        // Return defaults if no information exists.
        if (!savedData) {
            return defaultData;
        }

        // Convert the saved text into a JavaScript object.
        const parsedData = JSON.parse(savedData);

        // Make sure the saved information is an object.
        if (
            !parsedData ||
            typeof parsedData !== "object" ||
            Array.isArray(parsedData)
        ) {
            return defaultData;
        }

        // Return the saved information with safe defaults.
        return {
            transactions: Array.isArray(parsedData.transactions)
                ? parsedData.transactions
                : [],

            goals: Array.isArray(parsedData.goals)
                ? parsedData.goals
                : [],

            budgets: Array.isArray(parsedData.budgets)
                ? parsedData.budgets
                : [],

            settings:
                parsedData.settings &&
                typeof parsedData.settings === "object" &&
                !Array.isArray(parsedData.settings)
                    ? parsedData.settings
                    : {},
        };
    } catch (error) {
        // Report the problem and prevent the application from crashing.
        console.error("Unable to load FinFlow data:", error);

        return defaultData;
    }
}

// Allow other components to use this function.
export default loadFinflowData;
