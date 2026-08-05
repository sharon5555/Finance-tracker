function Button({ text, variant }) {
    const baseStyle = 
    "px-6 py-3 rounded-lg font-medium transition duration-300";

    const styles = {
        primary: "bg-emerald-500 text-white hover:bg-emerald-600",
        secondary: "border border-gray-300 text-gray-800 hover:bg-gray-100",
    };

    return(
        <button className={`${baseStyle} ${styles[variant]}`}>
            {text}
        </button>
    )
}

export default Button;