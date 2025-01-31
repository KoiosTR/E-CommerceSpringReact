import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import WhyUs from './pages/WhyUs';
import Address from './pages/Address';
import Login from './pages/Login';
import Cart from './pages/Cart';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Products from './pages/admin/Products';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <ToastContainer position="top-right" autoClose={3000} />
        <Header />
        <div className="pt-16"> {/* Header'ın fixed pozisyonu için padding */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/why-us" element={<WhyUs />} />
            <Route path="/address" element={<Address />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/cart"
              element={
                <PrivateRoute>
                  <Cart />
                </PrivateRoute>
              }
            />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/admin/products"
              element={
                <AdminRoute>
                  <Products />
                </AdminRoute>
              }
            />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;