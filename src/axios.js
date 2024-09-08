import axios from 'axios';
import { store } from './store'; // Redux store 가져오기
import { useHistory } from 'react-router-dom'; // React Router
import { logout, setToken, setRefreshToken } from './store/authSlice'; // Redux 액션

// Axios 기본 설정
axios.defaults.baseURL = '/api';

// 요청 인터셉터: 토큰이 있으면 Authorization 헤더에 추가
axios.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token; // Redux 상태에서 토큰 가져오기
    console.log("Request URL:", config.url);
    if (config.url !== '/v1/auth') {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 토큰이 만료된 경우 재발급
axios.interceptors.response.use(
  (response) => {
    return response; // 정상 응답은 그대로 처리
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = store.getState().auth.refreshToken; // Redux 상태에서 리프레시 토큰 가져오기
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // 리프레시 토큰을 사용하여 새로운 액세스 토큰 발급 요청
        const response = await axios.put('/v1/auth/reissue', { token: refreshToken });
        const newToken = response.data.accessToken;
        const newRefreshToken = response.data.refreshToken;

        // 새 토큰을 Redux 상태에 저장
        store.dispatch(setToken(newToken));
        store.dispatch(setRefreshToken(newRefreshToken));

        // 요청 헤더에 새로운 토큰 추가
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

        // 실패했던 요청을 재시도
        return axios(originalRequest);
      } catch (e) {
        // 토큰 갱신 실패 시, 로그아웃 처리
        store.dispatch(logout());
        const history = useHistory();
        history.push('/login'); // 즉시 로그인 페이지로 이동
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default axios;
