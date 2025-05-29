<<<<<<< HEAD
// management-book/frontend/src/components/BookForm.jsx

import { useState, useEffect } from "react";

const BookForm = ({
  addBook,
  updateBook,
  editingBookData,
  onCloseForm,
  notify,
}) => {
  // ... (state Anda tetap sama: title, isbn, author, dst.) ...
  const [title, setTitle] = useState("");
  const [isbn, setIsbn] = useState("");
  const [author, setAuthor] = useState("");
  const [publisher, setPublisher] = useState("");
  const [publicationYear, setPublicationYear] = useState("");
  const [pages, setPages] = useState("");
  const [language, setLanguage] = useState("");
  const [category, setCategory] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [existingCoverPath, setExistingCoverPath] = useState(null);
  const [deleteExistingCover, setDeleteExistingCover] = useState(false);

  useEffect(() => {
    if (editingBookData) {
      setTitle(editingBookData.title || "");
      setIsbn(editingBookData.isbn || "");
      setAuthor(editingBookData.author || "");
      setPublisher(editingBookData.publisher || "");
      setPublicationYear(editingBookData.publication_year?.toString() || "");
      setPages(editingBookData.pages?.toString() || "");
      setLanguage(editingBookData.language || "");
      setCategory(editingBookData.category || "");
      setSynopsis(editingBookData.synopsis || "");
      setExistingCoverPath(editingBookData.cover_image_path || null);
      setCoverImageFile(null);
      setDeleteExistingCover(false);
    } else {
      setTitle("");
      setIsbn("");
      setAuthor("");
      setPublisher("");
      setPublicationYear("");
      setPages("");
      setLanguage("");
      setCategory("");
      setSynopsis("");
      setCoverImageFile(null);
      setExistingCoverPath(null);
      setDeleteExistingCover(false);
    }
  }, [editingBookData]);

  const handleFileChange = (e) => {
    setCoverImageFile(e.target.files[0]);
    if (e.target.files[0]) {
      setDeleteExistingCover(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !title ||
      !isbn ||
      !author ||
      !publisher ||
      !publicationYear ||
      !pages ||
      !language ||
      !category
    ) {
      alert(
        "Mohon lengkapi semua field yang wajib (kecuali Sinopsis dan Cover)!"
      );
      return;
    }
    if (isbn.length > 13) {
      alert("ISBN tidak boleh lebih dari 13 karakter.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("isbn", isbn);
    formData.append("author", author);
    formData.append("publisher", publisher);
    formData.append("publication_year", publicationYear);
    formData.append("pages", pages);
    formData.append("language", language);
    formData.append("category", category);
    if (synopsis) formData.append("synopsis", synopsis);
    if (coverImageFile) {
      formData.append("cover_image", coverImageFile);
    }
    if (editingBookData && deleteExistingCover && !coverImageFile) {
      formData.append("delete_cover_image", "true");
    }

    let success = false;
    if (editingBookData) {
      success = await updateBook(editingBookData.id, formData);
      if (success && notify) notify("Buku berhasil diperbarui");
    } else {
      success = await addBook(formData);
      if (success && notify) notify("Buku berhasil ditambahkan");
    }

    if (success) {
      onCloseForm();
    }
  };

  const handleCancel = () => {
    onCloseForm();
  };

  // Kelas Tailwind yang direkomendasikan untuk input field konsisten
  const commonInputClassName =
    "border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-2 max-h-[80vh] overflow-y-auto"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        {editingBookData ? "Edit Buku" : "Tambah Buku Baru"}
=======
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
>>>>>>> ae07752ed7b289091b74b3eb1ae231b550ccb973
      </h2>

      <input
        type="text"
<<<<<<< HEAD
        placeholder="Judul Buku (Wajib)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className={commonInputClassName}
      />
      <input
        type="text"
        placeholder="ISBN (Wajib, max 13 char)"
        value={isbn}
        onChange={(e) => setIsbn(e.target.value)}
        required
        maxLength="13"
        className={commonInputClassName}
      />
      <input
        type="text"
        placeholder="Penulis (Wajib)"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        required
        className={commonInputClassName}
      />
      <input
        type="text"
        placeholder="Penerbit (Wajib)"
        value={publisher}
        onChange={(e) => setPublisher(e.target.value)}
        required
        className={commonInputClassName}
      />
      <input
        type="number"
        placeholder="Tahun Terbit (Wajib)"
        value={publicationYear}
        onChange={(e) => setPublicationYear(e.target.value)}
        required
        className={commonInputClassName}
      />
      <input
        type="number"
        placeholder="Jumlah Halaman (Wajib)"
        value={pages}
        onChange={(e) => setPages(e.target.value)}
        required
        className={commonInputClassName}
      />
      <input
        type="text"
        placeholder="Bahasa (Wajib)"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        required
        className={commonInputClassName}
=======
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
>>>>>>> ae07752ed7b289091b74b3eb1ae231b550ccb973
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
<<<<<<< HEAD
        required
        className={commonInputClassName}
      >
        <option value="">Pilih Kategori (Wajib)</option>
        <option value="Fiksi">Fiksi</option>
        <option value="Non-Fiksi">Non-Fiksi</option>
        <option value="Pemrograman">Pemrograman</option>
        <option value="Teknologi">Teknologi</option>
        <option value="Sejarah">Sejarah</option>
        <option value="Sains">Sains</option>
        <option value="Biografi">Biografi</option>
        <option value="Anak-anak">Anak-anak</option>
        <option value="Masak-masak">Masak-masak</option>
        <option value="Lainnya">Lainnya</option>
      </select>
      <textarea
        placeholder="Sinopsis (Opsional)"
        value={synopsis}
        onChange={(e) => setSynopsis(e.target.value)}
        className={`${commonInputClassName} h-24`}
      ></textarea>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Cover Buku (Opsional)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className={`${commonInputClassName} p-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100`}
        />
        {editingBookData && existingCoverPath && (
          <div className="mt-2 text-xs text-gray-600">
            <p>Cover saat ini: {existingCoverPath.split("/").pop()}</p>
            {!coverImageFile && (
              <label className="inline-flex items-center mt-1">
                <input
                  type="checkbox"
                  checked={deleteExistingCover}
                  onChange={(e) => setDeleteExistingCover(e.target.checked)}
                  className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="ml-2">Hapus cover saat ini</span>
              </label>
            )}
          </div>
        )}
        {coverImageFile && (
          <p className="mt-1 text-xs text-green-600">
            File baru dipilih: {coverImageFile.name}
          </p>
        )}
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-md shadow-md hover:shadow-lg transition duration-150 ease-in-out"
        >
          {editingBookData ? "Simpan Perubahan" : "Tambah Buku"}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-3 px-6 rounded-md shadow-md hover:shadow-lg transition duration-150 ease-in-out"
        >
          Batal
        </button>
=======
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
>>>>>>> ae07752ed7b289091b74b3eb1ae231b550ccb973
      </div>
    </form>
  );
};

export default BookForm;
