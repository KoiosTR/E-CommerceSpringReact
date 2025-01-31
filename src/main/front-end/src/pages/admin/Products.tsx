import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { getAllProducts, createProduct, updateProduct, deleteProduct, uploadImage } from '../../services/adminService';
import { Plus, Edit, Trash2 } from 'lucide-react';

const MAX_IMAGE_SIZE = 800; // maksimum resim boyutu (piksel)

const Products: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [productImages, setProductImages] = useState<Record<number, string>>({});
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        imageUrl: ''
    });

    const resizeImage = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // Resmi boyutlandır
                    if (width > height) {
                        if (width > MAX_IMAGE_SIZE) {
                            height = height * (MAX_IMAGE_SIZE / width);
                            width = MAX_IMAGE_SIZE;
                        }
                    } else {
                        if (height > MAX_IMAGE_SIZE) {
                            width = width * (MAX_IMAGE_SIZE / height);
                            height = MAX_IMAGE_SIZE;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', 0.8)); // JPEG formatında, %80 kalite
                };
                img.onerror = reject;
                img.src = e.target?.result as string;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                // Önce resmi boyutlandır
                const resizedImageBlob = await resizeImage(file);
                
                // Base64'ten Blob'a çevir
                const response = await fetch(resizedImageBlob);
                const blob = await response.blob();
                
                // Yeni bir File oluştur
                const resizedFile = new File([blob], file.name, { type: 'image/jpeg' });
                
                // Resmi yükle ve URL al
                const imageUrl = await uploadImage(resizedFile);
                
                setFormData(prev => ({
                    ...prev,
                    imageUrl: `http://localhost:8080${imageUrl}`
                }));
            } catch (err) {
                setError('Resim yüklenirken bir hata oluştu');
            }
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const data = await getAllProducts();
            setProducts(data);
            loadProductImages(data);
        } catch (err) {
            setError('Ürünler yüklenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (selectedProduct) {
                await updateProduct(selectedProduct.id, {
                    ...formData,
                    stock: selectedProduct.stock // Mevcut stok değerini koru
                });
            } else {
                await createProduct({
                    ...formData,
                    stock: 0 // Varsayılan stok değeri eklendi
                });
            }
            await loadProducts();
            setIsModalOpen(false);
            resetForm();
        } catch (err: any) {
            setError(err.message || 'İşlem sırasında bir hata oluştu');
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
            try {
                await deleteProduct(id);
                await loadProducts();
            } catch (err) {
                setError('Ürün silinirken bir hata oluştu');
            }
        }
    };

    const openEditModal = (product: Product) => {
        setSelectedProduct(product);
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            imageUrl: product.imageUrl || ''
        });
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setSelectedProduct(null);
        setFormData({
            name: '',
            description: '',
            price: 0,
            imageUrl: ''
        });
    };

    if (loading) return <div className="text-center py-8">Yükleniyor...</div>;
    if (error) return <div className="text-center py-8 text-red-600">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Ürün Yönetimi</h1>
                <button
                    onClick={() => {
                        setSelectedProduct(null);
                        setFormData({
                            name: '',
                            description: '',
                            price: 0,
                            imageUrl: ''
                        });
                        setIsModalOpen(true);
                    }}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Yeni Ürün
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ürün
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Fiyat
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                İşlemler
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <img
                                            src={productImages[product.id] || '/placeholder.jpg'}
                                            alt={product.name}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {product.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {product.description}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        {product.price.toLocaleString('tr-TR', {
                                            style: 'currency',
                                            currency: 'TRY'
                                        })}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => {
                                            setSelectedProduct(product);
                                            setFormData({
                                                name: product.name,
                                                description: product.description || '',
                                                price: product.price,
                                                imageUrl: product.imageUrl
                                            });
                                            setIsModalOpen(true);
                                        }}
                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                    >
                                        <Edit className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">
                                {selectedProduct ? 'Ürün Düzenle' : 'Yeni Ürün'}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Ürün Adı
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({ ...formData, name: e.target.value })
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Açıklama
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData({ ...formData, description: e.target.value })
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Fiyat
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                price: parseFloat(e.target.value)
                                            })
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Resim
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                    />
                                    {formData.imageUrl && (
                                        <div className="mt-2">
                                            <img
                                                src={formData.imageUrl}
                                                alt="Önizleme"
                                                className="h-32 w-32 object-cover rounded-md"
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                    >
                                        İptal
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                                    >
                                        {selectedProduct ? 'Güncelle' : 'Oluştur'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products; 