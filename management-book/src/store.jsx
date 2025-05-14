// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import someReducer from './someReducer'; // Sesuaikan dengan reducer yang Anda miliki

export const store = configureStore({
  reducer: {
    some: someReducer, // Ganti dengan reducer Anda
  },
});
