import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import BookList from "../components/BookList";
import AdditionalFeatures from "../components/AdditionalFeatures";

const Dashboard = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [sortKey, setSortKey] = useState("title");

  useEffect(() => {
    const savedBooks = localStorage.getItem("bookData");
    if (savedBooks) setBooks(JSON.parse(savedBooks));
  }, []);

  useEffect(() => {
    localStorage.setItem("bookData", JSON.stringify(books));
  }, [books]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  // Sorting & filtering logic
  const sortedBooks = [...books].sort((a, b) => {
    if (sortKey === "title") return a.title.localeCompare(b.title);
    if (sortKey === "date") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortKey === "favorite") return (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0);
    return 0;
  });

  const filteredBooks = sortedBooks.filter((book) => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory ? book.category === filterCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <Header onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto p-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
          <input
            type="text"
            placeholder="Cari judul buku..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow border border-gray-300 rounded p-3"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border border-gray-300 rounded p-3"
          >
            <option value="">Semua Kategori</option>
            <option value="Fiksi">Fiksi</option>
            <option value="Non-Fiksi">Non-Fiksi</option>
            <option value="Teknologi">Teknologi</option>
            <option value="Sejarah">Sejarah</option>
          </select>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            className="border border-gray-300 rounded p-3"
          >
            <option value="title">Urutkan: Judul</option>
            <option value="date">Urutkan: Terbaru</option>
            <option value="favorite">Urutkan: Favorit</option>
          </select>
        </div>
        <div className="mb-3 text-gray-500 text-sm">
          Menampilkan {filteredBooks.length} dari {books.length} buku
        </div>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <BookList books={filteredBooks} setBooks={setBooks} />
        </div>

        {/* Fitur tambahan di bawah */}
        <AdditionalFeatures books={books} />
      </div>
    </div>
  );
};

export default Dashboard;
