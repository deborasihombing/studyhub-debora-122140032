import { useState, useEffect } from "react";

const BookForm = ({ addBook, editingBook, updateBook, setEditingBook, notify }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (editingBook) {
      setTitle(editingBook.title);
      setAuthor(editingBook.author);
      setCategory(editingBook.category);
    } else {
      setTitle("");
      setAuthor("");
      setCategory("");
    }
  }, [editingBook]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !author || !category) {
      alert("Mohon lengkapi semua data!");
      return;
    }

    if (editingBook) {
      updateBook({ id: editingBook.id, title, author, category });
      notify && notify("Buku berhasil diperbarui");
    } else {
      addBook({ id: Date.now(), title, author, category, isFavorite: false });
      notify && notify("Buku berhasil ditambahkan");
    }

    setTitle("");
    setAuthor("");
    setCategory("");
  };

  const handleCancel = () => {
    setEditingBook(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">
        {editingBook ? "Edit Buku" : "Tambah Buku Baru"}
      </h2>

      <input
        type="text"
        placeholder="Judul Buku"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border border-gray-300 rounded-md p-3 w-full
                   focus:outline-none focus:ring-4 focus:ring-indigo-400
                   transition duration-300"
      />
      <input
        type="text"
        placeholder="Penulis"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        className="border border-gray-300 rounded-md p-3 w-full
                   focus:outline-none focus:ring-4 focus:ring-indigo-400
                   transition duration-300"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border border-gray-300 rounded-md p-3 w-full
                   focus:outline-none focus:ring-4 focus:ring-indigo-400
                   transition duration-300"
      >
        <option value="">Pilih Kategori</option>
        <option value="Fiksi">Fiksi</option>
        <option value="Non-Fiksi">Non-Fiksi</option>
        <option value="Teknologi">Teknologi</option>
        <option value="Sejarah">Sejarah</option>
      </select>

      <div className="flex gap-4">
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold
                     py-3 px-6 rounded-md shadow-md transition duration-300
                     hover:shadow-lg"
        >
          {editingBook ? "Simpan Perubahan" : "Tambah Buku"}
        </button>
        {editingBook && (
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-400 hover:bg-gray-500 text-white font-semibold
                       py-3 px-6 rounded-md shadow-md transition duration-300
                       hover:shadow-lg"
          >
            Batal
          </button>
        )}
      </div>
    </form>
  );
};

export default BookForm;
