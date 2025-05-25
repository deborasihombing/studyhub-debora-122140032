import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  books: [
    // Contoh data awal bisa dikosongkan juga jika ingin
    { id: 1, title: 'Belajar React', author: 'Jordan Walke', category: 'Teknologi', isFavorite: false },
    { id: 2, title: 'Fiksi Populer', author: 'Penulis A', category: 'Fiksi', isFavorite: true },
  ],
};

const bookSlice = createSlice({
  name: 'book',
  initialState,
  reducers: {
    addBook(state, action) {
      state.books.push(action.payload);
    },
    removeBook(state, action) {
      state.books = state.books.filter(book => book.id !== action.payload);
    },
    toggleFavorite(state, action) {
      const book = state.books.find(book => book.id === action.payload);
      if (book) book.isFavorite = !book.isFavorite;
    },
    updateBook(state, action) {
      const { id, title, author, category } = action.payload;
      const book = state.books.find(book => book.id === id);
      if (book) {
        book.title = title;
        book.author = author;
        book.category = category;
      }
    },
  },
});

export const { addBook, removeBook, toggleFavorite, updateBook } = bookSlice.actions;
export default bookSlice.reducer;
