import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Box, CssBaseline, CircularProgress } from '@mui/material';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import "./App.css";
import axiosInstance from "./components/AxiosInstance";
import { ProjectProvider } from './components/ResearchContext';

// Lazy Load Components
const Sidebar = lazy(() => import('./components/SideMenu'));
const Header = lazy(() => import("./components/AppBar"));
const AuthForm = lazy(() => import('./components/AuthForm'));
const AddClinicalTrails = lazy(() => import('./components/AddClinicalTrails'));
const ClinicalTrailList = lazy(() => import("./components/ClinicalTrailsList"));
const Administration = lazy(() => import('./Forms/Basic_Information/Administration'));
const DetailsInvestigator = lazy(() => import('./Forms/Basic_Information/Details_Investigator'));
const FundingDetails = lazy(() => import('./Forms/Basic_Information/Funding_Details'));
const CheckList = lazy(() => import('./Forms/Declaration/CheckList'));
const Declaration = lazy(() => import('./Forms/Declaration/Declaration'));
const AdditionalInformation = lazy(() => import('./Forms/Other_Issues/Additional_Information'));
const Benefits = lazy(() => import('./Forms/Participant_Information/Benifits'));
const Compensation = lazy(() => import('./Forms/Participant_Information/Compensation'));
const Confidentiality = lazy(() => import('./Forms/Participant_Information/Confidentiality'));
const InformedConsent = lazy(() => import('./Forms/Participant_Information/Informed_Consent'));
const ResearchParticipants = lazy(() => import('./Forms/Participant_Information/Research_Participants'));
const ResearchOverview = lazy(() => import('./Forms/Research_Information/Overview_Research'));
const ClinicalPreview = lazy(() => import('./Forms/Add_Clinical_Form/Clinical_Preview'));
const AmendmentForm = lazy(() => import('./Forms/NIEC_Forms/Amendment'));
const AmendmentTemplate = lazy(() => import('./Forms/NIEC_Forms/AmendmentTemplate'));
const SAEReporting = lazy(() => import('./Forms/NIEC_Forms/SAE_Reporting'));
const CompletionReport = lazy(() => import('./Forms/NIEC_Forms/CompletionReport'));
const ProgressReport = lazy(() => import('./Forms/NIEC_Forms/ProgressReport'));
const ProtocolDeviation = lazy(() => import('./Forms/NIEC_Forms/Protocol_Deviation'));
const TerminationReport = lazy(() => import('./Forms/NIEC_Forms/TerminationReport'));

//Funding
const SelfFunding = lazy(() => import('./Forms/Funding_Forms/Self_Funding'));
const IndustryFunding = lazy(() => import('./Forms/Funding_Forms/Industry_Funding'));
const FundingAgency = lazy(() => import('./Forms/Funding_Forms/Funding_Studies'));

// Roles
const ISRC_Member = lazy(() => import('./Roles/ISRC/ISRC_Member'));
const ClinicalFormFeedback = lazy(() => import('./Roles/Investigators/ClinicalTrailFeedback'));
const InvestigatorDashboard = lazy(() => import('./Roles/Investigators/components/Dashboard'));
const InvestigatorStudy = lazy(() => import('./Roles/Investigators/components/StudyList'));
const InvestigatorsApproval = lazy(() => import('./Roles/Investigators/components/InvestigatorsApproval'));
const HODApproval = lazy(() => import('./Roles/Investigators/components/HODApproval'));
const AssignReviewers = lazy(() => import('./Roles/ISRC/AssignReviewers'));
const ISRCChairMemberDecision = lazy(() => import('./Roles/ISRC/ISRC_Chair_Decision'));



