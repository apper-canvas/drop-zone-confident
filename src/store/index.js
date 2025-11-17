import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import uploadReducer from './uploadSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    uploads: uploadReducer,
  },
});

export default store;