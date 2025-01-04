// src/components/Products.jsx
import { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Alert, Dropdown, Card, Button, Form } from "react-bootstrap";
import { motion } from "framer-motion";
import Footer from "../components/Footer";
import { API_URL } from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Products.css";

function Products() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [priceRange, setPriceRange] = useState([0, 10000]);

    const navigate = useNavigate();

    // 📦 Fetch Products and Categories
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${API_URL}/products`);
                if (!response.ok) {
                    throw new Error("Failed to fetch products");
                }
                const data = await response.json();

                const uniqueCategories = ["All", ...new Set(data.map((product) => product.category || "Uncategorized"))];
                setProducts(data);
                setFilteredProducts(data);
                setCategories(uniqueCategories);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // 🛍️ Handle Category Change
    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        applyFilters(searchQuery, category, priceRange);
    };

    // 🔍 Handle Search Query
    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        applyFilters(query, selectedCategory, priceRange);
    };

    // 💵 Handle Price Filter
    const handlePriceChange = (e) => {
        const { name, value } = e.target;
        setPriceRange((prev) => (name === "min" ? [Number(value), prev[1]] : [prev[0], Number(value)]));
    };

    // 🛠️ Apply All Filters
    const applyFilters = (query, category, price) => {
        let filtered = products;

        if (category !== "All") {
            filtered = filtered.filter((product) => product.category === category);
        }

        if (query) {
            filtered = filtered.filter((product) =>
                product.name.toLowerCase().includes(query.toLowerCase())
            );
        }

        filtered = filtered.filter(
            (product) => product.price >= price[0] && product.price <= price[1]
        );

        setFilteredProducts(filtered);
    };

    // 🛒 Render UI
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* 📝 Header Section */}
            <Container className="my-5 text-center">
                <h2 className="fw-bold section-title">🛍️ Explore Our Products</h2>
                <p className="text-secondary section-subtitle">Find what you need from our curated collection.</p>
            </Container>

            {/* 🔍 Search and Filter Bar */}
            <Container className="mb-4">
                <Row className="align-items-center g-3">
                    {/* Search Bar */}
                    <Col md={4}>
                        <Form.Control
                            type="text"
                            placeholder="🔍 Search Products..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="search-bar"
                        />
                    </Col>

                    {/* Category Dropdown */}
                    <Col md={3}>
                        <Dropdown>
                            <Dropdown.Toggle variant="outline-dark" id="dropdown-basic">
                                {selectedCategory}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {categories.map((category) => (
                                    <Dropdown.Item
                                        key={category}
                                        onClick={() => handleCategoryChange(category)}
                                    >
                                        {category}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>

                    {/* Price Filter */}
                    <Col md={5} className="d-flex gap-2">
                        <Form.Control
                            type="number"
                            name="min"
                            value={priceRange[0]}
                            placeholder="Min Price"
                            onChange={handlePriceChange}
                        />
                        <Form.Control
                            type="number"
                            name="max"
                            value={priceRange[1]}
                            placeholder="Max Price"
                            onChange={handlePriceChange}
                        />
                        <Button variant="outline-primary" onClick={() => applyFilters(searchQuery, selectedCategory, priceRange)}>
                            Apply
                        </Button>
                    </Col>
                </Row>
            </Container>

            {/* 🛒 Product Grid */}
            <Container>
                {loading ? (
                    <div className="loading-container text-center py-5">
                        <Spinner animation="border" role="status" variant="primary" />
                        <p>Loading products...</p>
                    </div>
                ) : error ? (
                    <Alert variant="danger" className="text-center">
                        {error}
                    </Alert>
                ) : filteredProducts.length === 0 ? (
                    <Alert variant="warning" className="text-center">
                        No products found.
                    </Alert>
                ) : (
                    <Row className="g-4">
                        {filteredProducts.map((product) => (
                            <Col key={product._id} xs={12} sm={6} md={4} lg={3}>
                                <motion.div whileHover={{ scale: 1.05 }}>
                                    <Card className="shadow product-card">
                                        <div className="product-image-container">
                                            <Card.Img
                                                src={product.image || "/assets/product-placeholder.jpg"}
                                                className="product-img"
                                            />
                                        </div>
                                        <Card.Body className="product-card-body">
                                            <Card.Title className="product-title">{product.name}</Card.Title>
                                            <Card.Text className="product-price">₹{product.price?.toFixed(2)}</Card.Text>
                                            <Button variant="primary" onClick={() => navigate(`/products/${product._id}`)}>
                                                View Details
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </motion.div>
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>

            {/* 📊 Footer */}
            <Footer />
        </motion.div>
    );
}

export default Products;
