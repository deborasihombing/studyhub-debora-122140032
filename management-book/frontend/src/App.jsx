import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import BooksPage from "./pages/BooksPage";
import Profile from "./pages/Profile"; // Pastikan halaman Profile sudah dibuat
import About from "./pages/About";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/profile" element={<Profile />} />  {/* Route halaman profil */}
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
