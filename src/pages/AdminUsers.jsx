// src/pages/AdminUsers.jsx

import { useEffect, useState } from 'react';
import { Container, Table, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    // Fetch all users from API
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Replace with your actual API endpoint
                const response = await fetch('/api/admin/users', {
                    headers: {
                        'Content-Type': 'application/json',
                        // Include authorization headers if required
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                const data = await response.json();
                setUsers(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleDelete = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        try {
            // Replace with your actual API endpoint
            const response = await fetch(`/api/admin/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    // Include authorization headers if required
                },
            });
            if (!response.ok) {
                throw new Error('Failed to delete user');
            }
            setMessage('User deleted successfully');
            setUsers(users.filter(user => user._id !== userId));
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Container className="my-5">
                <h2 className="mb-4 text-center">Manage Users</h2>
                {message && <Alert variant="success">{message}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}
                {loading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                        <Spinner animation="border" role="status" variant="primary">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                ) : (
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Admin</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id}>
                                    <td>{user._id}</td>
                                    <td>{user.name}</td>
                                    <td>
                                        <a href={`mailto:${user.email}`}>{user.email}</a>
                                    </td>
                                    <td>
                                        {user.isAdmin ? (
                                            <Badge bg="success">Yes</Badge>
                                        ) : (
                                            <Badge bg="secondary">No</Badge>
                                        )}
                                    </td>
                                    <td>
                                        <Link to={`/admin/users/${user._id}/edit`}>
                                            <Button variant="light" size="sm">
                                                <i className="fas fa-edit"></i>
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            className="ms-2"
                                            onClick={() => handleDelete(user._id)}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Container>
        </motion.div>
    );
}

export default AdminUsers;
