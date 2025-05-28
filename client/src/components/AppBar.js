import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

const Header = () => {
  return (
    <AppBar className="AppBar_main" position="fixed" sx={{ height: '90px',  backgroundColor: '#ede0fe',
        boxShadow: '0 2px 4px -1px #0129701a, 0 4px 5px 0 #0129701a, 0 1px 10px 0 #0129701a',
        zIndex: 1100, display: 'flex', justifyContent: 'center' }} >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign : "center", color : "#4b1d77",
          fontWeight : "600"
         }}>NIMS RESEARCH FORMS</Typography>
      </Toolbar>
    </AppBar>
  );
};

export default React.memo(Header);