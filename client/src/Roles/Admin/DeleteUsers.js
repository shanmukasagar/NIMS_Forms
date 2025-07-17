import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import axiosInstance from "../../components/AxiosInstance";

const DeleteUser = () => {
    const [empCode, setEmpCode] = useState('');
    const [openConfirm, setOpenConfirm] = useState(false);
    const [message, setMessage] = useState('');

    const handleDeleteClick = () => {
        if (!empCode.trim()) {
            setMessage("Employee code is required.");
            return;
        }
        setOpenConfirm(true);
    };

    const handleConfirmDelete = async () => {
        try {
            const res = await axiosInstance.get("/api/user/delete", {
                params : { emp_code : Number(empCode)}
            });
            alert(res.data);
        } catch (err) {
            alert(err.response?.data || 'Delete failed');
        } finally {
            setOpenConfirm(false);
            setEmpCode('');
        }
    };

    return (
        <Box sx={{ maxWidth: 400, margin: 'auto', mt: 5 }}>
            <Typography variant="h5" gutterBottom>Delete User</Typography>

            <TextField
                label="Employee Code"
                value={empCode}
                onChange={(e) => setEmpCode(e.target.value)}
                fullWidth
                type="number"
                margin="normal"
            />

            <Button
                variant="contained"
                color="error"
                fullWidth
                onClick={handleDeleteClick}
            >
                Delete User
            </Button>

            {message && (
                <Typography color="primary" sx={{ mt: 2 }}>
                    {message}
                </Typography>
            )}

            <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the user with Employee Code <strong>{empCode}</strong>?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained">Delete</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default DeleteUser;
