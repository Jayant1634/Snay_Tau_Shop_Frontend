// src/pages/Signup.jsx

import { useState, useContext } from 'react';
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { API_URL } from '../services/api';

function Signup() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password, role }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to signup');
            }

            const text = await response.text();
            if (!text) {
                throw new Error('Empty response from server');
            }
            const data = JSON.parse(text);
            login(data.token); // Assuming the API returns a token
            navigate('/');
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Container className="my-5">
                <Row className="justify-content-md-center">
                    <Col xs={12} md={6}>
                        <h2 className="mb-4 text-center">Sign Up</h2>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="name" className="mb-3">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter your name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="email" className="mb-3">
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="password" className="mb-3">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="role" className="mb-3">
                                <Form.Label>Role</Form.Label>
                                <Form.Check
                                    type="radio"
                                    label="User"
                                    name="role"
                                    value="user"
                                    checked={role === 'user'}
                                    onChange={(e) => setRole(e.target.value)}
                                />
                                <Form.Check
                                    type="radio"
                                    label="Admin"
                                    name="role"
                                    value="admin"
                                    checked={role === 'admin'}
                                    onChange={(e) => setRole(e.target.value)}
                                />
                            </Form.Group>

                            <Button variant="success" type="submit" disabled={loading} className="w-100">
                                {loading ? 'Signing up...' : 'Sign Up'}
                            </Button>
                        </Form>
                        <Row className="py-3">
                            <Col>
                                Already have an account? <Link to="/login">Login</Link>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </motion.div>
    );
}

export default Signup;
