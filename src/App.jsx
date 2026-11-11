
// Import the navigation bar.
import Navbar from "./components/layouts/Navbar";

// Import the main FinFlow dashboard.
import Hero from "./components/landing/Hero";

// Main application component.
function App() {
  return (
    <>
      {/* Displays the application navigation. */}
      <Navbar />

      {/* Displays the main dashboard and its features. */}
      <Hero />
    </>
  );
}

export default App;
