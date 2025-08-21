import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    // logout: (state) => {
    //     state.user = null;
    //     state.isLoading = false;
    //     state.error = null;
    // },
  },
});

export const { signInStart, loginSuccess, loginFailure } = userSlice.actions;

export default userSlice.reducer;
