import { configureStore } from "@reduxjs/toolkit";
import reviewReducer from "../src/redux/reviewSlice";

const store = configureStore({
  reducer: {
    review: reviewReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
