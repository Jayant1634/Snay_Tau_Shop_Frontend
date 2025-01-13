import { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { FiShoppingBag, FiArrowLeft } from "react-icons/fi";
import { API_URL } from "../services/api";
import "./ProductPage.css";

function ProductPage() {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [addingToCart, setAddingToCart] = useState(false);
    const [qty, setQty] = useState(1);
    const [selectedSize, setSelectedSize] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`${API_URL}/products/${id}`);
                if (!response.ok) {
                    throw new Error("Product not found");
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

    if (loading) {
        return (
            <div className="loading-container">
                <Spinner animation="border" role="status" />
                <span>Loading product details...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <Alert variant="danger">
                    {error}
                    <Button 
                        variant="link" 
                        className="d-block mt-3"
                        onClick={() => navigate('/products')}
                    >
                        <FiArrowLeft /> Back to Products
                    </Button>
                </Alert>
            </div>
        );
    }

    return (
        <div className="product-page">
            <Container>
                <Button
                    variant="link"
                    className="back-button"
                    onClick={() => navigate('/products')}
                >
                    <FiArrowLeft /> Back to Products
                </Button>

                <div className="product-content">
                    <Row>
                        <Col md={6} className="product-image-section">
                            <div className="product-image-wrapper">
                                <img
                                    src={product.image || "/assets/product-placeholder.jpg"}
                                    alt={product.name}
                                    className="product-image"
                                />
                            </div>
                        </Col>

                        <Col md={6} className="product-details">
                            <div className="product-info">
                                <h1 className="product-title">{product.name}</h1>
                                <div className="product-meta">
                                    <span className="product-category">{product.category}</span>
                                    <span className="product-price">₹{product.price?.toFixed(2)}</span>
                                </div>
                                <p className="product-description">{product.description}</p>
                                
                                <div className="product-actions">
                                    {product.sizes && product.sizes.length > 0 && (
                                        <div className="size-selector">
                                            <label>Size:</label>
                                            <select 
                                                value={selectedSize} 
                                                onChange={(e) => setSelectedSize(e.target.value)}
                                                disabled={product.stock === 0}
                                            >
                                                {product.sizes.map((size, index) => (
                                                    <option key={index} value={size}>
                                                        {size}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    <div className="quantity-selector">
                                        <label>Quantity:</label>
                                        <select 
                                            value={qty} 
                                            onChange={(e) => setQty(Number(e.target.value))}
                                            disabled={product.stock === 0}
                                        >
                                            {[...Array(Math.min(10, product.stock || 0))].map((_, i) => (
                                                <option key={i + 1} value={i + 1}>
                                                    {i + 1}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="stock-status">
                                        {product.stock > 0 ? (
                                            <span className="in-stock">In Stock ({product.stock} available)</span>
                                        ) : (
                                            <span className="out-of-stock">Out of Stock</span>
                                        )}
                                    </div>

                                    <Button 
                                        className="add-to-cart-btn"
                                        disabled={product.stock === 0 || addingToCart}
                                        onClick={handleAddToCart}
                                    >
                                        {addingToCart ? (
                                            <>
                                                <Spinner animation="border" size="sm" />
                                                <span>Adding to Cart...</span>
                                            </>
                                        ) : (
                                            <>
                                                <FiShoppingBag size={18} />
                                                <span>Add to Cart</span>
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Container>
        </div>
    );
}

export default ProductPage;
