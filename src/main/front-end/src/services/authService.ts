import axiosInstance from './axiosConfig';

// Types
export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
}

// Auth Service Functions
export const register = async (request: RegisterRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/auth/register', request);
    if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
        return response.data;
    }
    throw new Error('Sunucudan geçerli bir yanıt alınamadı');
};

export const login = async (request: LoginRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/auth/login', request);
    if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
        return response.data;
    }
    throw new Error('Geçersiz giriş yanıtı');
};

export const logout = (): void => {
    localStorage.removeItem('token');
};

export const getCurrentToken = (): string | null => {
    return localStorage.getItem('token');
};

export const isAuthenticated = (): boolean => {
    return !!getCurrentToken();
}; 