import axios, { AxiosError } from 'axios';
import { Product } from '../types';

const API_URL = 'http://localhost:8080/api/v1';

const handleError = (error: any) => {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 403) {
            throw new Error('Bu işlem için yetkiniz bulunmuyor. Lütfen admin rolüne sahip olduğunuzdan emin olun.');
        }
    }
    throw error;
};

export const getAllProducts = async (): Promise<Product[]> => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/products`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        handleError(error);
        throw error;
    }
};

export const createProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/products`, product, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        handleError(error);
        throw error;
    }
};

export const updateProduct = async (id: number, product: Omit<Product, 'id'>): Promise<Product> => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`${API_URL}/products/${id}`, product, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        handleError(error);
        throw error;
    }
};

export const deleteProduct = async (id: number): Promise<void> => {
    try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/products/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    } catch (error) {
        handleError(error);
        throw error;
    }
};

export const uploadImage = async (file: File): Promise<string> => {
    try {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post(`${API_URL}/products/upload`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        handleError(error);
        throw error;
    }
}; 