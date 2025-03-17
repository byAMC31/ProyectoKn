import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { TextField, MenuItem, Select, FormControl, InputLabel, Box, CircularProgress, Button } from '@mui/material';
import './Dashboard.css'; 

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
            const response = await axios.get(`http://localhost:5000/api/v1/users`, {
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
                    <Button onClick={() => console.log('Delete', params.row)} color="error">Delete</Button>
                </>
            )
        }
    ];



    return (
        <Box sx={{ height: 500, width: '100%' }}>
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