import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import AdminUsers from './pages/AdminUsers';
import AdminAddProduct from './pages/AdminAddProduct';
import AdminDashboard from './pages/AdminDashboard'; // If implemented
import Products from './pages/Products';
import Dashboard from './pages/Dashboard';
import Wishlist from './pages/Wishlist';
import Support from './pages/Support';
import ProductPage from './pages/ProductPage';
import Checkout from './pages/Checkout';

import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Navbar from './components/Navbar';
import PropTypes from 'prop-types';




/* 🛡️ Error Boundary Component */
function ErrorBoundary({ children }) {
    return (
        <ErrorBoundaryComponent>
            {children}
        </ErrorBoundaryComponent>
    );
}

ErrorBoundary.propTypes = {
    children: PropTypes.node.isRequired,
};

class ErrorBoundaryComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught in ErrorBoundary: ', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <h1>Something went wrong.</h1>;
        }

        return this.props.children;
    }
}

ErrorBoundaryComponent.propTypes = {
    children: PropTypes.node.isRequired,
};

/* 🚀 Main App Component */
function App() {
    useEffect(() => {
        console.log('App component mounted');
    }, []);

    return (
        <AuthProvider>
            <Router>
                {/* Navbar */}
                <Navbar />
                {/* Spacer to prevent content overlap */}
                <div className="navbar-spacer"></div>

                {/* Main Content Wrapper */}
                <div className="main-content">
                    <ErrorBoundary>
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<Home />} />
                            <Route path="/product/:id" element={<ProductDetails />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/products" element={<Products />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/wishlist" element={<Wishlist />} />
                            <Route path="/support" element={<Support />} />
                            <Route path="/products/:id" element={<ProductPage />}/>
                            <Route path="/checkout" element={<Checkout />} />


                            {/* Private Routes */}
                            <Route
                                path="/cart"
                                element={
                                    <PrivateRoute>
                                        <Cart />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/orders"
                                element={
                                    <PrivateRoute>
                                        <Orders />
                                    </PrivateRoute>
                                }
                            />

                            <Route
                                path="/admin/products"
                                element={
                                    <AdminRoute>
                                        <AdminProducts />
                                    </AdminRoute>
                                }
                            />
                            {/* Admin Add Product Route */}
                            <Route
                                path="/admin/products/create"
                                element={
                                    <AdminRoute>
                                        <AdminAddProduct />
                                    </AdminRoute>
                                }
                            />
                            <Route
                                path="/admin/orders"
                                element={
                                    <AdminRoute>
                                        <AdminOrders />
                                    </AdminRoute>
                                }
                            />
                            <Route
                                path="/admin/users"
                                element={
                                    <AdminRoute>
                                        <AdminUsers />
                                    </AdminRoute>
                                }
                            />
                            <Route
                                path="/admin/dashboard"
                                element={
                                    <AdminRoute>
                                        <AdminDashboard />
                                    </AdminRoute>
                                }
                            />
                        </Routes>
                    </ErrorBoundary>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
