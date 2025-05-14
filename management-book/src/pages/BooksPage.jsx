import { useState, useEffect } from "react";
import BookForm from "../components/BookForm";
import BookList from "../components/BookList";

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [recentlyAddedId, setRecentlyAddedId] = useState(null);

  useEffect(() => {
    const savedBooks = localStorage.getItem("bookData");
    if (savedBooks) {
      setBooks(JSON.parse(savedBooks));
    } else {
      setBooks([
        { id: 1, title: "Belajar React", author: "Jordan Walke", category: "Teknologi", isFavorite: false },
        { id: 2, title: "Fiksi Populer", author: "Penulis A", category: "Fiksi", isFavorite: true },
      ]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("bookData", JSON.stringify(books));
  }, [books]);

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-center mb-6">📚 Manajemen Buku</h1>
      <div className="max-w-4xl mx-auto">
        <BookForm
          setBooks={setBooks}
          editingBook={editingBook}
          setEditingBook={setEditingBook}
          setRecentlyAddedId={setRecentlyAddedId}
        />
        <BookList
          books={books}
          setBooks={setBooks}
          setEditingBook={setEditingBook}
          recentlyAddedId={recentlyAddedId}
        />
      </div>
    </div>
  );
};

export default BooksPage;
