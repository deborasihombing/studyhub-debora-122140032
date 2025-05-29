import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import BookForm from "../components/BookForm";
import BookList from "../components/BookList";

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    // Fetch data buku dari backend 
    axios
      .get("/api/books")
      .then((res) => setBooks(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Filter buku berdasarkan pencarian dan favorit
  const filteredBooks = books.filter((book) => {
    const matchesSearch = book.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFavorite = showFavorites ? book.isFavorite : true;
    return matchesSearch && matchesFavorite;
  });

  // Logout handler
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // Jika sudah logout tampilkan pesan dan bisa redirect login
  if (!isLoggedIn)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <p className="text-xl font-semibold text-gray-700">
          Anda sudah logout. Silakan{" "}
          <a href="/login" className="text-blue-600 underline">
            login kembali
          </a>
          .
        </p>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-8">
      <Header onLogout={handleLogout} />
      <BookForm setBooks={setBooks} />
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 my-6">
        <input
          type="text"
          placeholder="Cari buku..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded p-3 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => setShowFavorites(!showFavorites)}
          className={`rounded px-5 py-3 text-white font-semibold transition ${
            showFavorites ? "bg-yellow-500" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {showFavorites ? "Tampilkan Semua" : "Tampilkan Favorit"}
        </button>
      </div>
      <BookList books={filteredBooks} setBooks={setBooks} />
    </div>
  );
};

export default BooksPage;
