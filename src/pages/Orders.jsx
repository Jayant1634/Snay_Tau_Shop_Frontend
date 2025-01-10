// src/pages/Orders.jsx
import './Orders.css';
import { useEffect, useState, useContext } from 'react';
import { Container, Table, Alert, Spinner, Badge, Button, Modal, Row, Col, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { API_URL } from '../services/api';

function Orders() {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

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

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedOrder(null);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="orders-container"
        >
            <Container>
                <h2 className="orders-title">My Orders</h2>
                {loading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                        <Spinner animation="border" role="status" className="loading-spinner">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                ) : error ? (
                    <Alert variant="danger" className="text-center">
                        {error}
                    </Alert>
                ) : orders.length === 0 ? (
                    <div className="empty-orders">
                        <h4>You have no orders yet</h4>
                        <p>Start shopping to place your first order!</p>
                        <Link to="/products" className="auth-link">Browse Products</Link>
                    </div>
                ) : (
                    <>
                        <Table className="orders-table" responsive>
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
                                            <Badge 
                                                bg={
                                                    order.status === 'Delivered' ? 'success' :
                                                    order.status === 'Shipped' ? 'info' :
                                                    order.status === 'Processing' ? 'warning' :
                                                    order.status === 'Cancelled' ? 'danger' : 'secondary'
                                                }
                                                className={`status-badge status-${order.status.toLowerCase()}`}
                                            >
                                                {order.status}
                                            </Badge>
                                        </td>
                                        <td>
                                            <Button 
                                                className="details-btn"
                                                onClick={() => handleViewOrder(order)}
                                            >
                                                <i className="fas fa-eye"></i> Details
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                        <Modal show={showModal} onHide={handleCloseModal} size="lg" className="order-modal">
                            <Modal.Header closeButton>
                                <Modal.Title>Order Details</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {selectedOrder && (
                                    <div>
                                        <Row className="mb-3">
                                            <Col md={6}>
                                                <div className="order-info-section">
                                                    <h5>Shipping Information</h5>
                                                    <p><strong>Name:</strong> {selectedOrder.name}</p>
                                                    <p><strong>Address:</strong> {selectedOrder.address}</p>
                                                    <p><strong>City:</strong> {selectedOrder.city}</p>
                                                    <p><strong>Postal Code:</strong> {selectedOrder.postalCode}</p>
                                                    <p><strong>Country:</strong> {selectedOrder.country}</p>
                                                </div>
                                            </Col>
                                            <Col md={6}>
                                                <div className="order-info-section">
                                                    <h5>Order Information</h5>
                                                    <p><strong>Order ID:</strong> {selectedOrder._id}</p>
                                                    <p><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                                                    <p>
                                                        <strong>Status:</strong>{' '}
                                                        <Badge 
                                                            bg={
                                                                selectedOrder.status === 'Delivered' ? 'success' :
                                                                selectedOrder.status === 'Shipped' ? 'info' :
                                                                selectedOrder.status === 'Processing' ? 'warning' :
                                                                selectedOrder.status === 'Cancelled' ? 'danger' : 'secondary'
                                                            }
                                                            className={`status-badge status-${selectedOrder.status.toLowerCase()}`}
                                                        >
                                                            {selectedOrder.status}
                                                        </Badge>
                                                    </p>
                                                    <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
                                                </div>
                                            </Col>
                                        </Row>
                                        <h5>Order Items</h5>
                                        <ListGroup className="order-items-list">
                                            {selectedOrder.items.map((item, index) => (
                                                <ListGroup.Item key={index}>
                                                    <Row className="align-items-center">
                                                        <Col md={2}>
                                                            <img 
                                                                src={item.product.image} 
                                                                alt={item.product.name}
                                                                className="order-item-image"
                                                            />
                                                        </Col>
                                                        <Col md={4}>
                                                            <h6>{item.product.name}</h6>
                                                            <small className="text-muted">Category: {item.product.category}</small>
                                                        </Col>
                                                        <Col md={3} className="text-center">
                                                            Quantity: {item.qty}
                                                        </Col>
                                                        <Col md={3} className="text-end">
                                                            ₹{(item.product.price * item.qty).toFixed(2)}
                                                        </Col>
                                                    </Row>
                                                </ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                        <div className="order-total">
                                            <Row>
                                                <Col className="text-end">
                                                    <p className="mb-1">Subtotal: ₹{(selectedOrder.totalPrice - selectedOrder.shippingFee).toFixed(2)}</p>
                                                    <p className="mb-2">Shipping Fee: ₹{selectedOrder.shippingFee.toFixed(2)}</p>
                                                    <h4>Total Amount: ₹{selectedOrder.totalPrice.toFixed(2)}</h4>
                                                </Col>
                                            </Row>
                                        </div>
                                    </div>
                                )}
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleCloseModal}>
                                    Close
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </>
                )}
            </Container>
        </motion.div>
    );
}

export default Orders;
