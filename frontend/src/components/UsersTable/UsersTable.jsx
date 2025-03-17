import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { DataGrid } from '@mui/x-data-grid';
import { TextField, MenuItem, Select, FormControl, InputLabel, Box, CircularProgress, Button } from '@mui/material';
import './UsersTable.css'; 

const urlbase = "http://localhost:5000/api/v1";

const UsersTable = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [role, setRole] = useState('');
    const [status, setStatus] = useState('');
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });
    const [rowCount, setRowCount] = useState(0);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${urlbase}/users`, {
                params: { 
                    page: paginationModel.page + 1, 
                    limit: paginationModel.pageSize, 
                    role, 
                    status, 
                    search 
                },
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data.users);
            setRowCount(response.data.totalUsers); 
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [paginationModel, role, status, search]);

    const handleDeleteUser = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This action cannot be undone!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const token = localStorage.getItem('token');
                    await axios.delete(`${urlbase}/users/${id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    Swal.fire('Deleted!', 'User has been deleted.', 'success');

                    // Actualizar la lista de usuarios
                    fetchUsers();
                } catch (error) {
                    console.error('Error deleting user:', error);
                    Swal.fire('Error!', 'Failed to delete user.', 'error');
                }
            }
        });
    };

    const columns = [
        { field: 'id', headerName: 'ID', flex: 1 },
        { field: 'firstName', headerName: 'Name', flex: 1 },
        { field: 'email', headerName: 'Email', flex: 1 },
        { field: 'phoneNumber', headerName: 'Phone Number', flex: 1 },
        { field: 'role', headerName: 'Role', flex: 1 },
        { field: 'status', headerName: 'Status', flex: 1 },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            renderCell: (params) => (
                <>
                    <Button onClick={() => console.log('Edit', params.row)}>Edit</Button>
                    <Button onClick={() => handleDeleteUser(params.row.id)} color="error">
                        Delete
                    </Button>
                </>
            ),
        },
    ];

    return (
        <Box sx={{ height: 400, width: '100%' }}>
            <Box display="flex" gap={2} mb={2}>
                <TextField label="Search" value={search} onChange={(e) => setSearch(e.target.value)} fullWidth />

                <FormControl fullWidth>
                    <InputLabel id="role-label">Role</InputLabel>
                    <Select
                        labelId="role-label"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        label="Role"
                    >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="Admin">Admin</MenuItem>
                        <MenuItem value="User">User</MenuItem>
                    </Select>
                </FormControl>

                <FormControl fullWidth>
                    <InputLabel id="status-label">Status</InputLabel>
                    <Select
                        labelId="status-label"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        label="Status"
                    >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Inactive">Inactive</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {loading ? (
                <CircularProgress />
            ) : (
                <DataGrid
                    rows={users}
                    columns={columns}
                    rowCount={rowCount}
                    paginationMode="server"
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    pageSizeOptions={[10, 25, 50, 100]}
                    loading={loading}
                    className="custom-data-grid" 
                />
            )}
        </Box>
    );
};

export default UsersTable;
