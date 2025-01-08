import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Image, ListGroup, Button, Spinner, Alert, Form } from "react-bootstrap";
import { motion } from "framer-motion";
import { API_URL } from "../services/api";
import Footer from "../components/Footer";
import "./ProductPage.css";

function ProductPage() {
    const { id } = useParams();
    const [product, setProduct] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [qty, setQty] = useState(1);
    const [selectedSize, setSelectedSize] = useState('');
    const [addingToCart, setAddingToCart] = useState(false);
    // const [selectedQty, setSelectedQty] = useState(1);
    

    // 📦 Fetch Product Details
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`${API_URL}/products/${id}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch product details");
                }
                const data = await response.json();
                setProduct(data);
                if (data.sizes && data.sizes.length > 0) {
                    setSelectedSize(data.sizes[0]);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    // 🛒 Handle Add to Cart
    const handleAddToCart = async () => {
        try {
            if (!selectedSize && product.sizes?.length > 0) {
                alert("Please select a size");
                return;
            }

            setAddingToCart(true);
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Please log in to add items to your cart");
                return;
            }

            const response = await fetch(`${API_URL}/cart`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    productId: product._id,
                    qty,
                    size: selectedSize,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to add product to cart");
            }

            alert(`Successfully added ${qty} x ${product.name} to your cart!`);
        } catch (err) {
            alert(err.message || "Failed to add product to cart");
        } finally {
            setAddingToCart(false);
        }
    };

    //🔄 Loading State
    if (loading) {
        return (
            <div className="product-loading-container">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    // ❌ Error State
    if (error) {
        return (
            <Container className="error-container">
                <Alert variant="danger">{error}</Alert>
                <Link to="/products" className="btn btn-primary mt-3">
                    Go Back to Products
                </Link>
            </Container>
        );
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Container className="product-page-container">
                {/* Back Button */}
                <Button variant="outline-primary" className="mb-4" as={Link} to="/products">
                    ← Back to Products
                </Button>

                {/* Product Details */}
                <Row className="product-content">
                    {/* Product Image Section */}
                    <Col md={6} className="product-image-section">
                        <div className="product-image-wrapper">
                            <Image
                                src={product.image || "/assets/product-placeholder.jpg"}
                                alt={product.name || "Product Image"}
                                fluid
                                className="product-image"
                            />
                        </div>
                    </Col>

                    {/* Product Info Section */}
                    <Col md={6}>
                        <div className="product-details-box">
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <h2 className="product-title">{product.name || "Product Name"}</h2>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <p className="product-price"> 💵  Price: <strong>₹{product.price?.toFixed(2) || "N/A"}</strong></p>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <p className="product-category">🏷️ Category: {product.category || "Uncategorized"}</p>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <p className="product-description">
                                        📝 {product.description?.slice(0, 120) || "No description available"}...
                                    </p>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <p className="product-status">
                                        {product.stock > 0 ? "✅ In Stock" : "❌ Out of Stock"}
                                    </p>
                                </ListGroup.Item>

                                {/* Size Selector */}
                                {product.sizes && product.sizes.length > 0 && (
                                    <ListGroup.Item>
                                        <Row>
                                            <Col xs={6}>Size:</Col>
                                            <Col xs={6}>
                                                <Form.Control
                                                    as="select"
                                                    value={selectedSize}
                                                    onChange={(e) => setSelectedSize(e.target.value)}
                                                    className="size-selector"
                                                >
                                                    {product.sizes.map((sizeObj, index) => (
                                                        <option key={index} value={sizeObj.size}>
                                                            {sizeObj.size} ({sizeObj.stock} available)
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                )}

                                {/* Quantity Selector */}
                                {product.sizes && selectedSize && (
                                    <ListGroup.Item>
                                        <Row>
                                            <Col xs={6}>Quantity:</Col>
                                            <Col xs={6}>
                                                <Form.Control
                                                    as="select"
                                                    value={qty}
                                                    onChange={(e) => setQty(Number(e.target.value))}
                                                    className="quantity-selector"
                                                >
                                                    {[...Array(Math.min(10, product.sizes.find(s => s.size === selectedSize)?.stock || 0))].map((_, index) => (
                                                        <option key={index + 1} value={index + 1}>
                                                            {index + 1}
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                )}

                                {/* Add to Cart Button */}
                                <ListGroup.Item>
                                    <Button
                                        className="add-to-cart-btn"
                                        variant="success"
                                        disabled={product.stock === 0 || addingToCart}
                                        onClick={handleAddToCart}
                                    >
                                        {addingToCart ? (
                                            <Spinner animation="border" size="sm" />
                                        ) : (
                                            "Add To Cart"
                                        )}
                                    </Button>
                                </ListGroup.Item>
                            </ListGroup>
                        </div>
                    </Col>
                </Row>
            </Container>

            {/* Footer */}
            <Footer />
        </motion.div>
    );
}

export default ProductPage;
