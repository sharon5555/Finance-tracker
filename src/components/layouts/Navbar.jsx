function Navbar() {
    return (
        <nav className = "bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                {/*logo*/} 
                <h1 className="text-2xl font-bold text-emerald-600">
                    Finflow
                </h1>

                {/* Navigation links */}
                <ul className="hidden md:flex items-center gap-8 text-slate-700 font-medium">
                    <li>
                        <a href="#">Home</a>
                    </li>

                    <li>
                        <a href="#">Features</a>
                    </li>

                    <li>
                        <a href="#">About</a>
                    </li>

                    <li>
                        <a href="#">Contact</a>
                    </li>
                </ul>

                {/*Buttons */}
                <div className="hidden md:flex items-center gap-4">
                    <button className="px-5 py-2 rounded-lg text-slate-700 hover:text-emerald-600 transition">
                        Login
                    </button>

                    <button className="px-5 py-2 rounded-lg text-slate-700 hover:text-emerald-600 transition">
                        Get Started
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;