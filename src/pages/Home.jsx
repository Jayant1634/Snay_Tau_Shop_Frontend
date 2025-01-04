// import { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Footer from "../components/Footer"; // Ensure the path is correct
import Hero from "../components/Hero";
import { motion } from "framer-motion";
import "./Home.css"; // Import the CSS file for styling

function Home() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Hero Section */}
            <Hero />

            {/* Owner & Location Section */}
            <section className="owner-location py-5">
                <Container>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-4"
                    >
                        <h2 className="fw-bold section-title">🏬 Owner & Location</h2>
                        <p className="text-secondary section-subtitle">
                            Meet the owner and find us easily on Google Maps.
                        </p>
                    </motion.div>

                    <Row className="g-4 align-items-center">
                        {/* Owner Information */}
                        <Col md={6}>
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                className="owner-info p-4 shadow-sm rounded-3"
                            >
                                <h4 className="fw-bold mb-3">👤 Owner: Rajesh Kumar</h4>
                                <p>
                                    With over 15 years of experience in the agricultural sector, Rajesh Kumar is dedicated to providing high-quality farming products and exceptional customer service.
                                </p>
                                <p>
                                    <strong>Contact:</strong> +91 98765 43210
                                </p>
                                <p>
                                    <strong>Email:</strong> rajesh.kumar@example.com
                                </p>
                            </motion.div>
                        </Col>

                        {/* Google Map Location */}
                        <Col md={6}>
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                className="map-container rounded-3 shadow-sm"
                            >
                                <iframe
                                    title="Shop Location"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.1929812740673!2d-122.0842494846819!3d37.421999779819095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fb5e30d4c5e6b%3A0xa1c3b3b59a33e9a2!2sGoogleplex!5e0!3m2!1sen!2sin!4v1697971234567!5m2!1sen!2sin"
                                    width="100%"
                                    height="350"
                                    style={{ border: "0" }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </motion.div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Call-to-Action Section */}
            <section className="cta-section text-center py-5 my-5">
                <Container>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h3 className="fw-bold">🚀 Visit Us Today!</h3>
                        <p className="mb-4">
                            Drop by our store or contact us for more information.
                        </p>
                        <Button variant="success" className="fw-medium px-4 py-2">
                            Get in Touch
                        </Button>
                    </motion.div>
                </Container>
            </section>

            {/* Testimonials Section */}
            <section className="testimonials py-5 bg-light">
                <Container>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-4"
                    >
                        <h2 className="fw-bold section-title">💬 What Our Customers Say</h2>
                        <p className="text-secondary section-subtitle">
                            Hear from our happy customers about their experiences.
                        </p>
                    </motion.div>
                    <Row className="g-4">
                        <Col md={4}>
                            <div className="testimonial-card p-3 shadow-sm rounded-3 bg-white">
                                <p>Excellent quality products and great customer support!</p>
                                <h6 className="fw-bold">– Rahul Sharma</h6>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="testimonial-card p-3 shadow-sm rounded-3 bg-white">
                                <p>Fast delivery and reliable service every time.</p>
                                <h6 className="fw-bold">– Anjali Verma</h6>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="testimonial-card p-3 shadow-sm rounded-3 bg-white">
                                <p>Highly recommended for all farming needs!</p>
                                <h6 className="fw-bold">– Amit Patel</h6>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Footer */}
            <Footer />
        </motion.div>
    );
}

export default Home;
