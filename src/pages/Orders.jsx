import { useEffect, useState } from 'react';
import { Row, Col, ListGroup, Badge, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { API_URL } from '../services/api';
import Footer from '../components/Footer';
import './Orders.css';

function Orders() {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [viewingOrder, setViewingOrder] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('You must be logged in to view your orders');
                }

                const response = await fetch(`${API_URL}/orders`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
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

        fetchOrders();
    }, []);

    const handleCloseOrderDetail = () => setViewingOrder(null);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center loading-container">
                <Spinner animation="border" role="status" variant="primary">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <Alert variant="danger" className="text-center">
                    {error}
                </Alert>
            </div>
        );
    }

    return (
        <>
            <div className="orders-container">
                <h1 className="orders-title">📜 My Orders</h1>

                {orders.length === 0 ? (
                    <div className="empty-orders">
                        <Alert variant="info" className="text-center">
                            You have no orders. <Link to="/products" className="text-primary">Shop Now</Link>
                        </Alert>
                    </div>
                ) : (
                    <Row className="orders-content">
                        <Col lg={8} className="orders-list-container">
                            <ListGroup variant="flush" className="orders-list">
                                {orders.map((order) => (
                                    <ListGroup.Item key={order._id} className="order-item">
                                        <Row className="align-items-center">
                                            <Col md={4}>
                                                <h5>Order #{order._id.substring(0, 8)}...</h5>
                                                <p className="text-muted small">
                                                    Placed on: {new Date(order.createdAt).toLocaleDateString()}
                                                </p>
                                            </Col>
                                            <Col md={3}>
                                                <Badge
                                                    bg={
                                                        order.status === 'Delivered'
                                                            ? 'success'
                                                            : order.status === 'Shipped'
                                                            ? 'info'
                                                            : order.status === 'Processing'
                                                            ? 'warning'
                                                            : order.status === 'Cancelled'
                                                            ? 'danger'
                                                            : 'secondary'
                                                    }
                                                    className={`status-badge status-${order.status.toLowerCase()}`}
                                                >
                                                    {order.status}
                                                </Badge>
                                            </Col>
                                            <Col md={3} className="text-center">
                                                ₹{order.totalPrice.toFixed(2)}
                                            </Col>
                                            <Col md={2}>
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    onClick={() => setViewingOrder(order)}
                                                    className="details-btn"
                                                >
                                                    View Details
                                                </Button>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Col>

                        <Col lg={4}>
                            <Card className="orders-summary">
                                <ListGroup variant="flush">
                                    <ListGroup.Item>
                                        <h2 className="orders-summary-title">Order Summary</h2>
                                        <p>Total Orders: <strong>{orders.length}</strong></p>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Button
                                            variant="success"
                                            className="w-100"
                                            onClick={() => alert('Redirect to order help page')}
                                        >
                                            Need Help?
                                        </Button>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card>
                        </Col>
                    </Row>
                )}
            </div>

            {viewingOrder && (
                <div className="order-detail-container">
                    <h2 className="order-detail-title">Order Details</h2>
                    <Button
                        variant="outline-secondary"
                        size="sm"
                        className="mb-3"
                        onClick={handleCloseOrderDetail}
                    >
                        Back to Orders
                    </Button>
                    <Card className="order-detail-card">
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <Row>
                                    <Col md={6}>
                                        <h5>Shipping Information</h5>
                                        <p>Name: {viewingOrder.name}</p>
                                        <p>Address: {viewingOrder.address}</p>
                                        <p>City: {viewingOrder.city}</p>
                                        <p>Postal Code: {viewingOrder.postalCode}</p>
                                        <p>Country: {viewingOrder.country}</p>
                                    </Col>
                                    <Col md={6}>
                                        <h5>Order Summary</h5>
                                        <p>Order ID: {viewingOrder._id}</p>
                                        <p>Date: {new Date(viewingOrder.createdAt).toLocaleString()}</p>
                                        <p>Status: <strong>{viewingOrder.status}</strong></p>
                                        <p>Total: ₹{viewingOrder.totalPrice.toFixed(2)}</p>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <h5>Items</h5>
                                {viewingOrder.items.map((item) => (
                                    <Row key={item.product._id} className="align-items-center mb-3">
                                        <Col md={2}>
                                            <img
                                                src={item.product.image}
                                                alt={item.product.name}
                                                className="order-item-image"
                                            />
                                        </Col>
                                        <Col md={4}>
                                            {item.product.name}
                                            <p className="text-muted small">Category: {item.product.category}</p>
                                        </Col>
                                        <Col md={3} className="text-center">
                                            Quantity: {item.qty}
                                        </Col>
                                        <Col md={3} className="text-end">
                                            ₹{(item.qty * item.product.price).toFixed(2)}
                                        </Col>
                                    </Row>
                                ))}
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </div>
            )}

            <Footer />
        </>
    );
}

export default Orders;
