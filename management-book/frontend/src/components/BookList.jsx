import React from "react";

const BookList = ({ books, setBooks }) => {
  const handleDelete = (id) => {
    if (window.confirm("Yakin ingin menghapus buku ini?")) {
      setBooks((prev) => prev.filter((book) => book.id !== id));
    }
  };

  const handleFavoriteToggle = (id) => {
    setBooks((prev) =>
      prev.map((book) =>
        book.id === id ? { ...book, isFavorite: !book.isFavorite } : book
      )
    );
  };

  if (books.length === 0) {
    return (
      <p className="text-center text-gray-500">Tidak ada buku untuk ditampilkan.</p>
    );
  }

  return (
    <ul className="space-y-5">
      {books.map((book) => (
        <li
          key={book.id}
          className="flex justify-between items-center bg-white rounded-md shadow p-5 hover:shadow-lg transition"
        >
          <div>
            <h3 className="text-lg font-semibold">{book.title}</h3>
            <p className="text-gray-600">oleh {book.author}</p>
            <p className="italic text-gray-500">{book.category}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleFavoriteToggle(book.id)}
              className={`p-2 rounded-md transition ${
                book.isFavorite ? "bg-yellow-400" : "bg-gray-300"
              }`}
              title="Toggle Favorit"
            >
              ★
            </button>
            <button
              onClick={() => alert("Fitur Edit Belum Implement")}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-2 px-5 rounded-md transition"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(book.id)}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-5 rounded-md transition"
            >
              Hapus
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default BookList;
