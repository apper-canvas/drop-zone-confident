import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  files: [],
  loading: false,
  error: null,
};

export const uploadSlice = createSlice({
  name: 'uploads',
  initialState,
  reducers: {
    setFiles: (state, action) => {
      state.files = action.payload;
    },
    addFile: (state, action) => {
      state.files.push(action.payload);
    },
    updateFile: (state, action) => {
      const index = state.files.findIndex(f => f.id === action.payload.id);
      if (index !== -1) {
        state.files[index] = { ...state.files[index], ...action.payload };
      }
    },
    removeFile: (state, action) => {
      state.files = state.files.filter(f => f.id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setFiles,
  addFile,
  updateFile,
  removeFile,
  setLoading,
  setError,
  clearError,
} = uploadSlice.actions;

export default uploadSlice.reducer;