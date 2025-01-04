import { Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import './Footer.css'; // Import CSS for Footer styles

function Footer() {
    return (
        <motion.footer
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="footer">
                <Container>
                    <Row className="footer-top">
                        {/* About Section */}
                        <Col md={4} className="mb-4">
                            <h5 className="footer-title">🌾 Kisaan Seva</h5>
                            <p>Your trusted partner for agricultural solutions and high-quality tractor parts.</p>
                        </Col>

                        {/* Quick Links */}
                        <Col md={4} className="mb-4">
                            <h5 className="footer-title">Quick Links</h5>
                            <ul className="footer-links list-unstyled">
                                <li>
                                    <a href="/about">About Us</a>
                                </li>
                                <li>
                                    <a href="/contact">Contact</a>
                                </li>
                                <li>
                                    <a href="/privacy">Privacy Policy</a>
                                </li>
                                <li>
                                    <a href="/terms">Terms of Service</a>
                                </li>
                            </ul>
                        </Col>

                        {/* Contact Section */}
                        <Col md={4} className="mb-4">
                            <h5 className="footer-title">Contact Us</h5>
                            <p>Email: <a href="mailto:support@kisaanseva.com">support@kisaanseva.com</a></p>
                            <p>Phone: +91 98765 43210</p>
                            <p>Address: 123 Agri Lane, Greenfield, India</p>
                        </Col>
                    </Row>

                    {/* Copyright Section */}
                    <Row>
                        <Col className="text-center footer-bottom">
                            <p>&copy; {new Date().getFullYear()} Kisaan Seva. All Rights Reserved.</p>
                        </Col>
                    </Row>
                </Container>
            </div>
        </motion.footer>
    );
}

export default Footer;
