// src/pages/Signup.jsx

import './Auth.css';
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
                body: JSON.stringify({ name, email, password }),
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
            className="auth-container"
        >
            <Container>
                <Row className="justify-content-center">
                    <Col md={6}>
                        <div className="auth-box">
                            <h3 className="auth-title">Create Account</h3>
                            {error && <Alert variant="danger" className="auth-alert">{error}</Alert>}
                            
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

                                <Button className="auth-btn w-100" type="submit" disabled={loading}>
                                    {loading ? 'Creating Account...' : 'Sign Up'}
                                </Button>
                            </Form>

                            <p className="redirect-text">
                                Already have an account? <Link to="/login" className="auth-link">Login</Link>
                            </p>
                        </div>
                    </Col>
                </Row>
            </Container>
        </motion.div>
    );
}

export default Signup;
