import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemText, Collapse, Box } from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import "../styles/SideMenu.css";

const Sidebar = ({selectedRole, selectedForm}) => {
  const [expandedMenu, setExpandedMenu] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      id: 'Dashboard',
      label: 'Dashboard',
      hasSubMenu: false,
      role: "Principal/CoInvestigator",
      subItems: [
        { id: 'Dashboard', label: 'Dashboard', path: '/investigator' },
      ]
    },
    {
      id: 'ISRC Committee Member',
      label: 'ISRC Committee Member',
      hasSubMenu: false,
      role: "ISRC Committee Member",
      subItems: [
        { id: 'ISRC Committee Member', label: 'ISRC Committee Member', path: '/isrc/commitee/member' },
      ]
    },
    {
      id: 'Assign Reviewers',
      label: 'Assign Reviewers',
      hasSubMenu: false,
      role: "ISRC Member Secretary",
      subItems: [
        { id: 'Assign Reviewers', label: 'Assign Reviewers', path: '/isrc/chair/assignreviewers' },
      ]
    },
    {
      id: 'Final Decision',
      label: 'Final Decision',
      hasSubMenu: false,
      role: "ISRC Committee Chair",
      subItems: [
        { id: 'Final Decision', label: 'Final Decision', path: '/isrc/chair/decision' },
      ]
    },
    {
      id: 'Research',
      label: 'Research',
      hasSubMenu: true,
      role: "biomedical-1",
      subItems: [
        { id: 'Administrative Details', label: 'Administrative Details', path: '/basic/administrative' },
        { id: 'Details Investigator', label: 'Details Investigator', path: '/basic/details' },
        { id: 'Funding Details', label: 'Funding Details', path: '/basic/funding' },
        { id: 'Overview of Research', label: 'Overview of Research', path: '/research/overview' },
        { id: 'Research Participant', label: 'Research Participant', path: '/participant/recruitment' },
        { id: 'Benefits and Risks', label: 'Benefits and Risks', path: '/participant/benefits' },
        { id: 'Informed Consent', label: 'Informed Consent', path: '/participant/informedconsent' },
        { id: 'Compensation', label: 'Compensation', path: '/participant/compensation' },
        { id: 'Confidentiality', label: 'Storage and Confidentiality', path: '/participant/confidentiality' },
        { id: 'Additional Issues', label: 'Additional Issues', path: '/issues/additional' },
        { id: 'Declaration', label: 'Declaration', path: '/declaration' },
        { id: 'CheckList', label: 'CheckList', path: '/checklist' }
        // { id: 'ExpeditedReview', label: 'Expedited Review', path: '/expedited' },
        // { id: 'WaiverOfConsent', label: 'Waiver Of Consent', path: '/waiver' }
      ]
    },
    {
      id: 'Medical Research',
      label: 'Medical Research',
      hasSubMenu: true,
      role: "biomedical-2",
      subItems: [
        { id: 'Administrative Details', label: 'Administrative Details', path: '/basic/administrative' },
        { id: 'Details Investigator', label: 'Details Investigator', path: '/basic/details' },
        { id: 'Funding Details', label: 'Funding Details', path: '/basic/funding' },
        { id: 'Overview of Research', label: 'Overview of Research', path: '/research/overview' },
        { id: 'Additional Issues', label: 'Additional Issues', path: '/issues/additional' },
        { id: 'Declaration', label: 'Declaration', path: '/declaration' },
        { id: 'CheckList', label: 'CheckList', path: '/checklist' },
        { id: 'ExpeditedReview', label: 'Expedited Review', path: '/expedited' },
        { id: 'WaiverOfConsent', label: 'Waiver Of Consent', path: '/waiver' }
      ]
    },
    // {
    //   id: 'ClinicalTrails',
    //   label: 'Clinical Trails',
    //   hasSubMenu: true,
    //   role: "",
    //   subItems: [
    //     { id: 'Add Clinical Trials', label: 'Add Clinical Trials', path: '/addclinicaltrails' },
    //     { id: 'Clinical Trials Feedback', label: 'Clinical Trials Feedback', path: '/investigator/feedback' },
    //   ]
    // },
    {
      id: 'NIEC',
      label: 'NIEC',
      hasSubMenu: true,
      role: "NIEC",
      subItems: [
        { id: 'Amendment', label: 'Amendment', path: '/amendment' },
        { id: 'Amendment Template', label: 'Amendment Template', path: '/amendment/template' },
        { id: 'SAE Reporting', label: 'SAE Reporting Form', path: '/sae/reporting' },
        { id: 'Study Progress Report', label: 'Study Progress Report', path: '/study/progress' },
        { id: 'Study Completion Report', label: 'Study Completion Report', path: '/study/completion' },
        { id: 'Premature Termination/Suspension', label: 'Premature Termination/Suspension', path: '/termination' },
        { id: 'Protocol Deviation and Compilance', label: 'Protocol Deviation and Compilance', path: '/protocol/deviation' },
      ]
    },
    
    
  ];

  const handleMenuClick = (item) => {
    if (item.hasSubMenu) {
      setExpandedMenu(expandedMenu === item.id ? null : item.id);
    } else {
      handleNavigation(item.subItems[0]?.path);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <Drawer variant="permanent" className="custom-drawer">
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map((item) => (
            <React.Fragment key={item.id}>
              {(item.role === selectedRole) && (
                <React.Fragment>
                  <ListItem button onClick={() => handleMenuClick(item)}
                    selected={
                      (!item.hasSubMenu && isActive(item.subItems[0]?.path)) ||
                      (item.hasSubMenu && item.subItems.some(sub => isActive(sub.path)))
                    }
                    className="listitem_hover"
                  >
                    <ListItemText primary={item.label} className="listitem_label" />
                    {item.hasSubMenu &&
                      (expandedMenu === item.id ? <ExpandLess /> : <ExpandMore />)}
                  </ListItem>
                  {item.hasSubMenu && (
                    <Collapse in={expandedMenu === item.id} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding sx={{ backgroundColor: "#ede0fe" }}>
                        {item.subItems.map((subItem) => (
                          <ListItem
                            key={subItem.id}
                            button
                            sx={{ pl: 4 }}
                            onClick={() => handleNavigation(subItem.path)}
                            selected={isActive(subItem.path)}
                            className="listitem_hover"
                          >
                            <ListItemText primary={subItem.label} />
                          </ListItem>
                        ))}
                      </List>
                    </Collapse>
                  )}
               </React.Fragment>
            )}
            {(item.role === selectedForm) && (
                <React.Fragment>
                  <ListItem button onClick={() => handleMenuClick(item)}
                    selected={
                      (!item.hasSubMenu && isActive(item.subItems[0]?.path)) ||
                      (item.hasSubMenu && item.subItems.some(sub => isActive(sub.path)))
                    }
                    className="listitem_hover"
                  >
                    <ListItemText primary={item.label} className="listitem_label" />
                    {item.hasSubMenu &&
                      (expandedMenu === item.id ? <ExpandLess /> : <ExpandMore />)}
                  </ListItem>
                  {item.hasSubMenu && (
                    <Collapse in={expandedMenu === item.id} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding sx={{ backgroundColor: "#ede0fe" }}>
                        {item.subItems.map((subItem) => (
                          <ListItem
                            key={subItem.id}
                            button
                            sx={{ pl: 4 }}
                            onClick={() => handleNavigation(subItem.path)}
                            selected={isActive(subItem.path)}
                            className="listitem_hover"
                          >
                            <ListItemText primary={subItem.label} />
                          </ListItem>
                        ))}
                      </List>
                    </Collapse>
                  )}
               </React.Fragment>
            )}
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default React.memo(Sidebar);
