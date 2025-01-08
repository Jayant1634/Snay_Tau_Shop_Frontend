// src/pages/Login.jsx

import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { API_URL } from '../services/api';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Simple Validation
        if (!email || !password) {
            setError('Please fill in both email and password fields.');
            setLoading(false);
            return;
        }

        try {
            const res = await axios.post(`${API_URL}/auth/login`, {
                email,
                password,
                role,
            });

            const { token } = res.data;
            localStorage.setItem('token', token);

            // Redirect based on role
            if (role === 'admin') {
                // navigate('/admin/products');
                window.location.href = '/admin/products';
            } else {
                window.location.href = '/dashboard';
                // navigate('/dashboard');
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container fluid className="login-page bg-light">
            <Row className="vh-100">
                <Col md={{ span: 6, offset: 3 }} className="d-flex justify-content-center align-items-center">
                    <div className="login-box shadow-lg p-5 rounded bg-white">
                        <h3 className="text-center mb-4 text-primary fw-bold">Login</h3>
                        {error && <Alert variant="danger" className="text-center">{error}</Alert>}

                        <Form onSubmit={handleSubmit} noValidate>
                            {/* Email Field */}
                            <Form.Group controlId="formEmail" className="mb-3">
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="Enter your email"
                                />
                            </Form.Group>

                            {/* Password Field */}
                            <Form.Group controlId="formPassword" className="mb-3">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="Enter your password"
                                />
                            </Form.Group>

                            {/* Role Selection */}
                            <Form.Group controlId="formRole" className="mb-4">
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

                            {/* Login Button */}
                            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                        />{' '}
                                        Logging in...
                                    </>
                                ) : (
                                    'Login'
                                )}
                            </Button>
                        </Form>

                        {/* Redirect to Signup */}
                        <p className="text-center mt-3">
                            Dont have an account?{' '}
                            <a href="/signup" className="text-primary">
                                Sign Up
                            </a>
                        </p>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default Login;
