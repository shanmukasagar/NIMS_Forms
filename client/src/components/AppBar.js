import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Stack, Box, Avatar, Menu, MenuItem, IconButton, } from '@mui/material';
import axiosInstance from "./AxiosInstance";
import { useNavigate } from 'react-router-dom';

const Header = ({ user, selectedRole, onLogout }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const navigate = useNavigate();

  //Handle Avatar click
  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  //Handle Menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  //Handle logout
  const handleLogoutClick = async () => {
    handleMenuClose();
    try {
      const response = await axiosInstance.get("/api/user/logout");
      if (response.status === 200) {
        console.log("Logout successful");
        navigate("/register");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AppBar className="AppBar_main" position="fixed" sx={{
        height: '90px', backgroundColor: '#ede0fe', boxShadow: '0 2px 4px -1px #0129701a, 0 4px 5px 0 #0129701a, 0 1px 10px 0 #0129701a',
        zIndex: 1100, display: 'flex', justifyContent: 'center', }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        {/* Title */}
        <Typography variant="h6" component="div" sx={{
            color: '#4b1d77', fontWeight: 600, flexGrow: 1, textAlign: 'center', }} >
          NIMS Research Submission Portal
        </Typography>

        {/* User Info + Avatar */}
        {user && (
          <Stack direction="row" spacing={2} alignItems="center">
            <Box textAlign="right">
              <Typography sx={{ fontWeight: 600, color: '#4b1d77' }}>{user}</Typography>
              <Typography sx={{ fontSize: '0.875rem', color: '#6a4c93' }}>{selectedRole}</Typography>
            </Box>

            <IconButton onClick={handleAvatarClick}>
              <Avatar alt={user.name} src={user.profileImage} />
            </IconButton>

            {/* Menu */}
            <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
            </Menu>
          </Stack>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default React.memo(Header);
