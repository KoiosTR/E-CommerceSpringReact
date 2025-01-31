export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
}

export interface CartItem {
    id: number;
    productId: number;
    productName: string;
    price: number;
    quantity: number;
    totalPrice: number;
}

export interface FavoriteItem {
    product: Product;
    addedAt: Date;
} 