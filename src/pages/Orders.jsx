// src/pages/Orders.jsx

import { useEffect, useState, useContext } from 'react';
import { Container, Table, Alert, Spinner, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { API_URL } from '../services/api';

function Orders() {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch user orders from API
    useEffect(() => {
        const fetchUserOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No authentication token found');
                }

                const response = await fetch(`${API_URL}/orders/myorders`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }
                const data = await response.json();
                setOrders(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchUserOrders();
        }
    }, [user]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Container className="my-5">
                <h2 className="mb-4 text-center">My Orders</h2>
                {loading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                        <Spinner animation="border" role="status" variant="primary">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                ) : error ? (
                    <Alert variant="danger" className="text-center">
                        {error}
                    </Alert>
                ) : orders.length === 0 ? (
                    <Alert variant="info" className="text-center">
                        You have no orders. <Link to="/products">Start Shopping!</Link>
                    </Alert>
                ) : (
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Date</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td>₹{order.totalPrice.toFixed(2)}</td>
                                    <td>
                                        <Badge bg={
                                            order.status === 'Delivered' ? 'success' :
                                            order.status === 'Shipped' ? 'info' :
                                            order.status === 'Processing' ? 'warning' :
                                            order.status === 'Cancelled' ? 'danger' : 'secondary'
                                        }>
                                            {order.status}
                                        </Badge>
                                    </td>
                                    <td>
                                        <Link to={`/orders/${order._id}`}>
                                            <Button variant="info" size="sm">
                                                <i className="fas fa-eye"></i> Details
                                            </Button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Container>
        </motion.div>
    );
}

export default Orders;
