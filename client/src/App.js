import React, {useState, useEffect, useRef} from 'react';
import { Box, CssBaseline } from '@mui/material';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './components/SideMenu';
import Header from "./components/AppBar";
import "./App.css";
import Administration from './Forms/Basic_Information/Administration';
import DetailsInvestigator from './Forms/Basic_Information/Details_Investigator';
import FundingDetails from './Forms/Basic_Information/Funding_Details';
import CheckList from './Forms/Declaration/CheckList';
import Declaration from './Forms/Declaration/Declaration';
import AdditionalInformation from './Forms/Other_Issues/Additional_Information';
import Benefits from './Forms/Participant_Information/Benifits';
import Compensation from './Forms/Participant_Information/Compensation';
import Confidentiality from './Forms/Participant_Information/Confidentiality';
import InformedConsent from './Forms/Participant_Information/Informed_Consent';
import ExpeditedReview from './Forms/Declaration/Expedited_Review';
import WaiverOfConsent from './Forms/Declaration/Waiver_Of_Consent';
import ResearchParticipants from './Forms/Participant_Information/Research_Participants';
import ResearchOverview from './Forms/Research_Information/Overview_Research';
import AddClinicalTrails from './components/AddClinicalTrails';
import ClinicalPreview from './Forms/Add_Clinical_Form/Clinical_Preview';
import AuthForm from './components/AuthForm';
import ClinicalTrailList from "./components/ClinicalTrailsList";
import axiosInstance from "./components/AxiosInstance";
import AmendmentForm from "./Forms/NIEC_Forms/Amendment";
import AmendmentTemplate from './Forms/NIEC_Forms/AmendmentTemplate';
import SAEReporting from './Forms/NIEC_Forms/SAE_Reporting';
import CompletionReport from './Forms/NIEC_Forms/CompletionReport';
import ProgressReport from './Forms/NIEC_Forms/ProgressReport';
import ProtocolDeviation from './Forms/NIEC_Forms/Protocol_Deviation';
import TerminationReport from './Forms/NIEC_Forms/TerminationReport';

//Roles specific code
import ISRC_Member from './Roles/ISRC_Member';
import ClinicalFormFeedback from './Roles/Investigators/ClinicalTrailFeedback';
import InvestigatorDashboard from "./Roles/Investigators/components/Dashboard";
import InvestigatorStudy from "./Roles/Investigators/components/StudyList";

const App = () => {
  const[adminId,setAdminId]=useState(null);
  const location = useLocation();
  const isRegistration = location.pathname === '/register';
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const fetchOnce = useRef(false);

  const [selectedRole, setSelectedRole] = useState('Principal/CoInvestigator');
  const [selectedForm, setSelectedForm] = useState("");

  const verifyUser = async() => {
    try{
      const res = await axiosInstance.get('/api/user/verify');
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
    if(!fetchOnce.current) {
      verifyUser();
      fetchOnce.current = true;
    }
    
  }, [location.pathname]);

  return (
    <React.Fragment>
      {isRegistration ? (
        <Routes>
          <Route path="/register" element={<AuthForm selectedRole = {selectedRole} setSelectedRole = {setSelectedRole}/>} />
        </Routes>
      ) : (
        <React.Fragment>
          {user && (
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <CssBaseline />
              <Header/>
              <Box sx={{ display: 'flex', marginTop: '90px' }}>
                <Sidebar selectedRole = {selectedRole} selectedForm = {selectedForm}/>
                <Box component="main"  sx={{ flexGrow: 1, marginLeft: '20px', padding: '20px', overflow: 'auto',
                    height: 'calc(100vh - 90px)'
                  }} 
                >
            <Routes>
                <Route path="/basic/administrative" element={<Administration setAdminId={setAdminId} /> }/>
                <Route path= "/basic/details" element={< DetailsInvestigator adminId={adminId} />} />
                <Route path="/basic/funding" element={<FundingDetails  />} />
                <Route path="/research/overview" element={<ResearchOverview  />} />
                <Route path="/participant/recruitment" element={<ResearchParticipants    />} />
                <Route path="/participant/benefits" element={<Benefits  />} />
                <Route path="/participant/informedconsent" element={<InformedConsent   />} />
                <Route path="/participant/compensation" element={<Compensation  />} />
                <Route path="/participant/confidentiality" element={<Confidentiality  />} />
                <Route path="/issues/additional" element={<AdditionalInformation   />} />
                <Route path="/declaration" element={<Declaration />} />
                <Route path="/checklist" element={<CheckList  />} />
                <Route path="/expedited" element={<ExpeditedReview  />} />
                <Route path="/waiver" element={<WaiverOfConsent />} />
                <Route path="/" element={<Administration  setAdminId={setAdminId}/>} />          
                <Route path="/addclinicaltrails" element = {<AddClinicalTrails user = {user}/>} />
                <Route path="/clinicalpreview" element = {<ClinicalPreview/>} />
                <Route path="/register" element = {<AuthForm selectedRole = {selectedRole} setSelectedRole = {setSelectedRole}/>} />
                <Route path="/clinicaltrail" element = {<ClinicalTrailList/>} />
                <Route path="/amendment" element = {<AmendmentForm/>} />
                <Route path="/amendment/template" element = {<AmendmentTemplate/>} />
                <Route path="/sae/reporting" element = {<SAEReporting/>} />
                <Route path="/study/progress" element = {<ProgressReport/>} />
                <Route path="/study/completion" element = {<CompletionReport/>} />
                <Route path="/termination" element = {<TerminationReport/>} />
                <Route path="/protocol/deviation" element = {<ProtocolDeviation/>} />

                <Route path="/isrc/commitee/member" element={<ISRC_Member />} />
                <Route path = "/investigator/feedback" element = {<ClinicalFormFeedback/>} />
                <Route path = "/investigator" element = {<InvestigatorDashboard user = {user}/>} />
                <Route path = "/investigator/studylist" element = {<InvestigatorStudy setSelectedForm = {setSelectedForm}/>} />
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