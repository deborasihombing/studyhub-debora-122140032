import React from "react";

<<<<<<< HEAD
const BookList = ({
  books,
  onDeleteBook,
  onEditBook,
  onToggleFavorite,
}) => {

  if (!books || books.length === 0) {
    return (
      <p className="text-center text-gray-500">
        Tidak ada buku untuk ditampilkan.
      </p>
=======
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
>>>>>>> ae07752ed7b289091b74b3eb1ae231b550ccb973
    );
  }

  return (
    <ul className="space-y-5">
      {books.map((book) => (
        <li
          key={book.id}
<<<<<<< HEAD
          className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white rounded-md shadow p-5 hover:shadow-lg transition"
        >
          <div className="flex items-start mb-4 md:mb-0">
            {/* Tampilkan Cover Image */}
            {book.cover_image_url && (
              <img
                src={book.cover_image_url}
                alt={`Cover ${book.title}`}
                className="w-20 h-28 object-cover rounded-md mr-4 shadow cursor-pointer"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            )}
            <div>
              <h3 className="text-lg font-semibold text-indigo-700">
                {book.title}
              </h3>
              <p className="text-gray-600">Oleh: {book.author}</p>
              <p className="text-sm text-gray-500">
                Penerbit: {book.publisher}
              </p>
              <p className="text-sm text-gray-500">
                Tahun: {book.publication_year}
              </p>
              <p className="text-sm text-gray-500">ISBN: {book.isbn}</p>
              <p className="text-sm text-gray-500">Bahasa: {book.language}</p>
              <p className="italic text-gray-500 text-sm">
                Kategori: {book.category}
              </p>
              {book.synopsis && (
                <p className="mt-2 text-xs text-gray-700">{book.synopsis}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 mt-4 md:mt-0 self-end md:self-center">
            {/* Tombol toggle favorit */}
            <button
              onClick={() => onToggleFavorite(book.id)}
              className={`p-2 rounded-md transition ${
                book.isFavorite ? "bg-yellow-400" : "bg-gray-300"
              }`}
              title={book.isFavorite ? "Hapus dari Favorit" : "Tambahkan ke Favorit"}
            >
              ★
            </button>

            <button
              onClick={() => onEditBook(book)}
=======
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
>>>>>>> ae07752ed7b289091b74b3eb1ae231b550ccb973
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-2 px-5 rounded-md transition"
            >
              Edit
            </button>
            <button
<<<<<<< HEAD
              onClick={() => onDeleteBook(book.id)}
=======
              onClick={() => handleDelete(book.id)}
>>>>>>> ae07752ed7b289091b74b3eb1ae231b550ccb973
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
