import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const BookForm = ({ setBooks, editingBook, setEditingBook, setRecentlyAddedId }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (editingBook) {
      setTitle(editingBook.title);
      setAuthor(editingBook.author);
      setCategory(editingBook.category);
    }
  }, [editingBook]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;

    if (editingBook) {
      const updated = { ...editingBook, title, author, category };
      setBooks((prev) =>
        prev.map((b) => (b.id === updated.id ? updated : b))
      );
      toast.success("Buku berhasil diperbarui");
      setEditingBook(null);
    } else {
      const newBook = {
        id: Date.now(),
        title,
        author,
        category,
        isFavorite: false,
        createdAt: new Date().toISOString(),
      };
      setBooks((prev) => [newBook, ...prev]); // Terbaru di atas
      setRecentlyAddedId(newBook.id);
      toast.success("Buku berhasil ditambahkan");
    }

    setTitle("");
    setAuthor("");
    setCategory("");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg mb-8">
      <h2 className="text-2xl font-semibold mb-4">
        {editingBook ? "Edit Buku" : "Tambah Buku Baru"}
      </h2>
      <input
        type="text"
        placeholder="Judul Buku"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-3 mb-4 w-full rounded"
      />
      <input
        type="text"
        placeholder="Penulis"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        className="border p-3 mb-4 w-full rounded"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border p-3 mb-4 w-full rounded"
      >
        <option value="">Pilih Kategori</option>
        <option value="Fiksi">Fiksi</option>
        <option value="Non-Fiksi">Non-Fiksi</option>
        <option value="Teknologi">Teknologi</option>
        <option value="Pendidikan">Pendidikan</option>
      </select>
      <div className="flex gap-4">
        <button type="submit" className="bg-green-500 text-white p-3 w-full rounded hover:bg-green-600">
          {editingBook ? "Simpan Perubahan" : "Tambah Buku"}
        </button>
        {editingBook && (
          <button
            type="button"
            onClick={() => {
              setEditingBook(null);
              setTitle("");
              setAuthor("");
              setCategory("");
            }}
            className="bg-gray-400 text-white p-3 w-full rounded hover:bg-gray-500"
          >
            Batal Edit
          </button>
        )}
      </div>
    </form>
  );
};

export default BookForm;