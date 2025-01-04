// src/pages/AdminOrders.jsx

import { useEffect, useState } from 'react';
import { Container, Table, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    // Fetch all orders from API
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // Replace with your actual API endpoint
                const response = await fetch('/api/admin/orders', {
                    headers: {
                        'Content-Type': 'application/json',
                        // Include authorization headers if required
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }
                const data = await response.json();
                setOrders(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleStatusUpdate = async (orderId, status) => {
        try {
            // Replace with your actual API endpoint
            const response = await fetch(`/api/admin/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    // Include authorization headers if required
                },
                body: JSON.stringify({ status }),
            });
            if (!response.ok) {
                throw new Error('Failed to update order status');
            }
            const updatedOrder = await response.json();
            setOrders(orders.map(order => (order._id === orderId ? updatedOrder : order)));
            setMessage('Order status updated successfully');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Container className="my-5">
                <h2 className="mb-4 text-center">Manage Orders</h2>
                {message && <Alert variant="success">{message}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}
                {loading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                        <Spinner animation="border" role="status" variant="primary">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                ) : (
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>User</th>
                                <th>Total</th>
                                <th>Paid</th>
                                <th>Delivered</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>{order.user.name}</td>
                                    <td>₹{order.totalPrice.toFixed(2)}</td>
                                    <td>
                                        {order.isPaid ? (
                                            <Badge bg="success">Yes</Badge>
                                        ) : (
                                            <Badge bg="danger">No</Badge>
                                        )}
                                    </td>
                                    <td>
                                        {order.isDelivered ? (
                                            <Badge bg="success">Yes</Badge>
                                        ) : (
                                            <Badge bg="danger">No</Badge>
                                        )}
                                    </td>
                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <Link to={`/admin/orders/${order._id}`}>
                                            <Button variant="info" size="sm">
                                                <i className="fas fa-eye"></i>
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="warning"
                                            size="sm"
                                            className="ms-2"
                                            onClick={() => handleStatusUpdate(order._id, 'Delivered')}
                                            disabled={order.isDelivered}
                                        >
                                            Mark as Delivered
                                        </Button>
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

export default AdminOrders;
