import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosConfig';

interface User {
    firstName: string;
    lastName: string;
    email: string;
    role: 'ADMIN' | 'USER';
}

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axiosInstance.get('/auth/me');
                setUser(response.data);
            } catch (err) {
                navigate('/login');
            }
        };

        fetchUserData();
    }, [navigate]);

    if (!user) {
        return <div>Yükleniyor...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Sol Taraf - Kullanıcı Bilgileri */}
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Hesap Bilgileri
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Ad</label>
                                <div className="mt-1 p-2 bg-gray-50 rounded-md">
                                    {user.firstName}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Soyad</label>
                                <div className="mt-1 p-2 bg-gray-50 rounded-md">
                                    {user.lastName}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <div className="mt-1 p-2 bg-gray-50 rounded-md">
                                    {user.email}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Rol</label>
                                <div className="mt-1 p-2 bg-gray-50 rounded-md">
                                    {user.role === 'ADMIN' ? 'Yönetici' : 'Kullanıcı'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sağ Taraf - Admin Paneli */}
                    {user.role === 'ADMIN' && (
                        <div className="bg-white rounded-lg shadow-lg p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                Yönetici İşlemleri
                            </h2>
                            <div className="space-y-4">
                                <button
                                    onClick={() => navigate('/admin/products')}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Ürün Yönetimi
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 