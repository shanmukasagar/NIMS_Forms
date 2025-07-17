import React, { useState } from 'react';
import { Box, TextField, Button, InputAdornment, IconButton, Typography, MenuItem, 
    FormControl, InputLabel, Select, Checkbox  } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import "../../styles/RegistrationForm.css";
import axiosInstance from "../../components/AxiosInstance";

const AddUsers = ({selectedRole, setSelectedRole}) => {
    const [isRegistering, setIsRegistering] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [conformPassword, setConformPassword] = useState(false);
    const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '', mobile: '' });
    
    const [rolesSelected, setRolesSelected] = useState([]);
    const [showRoleDropdown, setShowRoleDropdown] = useState(false);

    const roles = [
        "Principal/CoInvestigator",
        "ISRC Member Secretary", "ISRC Committee Member", "ISRC Committee Chair",
        "PBAC Member Secretary", "PBAC Committee Member", "PBAC Committee Chair",
        "NIMS IEC committee- member", "NIMS IEC CommitteeMember-secretary", "NIMS IEC Committee - Chairman",
        "Admin", "Super Admin"
    ];


    const [error, setError] = useState('');
    const navigate = useNavigate();

    //Handle roles to selected
    const handleRoleCheckbox = (e) => {
        const { value, checked } = e.target;
        const updated = checked
            ? [...rolesSelected, value]
            : rolesSelected.filter(role => role !== value);
        setRolesSelected(updated);
        setFormData({ ...formData, roles: updated }); // Assuming you're saving in formData
    };

    const handleChange = (e) => // Handle change
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => { //Handle submit
        e.preventDefault();
        setError('');

        const { username, email, password, confirmPassword, mobile } = formData;

        if (isRegistering) {
            if (!username.trim()) return setError('Username required');
            if (password !== confirmPassword) return setError('Passwords do not match');
            if (!/^\d{10}$/.test(mobile)) return setError('Valid 10-digit mobile required');

            try {
                formData.allowed_logins = rolesSelected;
                const res = await axiosInstance.post('/api/user/register', formData,);
                alert(res.data);
                handleLoginRegister();
                return ;
            } catch (err) {
                setError(err.response?.data || 'Registration failed');
            }
        } 
    };

    const inputProps = { endAdornment: (
        <InputAdornment position="end">
            <IconButton onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <VisibilityOff sx={{ color: 'gray' }}/> : <Visibility sx={{ color: 'gray' }}/>}
            </IconButton>
        </InputAdornment>
    )};

    const conformPasswordProps = { endAdornment: ( // Conform password
        <InputAdornment position="end">
            <IconButton onClick={() => setConformPassword(!conformPassword)}>
                {conformPassword ? <VisibilityOff sx={{ color: 'gray' }}/> : <Visibility sx={{ color: 'gray' }}/>}
            </IconButton>
        </InputAdornment>
    )};

    const handleLoginRegister = () => { //Handle login and register buttons
        setError("");
        setFormData({ username: '', email: '', password: '', confirmPassword: '', mobile: '' });
        setShowPassword(false);
        setConformPassword(false);
        setRolesSelected([]);
    }

    return (
        <Box sx = {{display : "flex", justifyContent : "center"}}>
            <Box className = "registration-container">
                <Typography sx = {{textAlign : "center", fontSize : "24px", fontWeight : "600"}}> {isRegistering ? 'Register' : 'Login'}</Typography>
                {error && <Typography color="error" className = "registration-error">{error}</Typography>}
                <form onSubmit={handleSubmit} className = "form_container">
                    {isRegistering && (
                        <React.Fragment>
                            <TextField label="Username" name="username" fullWidth value={formData.username} 
                                onChange={handleChange} required />
                            <TextField label="Employee Code" name="email" fullWidth value={formData.email}
                                onChange={handleChange} required type = "number"/>
                            <div className="html-role-dropdown">
                                <div className="dropdown-toggle" onClick={() => setShowRoleDropdown(!showRoleDropdown)}>
                                    {rolesSelected.length > 0 ? rolesSelected.join(', ') : 'Select Roles'}
                                </div>

                                {showRoleDropdown && (
                                    <div className="dropdown-checkboxes">
                                    {roles.map((role) => (
                                        <label key={role} className="checkbox-item">
                                        <input
                                            type="checkbox"
                                            value={role}
                                            checked={rolesSelected.includes(role)}
                                            onChange={handleRoleCheckbox}
                                        />
                                        {role}
                                        </label>
                                    ))}
                                    </div>
                                )}
                            </div>
                            <TextField label="Mobile" name="mobile" fullWidth value={formData.mobile}
                                onChange={handleChange} required inputProps={{ maxLength: 10 }} />
                            <TextField label="Password" name="password" type={showPassword ? 'text' : 'password'}
                                fullWidth value={formData.password} onChange={handleChange} required InputProps={inputProps} />
                            <TextField label="Confirm Password" name="confirmPassword" type={conformPassword ?
                                'text' : 'password'} fullWidth value={formData.confirmPassword} 
                                    onChange={handleChange} required InputProps={conformPasswordProps} />
                            

                        </React.Fragment>
                    )}
                    <Button type="submit" variant="contained" fullWidth sx = {{ backgroundColor : "#4b1d77",
                        color : "white", textTransform : "initial", cursor : "pointer", fontSize : "18px"}}>
                        {'Register'}
                    </Button>
                </form>
            </Box>
        </Box>
    );
};

export default AddUsers;
