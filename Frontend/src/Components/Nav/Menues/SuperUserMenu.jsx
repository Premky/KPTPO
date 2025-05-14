import React from 'react';
import { List, ListItemButton, ListItemText, ListItemIcon } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../Context/AuthContext';

import DynamicFormIcon from '@mui/icons-material/DynamicForm';
import DifferenceIcon from '@mui/icons-material/Difference';

const SuperUserMenu = () => {
  const { state } = useAuth();
  const navigate = useNavigate();

  // You can use role-based conditions if needed in future
  const currentRole = state.role;

  return (
    <List>
      <ListItemButton onClick={() => navigate('/su')}>
        <ListItemIcon> <DynamicFormIcon />    </ListItemIcon>
        <ListItemText primary="USER FORM" />
      </ListItemButton>
      <ListItemButton onClick={() => navigate('/su/apps')}>
        <ListItemIcon> <DifferenceIcon />    </ListItemIcon>
        <ListItemText primary="Assign Apps" />
      </ListItemButton>
    </List>
  );
};

export default SuperUserMenu;
