import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage"; // <-- Impor RegisterPage
import Dashboard from "./pages/Dashboard"; // Ini adalah halaman untuk buku
import Profile from "./pages/Profile";
import About from "./pages/About";
// import NotFoundPage from "./pages/NotFoundPage"; // <-- Buat komponen ini jika mau

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />{" "}
        {/* <-- Rute untuk registrasi */}
        <Route path="/books" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />{" "}
        {/* Bisa juga /profile/:userId */}
        <Route path="/about" element={<About />} />
        {/* <Route path="*" element={<NotFoundPage />} /> */}{" "}
        {/* <-- Rute untuk halaman tidak ditemukan */}
      </Routes>
    </Router>
  );
}

export default App;
