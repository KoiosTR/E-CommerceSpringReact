import React, { useEffect, useState } from 'react';
import { Product, getAllProducts } from '../services/productService';
import { addToCart } from '../services/cartService';
import { toast } from 'react-toastify';

const Home: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [addingToCart, setAddingToCart] = useState<number | null>(null);
    const [productImages, setProductImages] = useState<Record<number, string>>({});

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getAllProducts();
                setProducts(data);
                loadProductImages(data);
            } catch (err: any) {
                setError(err.message || 'Ürünler yüklenirken bir hata oluştu');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const loadProductImages = async (products: Product[]) => {
        const images: Record<number, string> = {};
        for (const product of products) {
            try {
                const response = await fetch(`http://localhost:8080/api/v1/products/image/${product.id}`);
                if (!response.ok) {
                    console.error(`Ürün resmi yüklenemedi (ID: ${product.id}): ${response.statusText}`);
                    continue;
                }
                const imageBlob = await response.blob();
                const imageUrl = URL.createObjectURL(imageBlob);
                images[product.id] = imageUrl;
            } catch (err) {
                console.error(`Ürün resmi yüklenemedi (ID: ${product.id}):`, err);
            }
        }
        setProductImages(images);
    };

    const handleAddToCart = async (productId: number) => {
        try {
            setAddingToCart(productId);
            await addToCart(productId, 1);
            toast.success('Ürün sepete eklendi');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Ürün sepete eklenirken bir hata oluştu');
        } finally {
            setAddingToCart(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl text-gray-600">Yükleniyor...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl text-red-600">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Ürünlerimiz</h1>
                
                {products.length === 0 ? (
                    <div className="text-center text-gray-600">
                        Henüz ürün bulunmamaktadır.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                            >
                                <img
                                    src={productImages[product.id] || '/placeholder.jpg'}
                                    alt={product.name}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                        {product.name}
                                    </h2>
                                    <p className="text-lg font-bold text-indigo-600">
                                        {product.price.toLocaleString('tr-TR', {
                                            style: 'currency',
                                            currency: 'TRY'
                                        })}
                                    </p>
                                    <button
                                        className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-300 disabled:bg-indigo-400"
                                        onClick={() => handleAddToCart(product.id)}
                                        disabled={addingToCart === product.id}
                                    >
                                        {addingToCart === product.id ? 'Ekleniyor...' : 'Sepete Ekle'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;