import axios from 'axios';
import { getCurrentToken } from './authService';

// API Constants
const BASE_URL = 'http://localhost:8080/api/v1';
const DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
};

// Error Messages
const ERROR_MESSAGES = {
    UNAUTHORIZED: 'Oturum süreniz doldu, lütfen tekrar giriş yapın',
    FORBIDDEN: 'Bu işlem için yetkiniz bulunmuyor',
    SERVER_ERROR: 'Sunucu hatası oluştu, lütfen daha sonra tekrar deneyin',
    NETWORK_ERROR: 'Bağlantı hatası, lütfen internet bağlantınızı kontrol edin',
    DEFAULT: 'Bir hata oluştu, lütfen tekrar deneyin'
};

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: DEFAULT_HEADERS,
    withCredentials: true,
    timeout: 10000
});

// Request Interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = getCurrentToken();
        console.log('İstek detayları:', {
            url: config.url,
            method: config.method,
            hasToken: !!token
        });
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('İstek hatası:', error);
        return Promise.reject(new Error(ERROR_MESSAGES.NETWORK_ERROR));
    }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        console.log('Başarılı yanıt:', {
            url: response.config.url,
            status: response.status,
            data: response.data
        });
        return response;
    },
    async (error) => {
        if (!error.response) {
            console.error('Ağ hatası:', error);
            throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
        }

        console.error('API hatası:', {
            url: error.config?.url,
            status: error.response?.status,
            data: error.response?.data
        });

        const errorMessage = error.response?.data?.message || ERROR_MESSAGES.DEFAULT;

        switch (error.response.status) {
            case 401:
                console.log('Yetkisiz erişim, oturum sonlandırılıyor');
                localStorage.removeItem('token');
                window.location.href = '/login';
                throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
            case 403:
                console.error('Yetkisiz erişim:', error.response);
                throw new Error(ERROR_MESSAGES.FORBIDDEN);
            case 400:
                console.error('Geçersiz istek:', error.response);
                throw new Error(errorMessage);
            case 500:
                console.error('Sunucu hatası:', error.response);
                throw new Error(ERROR_MESSAGES.SERVER_ERROR);
            default:
                console.error('Beklenmeyen hata:', error.response);
                throw new Error(errorMessage);
        }
    }
);

export default axiosInstance; 