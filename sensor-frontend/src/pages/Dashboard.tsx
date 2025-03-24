import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
  Paper,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import UserManagement from '../components/UserManagement';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sensor Monitoring System
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            Welcome, {user?.name}
          </Typography>
          <Typography variant="body1">
            Role: {user?.role.replace('_', ' ')}
            {user?.company && ` - Company: ${user.company.name}`}
          </Typography>
        </Paper>

        {(user?.role === 'SYSTEM_ADMIN' || user?.role === 'COMPANY_ADMIN') && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              User Management
            </Typography>
            <UserManagement />
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default Dashboard; 