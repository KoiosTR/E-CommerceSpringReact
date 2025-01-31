import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

interface AdminRouteProps {
    children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const checkAdminStatus = async () => {
            if (!token) {
                setIsAdmin(false);
                return;
            }

            try {
                const response = await axios.get('http://localhost:8080/api/v1/auth/check-admin', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setIsAdmin(response.data);
            } catch (error) {
                setIsAdmin(false);
            }
        };

        checkAdminStatus();
    }, [token]);

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (isAdmin === null) {
        return <div className="text-center py-8">Yükleniyor...</div>;
    }

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default AdminRoute; 