import { useState } from "react";
import { toast } from "react-toastify";

const BookList = ({ books, setBooks, setEditingBook, recentlyAddedId }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);

  const handleDelete = (id) => {
    setBooks((prev) => prev.filter((b) => b.id !== id));
    toast.info("Buku dihapus");
  };

  const toggleFavorite = (id) => {
    setBooks((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, isFavorite: !b.isFavorite } : b
      )
    );
  };

  const filtered = books
    .filter((b) =>
      `${b.title} ${b.author} ${b.category}`.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((b) => (showFavorites ? b.isFavorite : true));

  return (
    <div>
      <input
        type="text"
        placeholder="Cari buku..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-3 mb-4 w-full rounded"
      />
      <button
        onClick={() => setShowFavorites(!showFavorites)}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {showFavorites ? "Tampilkan Semua" : "Tampilkan Favorit"}
      </button>

      {filtered.length === 0 ? (
        <p className="text-center text-gray-500">Tidak ada hasil</p>
      ) : (
        <ul>
          {filtered.map((book) => (
            <li
              key={book.id}
              className={`flex justify-between items-center mb-3 p-3 rounded shadow transition ${
                book.id === recentlyAddedId ? "bg-green-100 animate-pulse" : "bg-white"
              }`}
            >
              <div>
                <p className="font-semibold">{book.title}</p>
                <p className="text-sm text-gray-600">oleh {book.author}</p>
                <p className="text-xs text-gray-500">📁 {book.category}</p>
                <p className="text-xs text-gray-400">
                  Ditambahkan: {new Date(book.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => toggleFavorite(book.id)}
                  className={`px-2 py-1 rounded ${
                    book.isFavorite ? "bg-yellow-500 text-white" : "bg-gray-300"
                  }`}
                >
                  ★
                </button>
                <button
                  onClick={() => setEditingBook(book)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(book.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Hapus
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BookList;