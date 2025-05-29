import { useNavigate, useLocation } from "react-router-dom";

<<<<<<< HEAD
const Header = ({ onLogout, onOpenAddModal }) => {
=======
const Header = ({ onLogout }) => {
>>>>>>> ae07752ed7b289091b74b3eb1ae231b550ccb973
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="bg-white shadow px-8 py-4 flex justify-between items-center mb-8">
      <h1
        className="text-2xl font-bold flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/books")}
      >
        <span role="img" aria-label="books">
          📚
        </span>{" "}
        Manajemen Buku
      </h1>
      <nav className="flex items-center gap-3">
<<<<<<< HEAD
        {/* Tombol Tambah Buku, yang panggil fungsi modal tambah buku */}
        <button
          onClick={onOpenAddModal}
          className="px-4 py-2 rounded font-semibold bg-green-600 text-white hover:bg-green-700"
        >
          Tambah Buku
        </button>

=======
        <button
          onClick={() => navigate("/books")}
          className={`px-4 py-2 rounded font-semibold ${
            location.pathname === "/books" || location.pathname === "/"
              ? "bg-violet-600 text-white"
              : "bg-gray-100 hover:bg-violet-100 text-gray-800"
          }`}
        >
          Daftar Buku
        </button>
        <button
          onClick={() => navigate("/add")}
          className={`px-4 py-2 rounded font-semibold ${
            location.pathname === "/add"
              ? "bg-green-600 text-white"
              : "bg-gray-100 hover:bg-green-100 text-gray-800"
          }`}
        >
          Tambah Buku
        </button>
>>>>>>> ae07752ed7b289091b74b3eb1ae231b550ccb973
        <button
          onClick={() => navigate("/profile")}
          className={`px-4 py-2 rounded font-semibold ${
            location.pathname === "/profile"
              ? "bg-yellow-400 text-gray-900"
              : "bg-gray-100 hover:bg-yellow-100 text-gray-800"
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => navigate("/about")}
          className={`px-4 py-2 rounded font-semibold ${
            location.pathname === "/about"
              ? "bg-blue-400 text-white"
              : "bg-gray-100 hover:bg-blue-100 text-gray-800"
          }`}
        >
          About
        </button>
        <button
          onClick={onLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-semibold"
        >
          Logout
        </button>
      </nav>
    </header>
  );
};

export default Header;
