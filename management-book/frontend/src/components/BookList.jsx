import React from "react";

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
    );
  }

  return (
    <ul className="space-y-5">
      {books.map((book) => (
        <li
          key={book.id}
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
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-2 px-5 rounded-md transition"
            >
              Edit
            </button>
            <button
              onClick={() => onDeleteBook(book.id)}
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
