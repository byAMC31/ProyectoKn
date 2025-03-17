import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';

const EditUserForm = ({ open, onClose, user, onUserUpdated }) => {
    const [formData, setFormData] = useState({ firstName: '', email: '', phoneNumber: '', role: '', status: '' });

    useEffect(() => {
        if (user) {
            setFormData(user);
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/v1/users/${user.id}`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            Swal.fire('Success!', 'User updated successfully.', 'success');
            onUserUpdated();
            onClose();
        } catch (error) {
            console.error('Error updating user:', error);
            Swal.fire('Error!', 'Failed to update user.', 'error');
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ p: 3, bgcolor: 'white', width: 400, margin: 'auto', mt: 10, borderRadius: 2 }}>
                <h2>Edit User</h2>
                <form onSubmit={handleSubmit}>
                    <TextField name="firstName" label="Name" value={formData.firstName} onChange={handleChange} fullWidth margin="normal" />
                    <TextField name="email" label="Email" value={formData.email} onChange={handleChange} fullWidth margin="normal" />
                    <TextField name="phoneNumber" label="Phone Number" value={formData.phoneNumber} onChange={handleChange} fullWidth margin="normal" />
                    <TextField name="role" label="Role" value={formData.role} onChange={handleChange} fullWidth margin="normal" />
                    <TextField name="status" label="Status" value={formData.status} onChange={handleChange} fullWidth margin="normal" />
                    <Button type="submit" variant="contained" color="primary" fullWidth>Save</Button>
                </form>
            </Box>
        </Modal>
    );
};

export default EditUserForm;
