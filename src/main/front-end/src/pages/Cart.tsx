import React, { useEffect, useState } from 'react';
import { getCart, updateQuantity, removeFromCart } from '../services/cartService';
import type { Cart as CartType, CartItem } from '../services/cartService';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Cart: React.FC = () => {
    const [cart, setCart] = useState<CartType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [isInitialized, setIsInitialized] = useState(false);
    const [productImages, setProductImages] = useState<Record<number, string>>({});

    useEffect(() => {
        if (!isInitialized) {
            loadCart();
            setIsInitialized(true);
        }
    }, [isInitialized]);

    useEffect(() => {
        if (cart?.items) {
            loadProductImages();
        }
    }, [cart?.items]);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/v1/cart', {
                    credentials: 'include'
                });
                if (!response.ok) {
                    throw new Error('Sepet getirilemedi');
                }
                const data = await response.json();
                setCart(data);
            } catch (error) {
                console.error('Sepet getirme hatası:', error);
            }
        };

        fetchCart();
        // Her 10 saniyede bir sepeti güncelle
        const interval = setInterval(fetchCart, 10000);

        return () => clearInterval(interval);
    }, []);

    const loadProductImages = async () => {
        if (!cart?.items) return;
        
        const images: Record<number, string> = {};
        for (const item of cart.items) {
            try {
                const response = await fetch(`http://localhost:8080/api/v1/products/image/${item.productId}`);
                if (!response.ok) {
                    console.error(`Ürün resmi yüklenemedi (ID: ${item.productId}): ${response.statusText}`);
                    continue;
                }
                const imageBlob = await response.blob();
                const imageUrl = URL.createObjectURL(imageBlob);
                images[item.productId] = imageUrl;
            } catch (err) {
                console.error(`Ürün resmi yüklenemedi (ID: ${item.productId}):`, err);
            }
        }
        setProductImages(images);
    };

    const loadCart = async () => {
        try {
            const data = await getCart();
            console.log('Gelen sepet verisi:', JSON.stringify(data, null, 2));
            console.log('Cart null mu?:', !data);
            console.log('Items var mı?:', Array.isArray(data?.items));
            console.log('Items uzunluğu:', data?.items?.length || 0);
            console.log('Cart içeriği:', {
                id: data?.id,
                totalPrice: data?.totalPrice,
                itemCount: data?.items?.length || 0,
                items: data?.items || []
            });
            setCart(data);
        } catch (err: any) {
            console.error('Sepet yükleme hatası:', err);
            if (err.response?.status === 401) {
                navigate('/login');
            } else {
                const errorMessage = err.response?.data?.message || 'Sepet yüklenirken bir hata oluştu';
                setError(errorMessage);
                toast.error(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = async (productId: number, newQuantity: number) => {
        if (newQuantity < 1) return;
        try {
            await updateQuantity(productId, newQuantity);
            await loadCart();
            toast.success('Miktar güncellendi');
        } catch (err: any) {
            if (err.response?.status === 401) {
                navigate('/login');
            } else {
                toast.error(err.response?.data?.message || 'Miktar güncellenirken bir hata oluştu');
            }
        }
    };

    const handleRemove = async (productId: number) => {
        try {
            await removeFromCart(productId);
            await loadCart();
            toast.success('Ürün sepetten çıkarıldı');
        } catch (err: any) {
            if (err.response?.status === 401) {
                navigate('/login');
            } else {
                toast.error(err.response?.data?.message || 'Ürün sepetten çıkarılırken bir hata oluştu');
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="text-xl text-gray-600">Yükleniyor...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="text-xl text-red-600">{error}</div>
                </div>
            </div>
        );
    }

    if (!cart || !cart.items) {
        return (
            <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-2xl font-semibold mb-4">Sepetiniz</h1>
                    <p className="text-gray-600">Sepetiniz boş</p>
                    <button
                        onClick={() => navigate('/')}
                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        Alışverişe Devam Et
                    </button>
                </div>
            </div>
        );
    }

    if (cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-2xl font-semibold mb-4">Sepetiniz</h1>
                    <p className="text-gray-600">Sepetiniz boş</p>
                    <button
                        onClick={() => navigate('/')}
                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        Alışverişe Devam Et
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-semibold mb-8">Sepetiniz</h1>
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-2/3">
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <div className="divide-y divide-gray-200">
                                {cart.items.map((item) => (
                                    <div key={item.id} className="p-6 flex items-center">
                                        <img
                                            src={productImages[item.productId] || '/placeholder.jpg'}
                                            alt={item.productName}
                                            className="w-20 h-20 object-cover rounded"
                                        />
                                        <div className="ml-6 flex-1">
                                            <h3 className="text-lg font-medium">{item.productName}</h3>
                                            <p className="text-gray-600">
                                                Birim Fiyat: {item.price.toLocaleString('tr-TR', {
                                                    style: 'currency',
                                                    currency: 'TRY'
                                                })}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Toplam: {item.totalPrice.toLocaleString('tr-TR', {
                                                    style: 'currency',
                                                    currency: 'TRY'
                                                })}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                                                    className="p-1 rounded-full hover:bg-gray-100"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="w-8 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                                                    className="p-1 rounded-full hover:bg-gray-100"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => handleRemove(item.productId)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="lg:w-1/3">
                        <div className="bg-white rounded-lg shadow-lg p-6 sticky top-20">
                            <h2 className="text-xl font-semibold mb-4">Sipariş Özeti</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-gray-600">
                                    <span>Ürün Sayısı</span>
                                    <span>{cart.items.length} adet</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-600">
                                    <span>Toplam Ürün</span>
                                    <span>
                                        {cart.items.reduce((sum, item) => sum + item.quantity, 0)} adet
                                    </span>
                                </div>
                                <div className="border-t pt-4">
                                    <div className="flex justify-between items-center font-semibold text-lg">
                                        <span>Toplam</span>
                                        <span className="text-indigo-600">
                                            {cart.totalPrice.toLocaleString('tr-TR', {
                                                style: 'currency',
                                                currency: 'TRY'
                                            })}
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-6 space-y-3">
                                    <button
                                        onClick={() => {/* Ödeme işlemi gelecek */}}
                                        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-300 font-medium"
                                    >
                                        Ödeme Yap
                                    </button>
                                    <button
                                        onClick={() => navigate('/')}
                                        className="w-full bg-gray-100 text-gray-800 py-3 px-4 rounded-md hover:bg-gray-200 transition-colors duration-300 font-medium"
                                    >
                                        Alışverişe Devam Et
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;