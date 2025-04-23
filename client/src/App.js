import React, {useState, useEffect, useRef} from 'react';
import { Box, CssBaseline } from '@mui/material';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './components/SideMenu';
import Header from "./components/AppBar";
import "./App.css";
import axios from "axios";

import Administration from './Forms/Basic_Information/Administration';
import Details_Investigator from './Forms/Basic_Information/Details_Investigator';
import Funding_Details from './Forms/Basic_Information/Funding_Details';
import CheckList from './Forms/Declaration/CheckList';
import Declaration from './Forms/Declaration/Declaration';
import Additional_Information from './Forms/Other_Issues/Additional_Information';
import Benefits from './Forms/Participant_Information/Benifits';
import Compensation from './Forms/Participant_Information/Compensation';
import Confidentiality from './Forms/Participant_Information/Confidentiality';
import Informed_Consent from './Forms/Participant_Information/Informed_Consent';
import Expedited_Review from './Forms/Declaration/Expedited_Review';
import Waiver_Of_Consent from './Forms/Declaration/Waiver_Of_Consent';
import Research_Participants from './Forms/Participant_Information/Research_Participants';

import Research_Overview from './Forms/Research_Information/Overview_Research';
import AddClinicalTrails from './components/AddClinicalTrails';
import ClinicalPreview from './Forms/Add_Clinical_Form/Clinical_Preview';
import RegistrationForm from './components/RegistrationForm';


const App = () => {
  const[adminId,setAdminId]=useState(null);
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
        <React.Fragment>
          {user && (
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
                  <Route path="/basic/administrative" element={<Administration setAdminId={setAdminId} /> }/>
                
      
<Route path= "/basic/details" element={< Details_Investigator adminId={adminId} />} />
<Route path="/basic/funding" element={<Funding_Details adminId={adminId} />} />
<Route path="/research/overview" element={<Research_Overview  adminId={adminId} />} />

<Route path="/participant/recruitment" element={<Research_Participants  adminId={adminId}  />} />
<Route path="/participant/benefits" element={<Benefits adminId={adminId} />} />
<Route path="/participant/informedconsent" element={<Informed_Consent adminId={adminId}  />} />
<Route path="/participant/compensation" element={<Compensation adminId={adminId} />} />
<Route path="/participant/confidentiality" element={<Confidentiality adminId={adminId} />} />
<Route path="/issues/additional" element={<Additional_Information  adminId={adminId} />} />
<Route path="/declaration" element={<Declaration adminId={adminId} />} />
<Route path="/checklist" element={<CheckList adminId={adminId} />} />
<Route path="/expedited" element={<Expedited_Review adminId={adminId} />} />
<Route path="/waiver" element={<Waiver_Of_Consent adminId={adminId}  />} />
<Route path="/" element={<Administration  setAdminId={setAdminId}/>} />

                    
                    <Route path="/addclinicaltrails" element = {<AddClinicalTrails user = {user}/>} />
                    <Route path="/clinicalpreview" element = {<ClinicalPreview/>} />
                    <Route path="/register" element = {<RegistrationForm/>} />
                  </Routes>
                </Box>
              </Box>
            </Box>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default App;