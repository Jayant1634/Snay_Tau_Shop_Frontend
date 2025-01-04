import { useState } from 'react';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { API_URL } from '../services/api'; // Ensure API_URL points to your backend base URL

function AdminAddProduct() {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const token = localStorage.getItem('token'); // Retrieve token from localStorage

            const response = await fetch(`${API_URL}/products`, { // Correct path
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Include Authorization Token
                },
                body: JSON.stringify({
                    name,
                    price: parseFloat(price),
                    stock: parseInt(stock, 10),
                    category,
                    description,
                    image,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add product');
            }

            setSuccess('Product added successfully!');
            setTimeout(() => navigate('/admin/products'), 2000);
        } catch (err) {
            setError(err.message || 'Failed to add product');
        } finally {
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
                <h2 className="mb-4 text-center">Add New Product</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                <Form onSubmit={handleSubmit}>
                    {/* Product Name */}
                    <Form.Group className="mb-3" controlId="productName">
                        <Form.Label>Product Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter product name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </Form.Group>

                    {/* Price */}
                    <Form.Group className="mb-3" controlId="productPrice">
                        <Form.Label>Price</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter product price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </Form.Group>

                    {/* Stock */}
                    <Form.Group className="mb-3" controlId="productStock">
                        <Form.Label>Stock</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter product stock"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            required
                        />
                    </Form.Group>

                    {/* Category */}
                    <Form.Group className="mb-3" controlId="productCategory">
                        <Form.Label>Category</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter product category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                        />
                    </Form.Group>

                    {/* Description */}
                    <Form.Group className="mb-3" controlId="productDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Enter product description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </Form.Group>

                    {/* Image URL */}
                    <Form.Group className="mb-3" controlId="productImage">
                        <Form.Label>Image URL</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter image URL"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                        />
                    </Form.Group>

                    {/* Submit Button */}
                    <Button variant="primary" type="submit" disabled={loading} className="w-100">
                        {loading ? (
                            <>
                                <Spinner animation="border" size="sm" /> Adding Product...
                            </>
                        ) : (
                            'Add Product'
                        )}
                    </Button>
                </Form>
            </Container>
        </motion.div>
    );
}

export default AdminAddProduct;
