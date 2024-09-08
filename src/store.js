import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice'; // authSlice는 한 번만 임포트

const store = configureStore({
  reducer: {
    auth: authReducer, // auth 슬라이스 추가
  },
});

export default store;
