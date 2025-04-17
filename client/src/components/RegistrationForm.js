import React, { useState } from 'react';
import { Box, TextField, Button, InputAdornment, IconButton, Typography } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../styles/RegistrationForm.css";

const AuthForm = () => {
    const [isRegistering, setIsRegistering] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '', mobile: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => // Handle change
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => { //Handle submit
        e.preventDefault();
        setError('');

        const { username, email, password, confirmPassword, mobile } = formData;

        if (!/\S+@\S+\.\S+/.test(email)) return setError('Valid email required');
        if (!password || password.length < 6) return setError('Password too short');

        if (isRegistering) {
            if (!username.trim()) return setError('Username required');
            if (password !== confirmPassword) return setError('Passwords do not match');
            if (!/^\d{10}$/.test(mobile)) return setError('Valid 10-digit mobile required');

            try {
                const res = await axios.post('http://localhost:4000/api/user/register', formData, { withCredentials: true });
                alert(res.data);
                navigate('/');
                return ;
            } catch (err) {
                setError(err.response?.data || 'Registration failed');
            }
        } else {
            try {
                const res = await axios.post('http://localhost:4000/api/user/login', { email, password }, { withCredentials: true });
                navigate('/');
            } catch (err) {
                setError(err.response?.data || 'Login failed');
            }
        }
    };

    const inputProps = { endAdornment: (
        <InputAdornment position="end">
            <IconButton onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
        </InputAdornment>
    )};

    const handleLoginRegister = () => { //Handle login and register buttons
        setIsRegistering(!isRegistering);
        setError("");
        setFormData({ username: '', email: '', password: '', confirmPassword: '', mobile: '' });
    }

    return (
        <Box className = "registration_main">
            <Box className = "registration-container">
                <Typography sx = {{textAlign : "center", fontSize : "24px", fontWeight : "600"}}> {isRegistering ? 'Register' : 'Login'}</Typography>
                {error && <Typography color="error" className = "registration-error">{error}</Typography>}
                <form onSubmit={handleSubmit} className = "form_container">
                    {isRegistering && (
                        <React.Fragment>
                            <TextField label="Username" name="username" fullWidth value={formData.username} 
                                onChange={handleChange} required />
                            <TextField label="Email" name="email" type="email" fullWidth value={formData.email}
                                onChange={handleChange} required />
                            <TextField label="Mobile" name="mobile" fullWidth value={formData.mobile}
                                onChange={handleChange} required inputProps={{ maxLength: 10 }} />
                            <TextField label="Password" name="password" type={showPassword ? 'text' : 'password'}
                                fullWidth value={formData.password} onChange={handleChange} required InputProps={inputProps} />
                            <TextField label="Confirm Password" name="confirmPassword" type={showPassword ?
                                'text' : 'password'} fullWidth value={formData.confirmPassword} 
                                    onChange={handleChange} required InputProps={inputProps} />
                        </React.Fragment>
                    )}
                    {!isRegistering && (
                    <React.Fragment>
                        <TextField label="Email" name="email" type="email" fullWidth value={formData.email} 
                            onChange={handleChange} required />
                        <TextField label="Password" name="password" type={showPassword ? 'text' : 'password'} 
                            fullWidth value={formData.password} onChange={handleChange} required 
                                InputProps={inputProps} />
                    </React.Fragment>
                    )}
                    <Button type="submit" variant="contained" fullWidth sx = {{ backgroundColor : "#4b1d77",
                        color : "white", textTransform : "initial", cursor : "pointer", fontSize : "18px"}}>
                        {isRegistering ? 'Register' : 'Login'}
                    </Button>
                    <Button fullWidth onClick={handleLoginRegister}>
                        {isRegistering ? 'Already have an account? Login' : 'No account? Register'}
                    </Button>
                </form>
            </Box>
        </Box>
    );
};

export default AuthForm;
