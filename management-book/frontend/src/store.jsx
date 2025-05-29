import { configureStore } from "@reduxjs/toolkit";
import someReducer from "./someReducer";

export const store = configureStore({
  reducer: {
    book: someReducer,
  },
});
