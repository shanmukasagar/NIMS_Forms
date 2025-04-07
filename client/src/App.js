import React from 'react';
import { Box, Typography, CssBaseline } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/SideMenu';
import Header from "./components/AppBar";

import Administration from './Forms/Basic_Information/Administration';
import Funding_Details from './Forms/Basic_Information/Funding_Details';
import CheckList from './Forms/Declaration/CheckList';
import Declaration from './Forms/Declaration/Declaration';
import Additional_Information from './Forms/Other_Issues/Additional_Information';
import Benefits from './Forms/Participant_Information/Benifits';
import Compensation from './Forms/Participant_Information/Compensation';
import Confidentiality from './Forms/Participant_Information/Confidentiality';
import Informed_Consent from './Forms/Participant_Information/Informed_Consent';
import Research_Participants from './Forms/Participant_Information/Research_Participants';
import Methodology from './Forms/Research_Information/Methodology';
import Research_Overview from './Forms/Research_Information/Overview_Research';


const App = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <CssBaseline />
      <Header />
      <Box sx={{ display: 'flex', marginTop: '90px' }}>
        <Sidebar />
        <Box 
          component="main" 
          sx={{ flexGrow: 1, marginLeft: '20px', padding: '20px', overflow: 'auto',
            height: 'calc(100vh - 90px)'
          }}
        >
          <Routes>
            <Route path="/basic/administrative" element={<Administration />} />
            <Route path="/basic/funding" element={<Funding_Details />} />
            <Route path="/research/overview" element={<Research_Overview />} />
            <Route path="/research/methodology" element={<Methodology />} />
            <Route path="/participant/recruitment" element={<Research_Participants />} />
            <Route path="/participant/benefits" element={<Benefits />} />
            <Route path="/participant/informed consent" element={<Informed_Consent />} />
            <Route path="/participant/compensation" element={<Compensation />} />
            <Route path="/participant/confidentiality" element={<Confidentiality />} />
            <Route path="/issues/additional" element={<Additional_Information />} />
            <Route path="/declaration" element={<Declaration />} />
            <Route path="/checklist" element={<CheckList />} />
            <Route path="/" element={<Administration />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};

export default App;