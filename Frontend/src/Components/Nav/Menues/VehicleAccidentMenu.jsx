import React from 'react';
import { List, ListItemButton, ListItemText, ListItemIcon } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../Context/AuthContext';

import DynamicFormIcon from '@mui/icons-material/DynamicForm';

const VehicleAccidentMenu = () => {
  const { state } = useAuth();
  const navigate = useNavigate();

  // You can use role-based conditions if needed in future
  const currentRole = state.role;

  return (
    <List>
      <ListItemButton onClick={() => navigate('/va')}>
        <ListItemIcon> <DynamicFormIcon />    </ListItemIcon>
        <ListItemText primary="AV Dashboard" />
      </ListItemButton>
      <ListItemButton onClick={() => navigate('/va/accident-report')}>
        <ListItemIcon> <DynamicFormIcon />    </ListItemIcon>
        <ListItemText primary="Details" />
      </ListItemButton>
    </List>
  );
};

export default VehicleAccidentMenu;
