import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Collapse, Divider, Box, Typography } from '@mui/material';

import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import "../styles/SideMenu.css";

const Sidebar = () => {
  const [expandedMenu, setExpandedMenu] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      id: 'Basic Information',
      label: 'Basic Information',
      hasSubMenu: true,
      subItems: [
     
        { id: 'Administrative Details', label: 'Administrative Details', path: '/basic/administrative' },
        { id: 'Details Investigator', label: 'Details Investigator', path: '/basic/details' },
        { id: 'Funding Details', label: 'Funding Details', path: '/basic/funding' }
      ]
    },
    {
      id: 'Research Information',
      label: 'Research Information',
      hasSubMenu: true,
      subItems: [
        { id: 'Overview of Research', label: 'Overview of Research', path: '/research/overview' },
       
      ]
    },
    {
      id: 'Participant Information',
      label: 'Participant Information',
      hasSubMenu: true,
      subItems: [
        { id: 'Research Participant', label: 'Research Participant', path: '/participant/recruitment' },
        { id: 'Benefits and Risks', label: 'Benefits and Risks', path: '/participant/benefits' },
        { id: 'Informed Consent', label: 'Informed Consent', path: '/participant/informedconsent' },
        { id: 'Compensation', label: 'Compensation', path: '/participant/compensation' },
        { id: 'Confidentiality', label: 'Storage and Confidentiality', path: '/participant/confidentiality' }
      ]
    },
    {
      id: 'Other Issues',
      label: 'Other Issues',
      hasSubMenu: true,
      subItems: [
        { id: 'Additional Issues', label: 'Additional Issues', path: '/issues/additional' }
      ]
    },
    {
      id: 'Declaration and CheckList',
      label: 'Declaration and CheckList',
      hasSubMenu: true,
      subItems: [
        { id: 'Declaration', label: 'Declaration', path: '/declaration' },
        { id: 'CheckList', label: 'CheckList', path: '/checklist' },
        {id: 'ExpeditedReview', label: 'Expedited Review', path:'/expedited'},
        {id:'WaiverOfConsent', label: 'Waiver Of Consent', path:'/waiver'}
      ]
    },
    {
      id: 'Add Clinical Trials',
      label: 'Add Clinical Trials',
      hasSubMenu: false,
      path: '/addclinicaltrails',
    },
    {
      id: 'Clinical Trials List',
      label: 'Clinical Trials List',
      hasSubMenu: false,
      path: '/clinicaltrail',
    },
    {
      id: 'NIEC',
      label: 'NIEC',
      hasSubMenu: true,
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
    if(item.hasSubMenu) {
      setExpandedMenu(expandedMenu === item.id ? null : item.id);
    }
    else{
      handleNavigation(item.path);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <Drawer variant="permanent" className = "custom-drawer">
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map((item) => (
            <React.Fragment key={item.id}>
              <ListItem button onClick={() => handleMenuClick(item)} selected={!item.hasSubMenu && isActive(item.path) || 
                  (item.hasSubMenu && item.subItems.some(sub => isActive(sub.path)))} className = "listitem_hover"
              >
                <ListItemText primary={item.label} className = "listitem_label" />
                  {item.hasSubMenu && ( expandedMenu === item.id ? <ExpandLess /> : <ExpandMore /> )}
                </ListItem>
                {item.hasSubMenu && (
                  <Collapse in={expandedMenu === item.id} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding sx = {{backgroundColor : "#ede0fe"}}>
                      {item.subItems.map((subItem) => (
                        <ListItem key={subItem.id} button sx={{ pl: 4 }} onClick={() => handleNavigation(subItem.path)}
                          selected={isActive(subItem.path)} className = "listitem_hover">
                          <ListItemText primary={subItem.label} />
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                )}
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default React.memo(Sidebar);