const App = () => {
  const [adminId, setAdminId] = useState(null);
  const location = useLocation();
  const isRegistration = location.pathname === '/register';
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const fetchOnce = useRef(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedForm, setSelectedForm] = useState("");

  const verifyUser = async () => {
    try {
      const res = await axiosInstance.get('/api/user/verify');
      setUser(res.data.email);
      setSelectedRole(res.data.selectedRole || "");
    } catch (error) {
      setUser(null);
      navigate('/register');
      console.log("User is not logged in");
    }
  };

  useEffect(() => {
    verifyUser();
  }, [location.pathname]);

  return (
    <Suspense fallback={<Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CircularProgress /></Box>}>
      {isRegistration ? (
        <Routes>
          <Route path="/register" element={<AuthForm selectedRole={selectedRole} setSelectedRole={setSelectedRole} />} />
        </Routes>
      ) : (
        user && (
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <CssBaseline />
            <Header />
            <Box sx={{ display: 'flex', marginTop: '90px' }}>
              <Sidebar selectedRole={selectedRole} selectedForm={selectedForm} />
              <Box component="main" sx={{ flexGrow: 1, marginLeft: '20px', padding: '20px', overflow: 'auto', height: 'calc(100vh - 90px)' }}>
                <Routes>
                  {/* Basic Info */}
                  <Route path="/" element={<Administration setAdminId={setAdminId} selectedForm={selectedForm} />} />
                  <Route path="/basic/administrative" element={<Administration setAdminId={setAdminId} selectedForm={selectedForm} />} />
                  <Route path="/basic/details" element={<DetailsInvestigator adminId={adminId} selectedForm={selectedForm} />} />
                  <Route path="/basic/funding" element={<FundingDetails selectedForm={selectedForm} />} />
                  {/* Research */}
                  <Route path="/research/overview" element={<ResearchOverview selectedForm={selectedForm} />} />
                  {/* Participant Info */}
                  <Route path="/participant/recruitment" element={<ResearchParticipants selectedForm={selectedForm} />} />
                  <Route path="/participant/benefits" element={<Benefits selectedForm={selectedForm} />} />
                  <Route path="/participant/informedconsent" element={<InformedConsent selectedForm={selectedForm} />} />
                  <Route path="/participant/compensation" element={<Compensation selectedForm={selectedForm} />} />
                  <Route path="/participant/confidentiality" element={<Confidentiality selectedForm={selectedForm} />} />
                  {/* Other Issues */}
                  <Route path="/issues/additional" element={<AdditionalInformation selectedForm={selectedForm} />} />
                  {/* Declaration */}
                  <Route path="/declaration" element={<Declaration selectedForm={selectedForm} />} />
                  <Route path="/checklist" element={<CheckList selectedForm={selectedForm} />} />
                  {/* Clinical Trials */}
                  <Route path="/addclinicaltrails" element={<AddClinicalTrails user={user} />} />
                  <Route path="/clinicalpreview" element={<ClinicalPreview />} />
                  <Route path="/clinicaltrail" element={<ClinicalTrailList />} />
                  {/* NIEC Forms */}
                  <Route path="/amendment" element={<AmendmentForm />} />
                  <Route path="/amendment/template" element={<AmendmentTemplate />} />
                  <Route path="/sae/reporting" element={<SAEReporting />} />
                  <Route path="/study/progress" element={<ProgressReport />} />
                  <Route path="/study/completion" element={<CompletionReport />} />
                  <Route path="/termination" element={<TerminationReport />} />
                  <Route path="/protocol/deviation" element={<ProtocolDeviation />} />

                  {/* Funding */}
                  <Route path="/self-funding" element={<SelfFunding />} />
                  <Route path="/industry-funding" element={<IndustryFunding />} />
                  <Route path="/funding-agency" element={<FundingAgency />} />

                  {/* Roles */}
                  <Route path="/isrc/commitee/member" element={<ISRC_Member user={user} setSelectedForm={setSelectedForm} />} />
                  <Route path="/investigator/feedback" element={<ClinicalFormFeedback />} />
                  <Route path="/investigator" element={<InvestigatorDashboard user={user} setSelectedForm={setSelectedForm} />} />
                  <Route path="/investigator/studylist" element={<InvestigatorStudy setSelectedForm={setSelectedForm} />} />
                  <Route path="/investigator/approval" element={<InvestigatorsApproval />} />
                  <Route path="/hod/approval" element={<HODApproval />} />
                  <Route path="/isrc/chair/assignreviewers" element={<AssignReviewers user={user} setSelectedForm={setSelectedForm} />} />
                  <Route path="/isrc/chair/decision" element={<ISRCChairMemberDecision user={user} setSelectedForm={setSelectedForm} />} />
                </Routes>
              </Box>
            </Box>
          </Box>
        )
      )}
    </Suspense>
  );
};

export default App;
