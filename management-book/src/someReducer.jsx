import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  books: [],
};

const someReducer = createSlice({
  name: 'books',
  initialState,
  reducers: {
    addBook: (state, action) => {
      state.books.push(action.payload);
    },
    removeBook: (state, action) => {
      state.books = state.books.filter(book => book.id !== action.payload);
    },
  },
});

export const { addBook, removeBook } = someReducer.actions;
export default someReducer.reducer;
