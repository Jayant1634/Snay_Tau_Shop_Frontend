import { Container, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import farmAnimation from '../assets/lottie/hero_animation.json'; // Ensure correct path
import './Hero.css';

function Hero() {
    return (
        <div className="hero">
            {/* Overlay for better readability */}
            <div className="hero-overlay"></div>

            {/* Content Section */}
            <Container fluid className="hero-content px-0"> {/* Removed padding on left and right */}
                <Row className="align-items-center justify-content-center gx-0"> {/* Removed gutter space */}
                    {/* Left Side: Text and Button */}
                    <Col md={7} lg={7} className="hero-text d-flex flex-column justify-content-center align-items-center text-center">
                        <motion.h1
                            className="hero-title"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                        >
                            🌾 Welcome to Kisaan Seva 🌿
                        </motion.h1>
                        <motion.p
                            className="hero-subtitle"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                        >
                            Empowering Farmers with Quality Products and Sustainable Solutions.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 1 }}
                        >
                            <Button
                                as={Link}
                                to="/products"
                                variant="success"
                                size="lg"
                                className="hero-button"
                            >
                                Explore Products 🌱
                            </Button>
                        </motion.div>
                    </Col>

                    {/* Right Side: Lottie Animation */}
                    <Col md={5} lg={5} className="hero-animation d-flex justify-content-center align-items-center">
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className="hero-lottie-wrapper"
                        >
                            <Lottie
                                animationData={farmAnimation}
                                loop
                                className="hero-lottie"
                            />
                        </motion.div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Hero;
