import React, {useState, useEffect, useRef} from 'react';
import { Box, CssBaseline } from '@mui/material';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './components/SideMenu';
import Header from "./components/AppBar";
import "./App.css";
import axios from "axios";

import Administration from './Forms/Basic_Information/Administration';
import FundingDetails from './Forms/Basic_Information/Funding_Details';
import CheckList from './Forms/Declaration/CheckList';
import Declaration from './Forms/Declaration/Declaration';
import AdditionalInformation from './Forms/Other_Issues/Additional_Information';
import Benefits from './Forms/Participant_Information/Benifits';
import Compensation from './Forms/Participant_Information/Compensation';
import Confidentiality from './Forms/Participant_Information/Confidentiality';
import InformedConsent from './Forms/Participant_Information/Informed_Consent';
import ResearchParticipants from './Forms/Participant_Information/Research_Participants';
import Methodology from './Forms/Research_Information/Methodology';
import ResearchOverview from './Forms/Research_Information/Overview_Research';
import AddClinicalTrails from './components/AddClinicalTrails';
import ClinicalPreview from './Forms/Add_Clinical_Form/Clinical_Preview';
import RegistrationForm from './components/RegistrationForm';


const App = () => {

  const location = useLocation();
  const isRegistration = location.pathname === '/register';
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const fetchOnce = useRef(false);

  const verifyUser = async() => {
    try{
      const res = await axios.get('http://localhost:4000/api/user/verify', { withCredentials: true });
      setUser(res.data.email);
      return ;
    }
    catch(error) {
      setUser(null);
      navigate('/register');
      console.log("user is not login");
    }
  }

  useEffect(() => { // Verify user login or not
    if(!user) {
      verifyUser();
    }
  }, [location.pathname]);

  return (
    <React.Fragment>
      {isRegistration ? (
        <Routes>
          <Route path="/register" element={<RegistrationForm />} />
        </Routes>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <CssBaseline />
          <Header/>
          <Box sx={{ display: 'flex', marginTop: '90px' }}>
            <Sidebar/>
            <Box component="main"  sx={{ flexGrow: 1, marginLeft: '20px', padding: '20px', overflow: 'auto',
                height: 'calc(100vh - 90px)'
              }}
            >
              <Routes>
                <Route path="/basic/administrative" element={<Administration />} />
                <Route path="/basic/funding" element={<FundingDetails />} />
                <Route path="/research/overview" element={<ResearchOverview />} />
                <Route path="/research/methodology" element={<Methodology />} />
                <Route path="/participant/recruitment" element={<ResearchParticipants />} />
                <Route path="/participant/benefits" element={<Benefits />} />
                <Route path="/participant/informed consent" element={<InformedConsent />} />
                <Route path="/participant/compensation" element={<Compensation />} />
                <Route path="/participant/confidentiality" element={<Confidentiality />} />
                <Route path="/issues/additional" element={<AdditionalInformation />} />
                <Route path="/declaration" element={<Declaration />} />
                <Route path="/checklist" element={<CheckList />} />
                <Route path="/" element={<Administration />} />
                <Route path="/addclinicaltrails" element = {<AddClinicalTrails user = {user}/>} />
                <Route path="/clinicalpreview" element = {<ClinicalPreview/>} />
                <Route path="/register" element = {<RegistrationForm/>} />
              </Routes>
            </Box>
          </Box>
        </Box>
      )}
    </React.Fragment>
  );
};

export default App;