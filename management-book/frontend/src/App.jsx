import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
<<<<<<< HEAD
import RegisterPage from "./pages/RegisterPage"; // <-- Impor RegisterPage
import Dashboard from "./pages/Dashboard"; // Ini adalah halaman untuk buku
import Profile from "./pages/Profile";
import About from "./pages/About";
// import NotFoundPage from "./pages/NotFoundPage"; // <-- Buat komponen ini jika mau
=======
import BooksPage from "./pages/BooksPage";
import Profile from "./pages/Profile"; // Pastikan halaman Profile sudah dibuat
import About from "./pages/About";
>>>>>>> ae07752ed7b289091b74b3eb1ae231b550ccb973

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
<<<<<<< HEAD
        <Route path="/register" element={<RegisterPage />} />{" "}
        {/* <-- Rute untuk registrasi */}
        <Route path="/books" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />{" "}
        {/* Bisa juga /profile/:userId */}
        <Route path="/about" element={<About />} />
        {/* <Route path="*" element={<NotFoundPage />} /> */}{" "}
        {/* <-- Rute untuk halaman tidak ditemukan */}
=======
        <Route path="/books" element={<BooksPage />} />
        <Route path="/profile" element={<Profile />} />  {/* Route halaman profil */}
        <Route path="/about" element={<About />} />
>>>>>>> ae07752ed7b289091b74b3eb1ae231b550ccb973
      </Routes>
    </Router>
  );
}

export default App;
