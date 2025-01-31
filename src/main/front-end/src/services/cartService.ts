import axiosInstance from './axiosConfig';

export interface CartItem {
    id: number;
    productId: number;
    productName: string;
    price: number;
    quantity: number;
    totalPrice: number;
}

export interface Cart {
    id: number;
    items: CartItem[];
    totalPrice: number;
}

export const getCart = async (): Promise<Cart> => {
    const response = await axiosInstance.get('/cart');
    return response.data;
};

export const addToCart = async (productId: number, quantity: number = 1): Promise<CartItem> => {
    const response = await axiosInstance.post(`/cart/add/${productId}`, null, {
        params: { quantity }
    });
    return response.data;
};

export const removeFromCart = async (productId: number): Promise<void> => {
    await axiosInstance.delete(`/cart/remove/${productId}`);
};

export const updateQuantity = async (productId: number, quantity: number): Promise<void> => {
    await axiosInstance.put(`/cart/update/${productId}`, null, {
        params: { quantity }
    });
};

export const clearCart = async (): Promise<void> => {
    try {
        console.log('Sepet temizleniyor...');
        await axiosInstance.delete('/cart/clear');
        console.log('Sepet temizlendi');
    } catch (error) {
        console.error('Sepet temizleme hatası:', error);
        throw error;
    }
}; 