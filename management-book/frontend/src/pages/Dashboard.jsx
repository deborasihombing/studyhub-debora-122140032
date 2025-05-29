import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import BookList from "../components/BookList";
import BookForm from "../components/BookForm";
import Modal from "../components/Modal";

const API_BASE_URL = "http://127.0.0.1:6543/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [sortKey, setSortKey] = useState("title");

  // State untuk toggle isi buku saat gambar diklik
  const [showBookContent, setShowBookContent] = useState(false);

  const fetchBooks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/books`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Inisialisasi isFavorite menjadi false jika belum ada properti ini
      const booksWithFavorite = (data || []).map((book) => ({
        ...book,
        isFavorite: book.isFavorite ?? false,
      }));
      setBooks(booksWithFavorite);
    } catch (err) {
      setError(err.message);
      setBooks([]);
      console.error("Failed to fetch books:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleLogout = () => {
    navigate("/login");
  };

  const handleAddBook = async (bookFormData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/books`, {
        method: "POST",
        body: bookFormData,
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `HTTP error! status: ${response.status}`);
      }
      await fetchBooks();
      setIsFormModalOpen(false);
      return true;
    } catch (err) {
      console.error("Failed to add book:", err);
      alert(`Error adding book: ${err.message}`);
      return false;
    }
  };

  const handleUpdateBook = async (bookId, bookFormData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
        method: "POST",
        body: bookFormData,
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `HTTP error! status: ${response.status}`);
      }
      await fetchBooks();
      setIsFormModalOpen(false);
      setEditingBook(null);
      return true;
    } catch (err) {
      console.error("Failed to update book:", err);
      alert(`Error updating book: ${err.message}`);
      return false;
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (window.confirm("Yakin ingin menghapus buku ini?")) {
      try {
        const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
          method: "DELETE",
        });
        if (!response.ok && response.status !== 204) {
          const errData = await response.json();
          throw new Error(errData.error || `HTTP error! status: ${response.status}`);
        }
        await fetchBooks();
      } catch (err) {
        console.error("Failed to delete book:", err);
        alert(`Error deleting book: ${err.message}`);
      }
    }
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    setIsFormModalOpen(true);
  };

  // Fungsi untuk membuka modal tambah buku, dipanggil dari header
  const handleOpenAddModal = () => {
    setEditingBook(null);
    setIsFormModalOpen(true);
  };

  // Toggle favorit di local state saja
  const handleToggleFavorite = (bookId) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.id === bookId ? { ...book, isFavorite: !book.isFavorite } : book
      )
    );
  };

  const sortedBooks = [...books].sort((a, b) => {
    if (sortKey === "title") return a.title.localeCompare(b.title);
    if (sortKey === "publication_year") return b.publication_year - a.publication_year;
    return 0;
  });

  const filteredBooks = sortedBooks.filter((book) => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory ? book.category === filterCategory : true;
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return <div className="text-center p-10">Loading books...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-10 text-red-500">
        Error fetching books: {error}
      </div>
    );
  }

  // Style animasi fadeIn yang bisa diterapkan ke gambar (CSS inline)
  const fadeInStyle = {
    animationName: "fadeIn",
    animationDuration: "1.5s",
    animationFillMode: "forwards",
    animationTimingFunction: "ease-in-out",
    opacity: 0,
    animationDelay: "0s",
    cursor: "pointer",
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>

      <Header onLogout={handleLogout} onOpenAddModal={handleOpenAddModal} />

      {/* Tambahan gambar interaktif dan isi buku */}
      <div className="max-w-5xl mx-auto p-8 flex flex-col items-center">
        <img
          src="/illustration-about.svg"
          alt="Ilustrasi Buku"
          style={fadeInStyle}
          className="w-80 h-auto"
          onClick={() => setShowBookContent((prev) => !prev)}
        />
        {showBookContent && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-inner max-w-md text-gray-800 text-justify">
            <h2 className="font-semibold text-xl mb-2">StudyHub</h2>
            <p>
              Selamat Datang !
            </p>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto p-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
          <input
            type="text"
            placeholder="Cari judul buku..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow border border-gray-300 rounded p-3"
          />
          {/* Tombol tambah buku di dashboard dihilangkan */}

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border border-gray-300 rounded p-3"
          >
            <option value="">Semua Kategori</option>
            <option value="Fiksi">Fiksi</option>
            <option value="Non-Fiksi">Non-Fiksi</option>
            <option value="Pemrograman">Pemrograman</option>
            <option value="Teknologi">Teknologi</option>
            <option value="Sejarah">Sejarah</option>
            <option value="Masak-masak">Masak-masak</option>
            <option value="Sains">Sains</option>
            <option value="Biografi">Biografi</option>
            <option value="Anak-anak">Anak-anak</option>
            <option value="Lainnya">Lainnya</option>
          </select>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            className="border border-gray-300 rounded p-3"
          >
            <option value="title">Urutkan: Judul</option>
            <option value="publication_year">Urutkan: Tahun Terbit</option>
          </select>
        </div>
        <div className="mb-3 text-gray-500 text-sm">
          Menampilkan {filteredBooks.length} dari {books.length} buku
        </div>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <BookList
            books={filteredBooks}
            onDeleteBook={handleDeleteBook}
            onEditBook={handleEditBook}
            onToggleFavorite={handleToggleFavorite} // Kirim prop toggle favorit ke BookList
          />
        </div>
        {isFormModalOpen && (
          <Modal
            onClose={() => {
              setIsFormModalOpen(false);
              setEditingBook(null);
            }}
          >
            <BookForm
              addBook={handleAddBook}
              updateBook={handleUpdateBook}
              editingBookData={editingBook}
              setEditingBook={setEditingBook}
              onCloseForm={() => {
                setIsFormModalOpen(false);
                setEditingBook(null);
              }}
            />
          </Modal>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
