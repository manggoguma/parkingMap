import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null, // 토큰 초기 상태
    refreshToken: null, // 리프레시 토큰 (필요할 경우)
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setRefreshToken: (state, action) => {
      state.refreshToken = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.refreshToken = null;
    },
  },
});

export const { setToken, setRefreshToken, logout } = authSlice.actions;

export default authSlice.reducer;
