import axiosInstance from './axiosConfig';

export interface Product {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    stock: number;
}

export const getAllProducts = async (): Promise<Product[]> => {
    const response = await axiosInstance.get('/products');
    return response.data;
};

export const getProduct = async (id: number): Promise<Product> => {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data;
};

export const createProduct = async (product: Omit<Product, 'id' | 'stock'>): Promise<Product> => {
    const response = await axiosInstance.post('/products', product);
    return response.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/products/${id}`);
}; 