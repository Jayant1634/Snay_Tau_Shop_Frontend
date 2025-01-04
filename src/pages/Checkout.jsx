import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, ListGroup, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { API_URL } from '../services/api';
import './Checkout.css';

function Checkout() {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Credit Card');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [cartItems, setCartItems] = useState([]); // Store cart items
    const [itemTotal, setItemTotal] = useState(0); // Store total price of items
    const shippingFee = 100; // Fixed shipping fee

    const navigate = useNavigate();

    // 📦 Fetch Cart Items
    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('You must be logged in to proceed to checkout');
                }

                const response = await fetch(`${API_URL}/cart`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch cart items');
                }

                const data = await response.json();
                setCartItems(data);

                // Calculate the total price of all cart items
                const total = data.reduce((acc, item) => acc + (item.product?.price || 0) * item.qty, 0);
                setItemTotal(total);
            } catch (err) {
                setError(err.message || 'Failed to fetch cart items');
            }
        };

        fetchCartItems();
    }, []);

    // 🛒 Handle Place Order
    const handlePlaceOrder = async () => {
        if (!name || !address || !city || !postalCode || !country || !paymentMethod) {
            setError('Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('You must be logged in to place an order');
            }

            const response = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name,
                    address,
                    city,
                    postalCode,
                    country,
                    paymentMethod,
                    items: cartItems,
                    totalAmount: itemTotal + shippingFee,
                    shippingFee,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to place order');
            }

            alert('🎉 Order placed successfully!');
            navigate('/order-success');
        } catch (err) {
            setError(err.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Container className="checkout-container my-5">
                <h1 className="checkout-title text-center mb-4 fw-bold">🛒 Checkout</h1>

                {error && <Alert variant="danger" className="text-center">{error}</Alert>}

                <Row>
                    {/* Delivery Details */}
                    <Col md={8}>
                        <Card className="mb-4 shadow-sm">
                            <Card.Header className="fw-bold">📦 Delivery Details</Card.Header>
                            <Card.Body>
                                <Form>
                                    <Form.Group controlId="name" className="mb-3">
                                        <Form.Label>Full Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter your full name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </Form.Group>

                                    <Form.Group controlId="address" className="mb-3">
                                        <Form.Label>Address</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter your address"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                        />
                                    </Form.Group>

                                    <Row>
                                        <Col>
                                            <Form.Group controlId="city" className="mb-3">
                                                <Form.Label>City</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter your city"
                                                    value={city}
                                                    onChange={(e) => setCity(e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group controlId="postalCode" className="mb-3">
                                                <Form.Label>Postal Code</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter postal code"
                                                    value={postalCode}
                                                    onChange={(e) => setPostalCode(e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Form.Group controlId="country" className="mb-3">
                                        <Form.Label>Country</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter your country"
                                            value={country}
                                            onChange={(e) => setCountry(e.target.value)}
                                        />
                                    </Form.Group>
                                </Form>
                            </Card.Body>
                        </Card>

                        {/* Payment Method */}
                        <Card className="mb-4 shadow-sm">
                            <Card.Header className="fw-bold">💳 Payment Method</Card.Header>
                            <Card.Body>
                                <Form>
                                    <Form.Check
                                        type="radio"
                                        label="Credit Card"
                                        name="paymentMethod"
                                        value="Credit Card"
                                        checked={paymentMethod === 'Credit Card'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    <Form.Check
                                        type="radio"
                                        label="Debit Card"
                                        name="paymentMethod"
                                        value="Debit Card"
                                        checked={paymentMethod === 'Debit Card'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    <Form.Check
                                        type="radio"
                                        label="PayPal"
                                        name="paymentMethod"
                                        value="PayPal"
                                        checked={paymentMethod === 'PayPal'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Order Summary */}
                    <Col md={4}>
                        <Card className="shadow-sm">
                            <Card.Header className="fw-bold">📝 Order Summary</Card.Header>
                            <ListGroup variant="flush">
                                <ListGroup.Item><strong>Items:</strong> ₹{itemTotal.toFixed(2)}</ListGroup.Item>
                                <ListGroup.Item><strong>Shipping:</strong> ₹{shippingFee.toFixed(2)}</ListGroup.Item>
                                <ListGroup.Item><strong>Total:</strong> ₹{(itemTotal + shippingFee).toFixed(2)}</ListGroup.Item>
                                <ListGroup.Item>
                                    <Button
                                        variant="success"
                                        className="w-100"
                                        onClick={handlePlaceOrder}
                                        disabled={loading}
                                    >
                                        {loading ? 'Placing Order...' : 'Place Order'}
                                    </Button>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* Footer */}
            <Footer />
        </>
    );
}

export default Checkout;
