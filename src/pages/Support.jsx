// src/pages/Support.jsx
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import './Support.css';

function Support() {
    return (
        <Container className="support-container mt-5">
            <h1 className="text-center mb-4">Customer Support 📞</h1>
            <Row>
                {/* Contact Details */}
                <Col md={6}>
                    <Card className="support-card mb-4 shadow-sm">
                        <Card.Body>
                            <h4>📧 Email Support</h4>
                            <p>support@kisaankrishiseva.com</p>
                            <h4>📱 Phone Support</h4>
                            <p>+91-9876543210</p>
                            <h4>📍 Address</h4>
                            <p>123, Farmers Street, Agriculture City</p>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Contact Form */}
                <Col md={6}>
                    <Card className="support-card shadow-sm">
                        <Card.Body>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type="text" placeholder="Enter your name" />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" placeholder="Enter your email" />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Message</Form.Label>
                                    <Form.Control as="textarea" rows={4} placeholder="Your message" />
                                </Form.Group>
                                <Button variant="primary" type="submit">
                                    Submit
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Support;
