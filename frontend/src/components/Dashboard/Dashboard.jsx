import * as React from 'react';
import { extendTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import UsersTable from '../UsersTable/UsersTable';
import { IconButton } from '@mui/material';
import { Tooltip, Box, Typography  } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const demoTheme = extendTheme({
  colorSchemes: { light: true, dark: true },
  colorSchemeSelector: 'class',
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});


export default function DashboardLayoutBasic(props) {
  const { window } = props;
  const demoWindow = window ? window() : undefined;
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Elimina el token del localStorage
    navigate('/login');
  };

  const NAVIGATION = [
    {
      segment: 'dashboard',
      title: 'Dashboard',
      icon: <DashboardIcon />,
    },
    
    {
      kind: 'divider',
    },
    
  ];

  function LogoutButton({ handleLogout }) {
    return (
      <Tooltip title="Cerrar sesión">
        <Box display="flex" alignItems="center" onClick={handleLogout}>
          <IconButton color="inherit">
            <LogoutIcon />
          </IconButton>
          <Typography variant="body1" sx={{ marginLeft: 1 }}>
            Logout
          </Typography>
        </Box>
      </Tooltip>
    );
  }



  return (
    <AppProvider
      navigation={NAVIGATION}
      theme={demoTheme}
      window={demoWindow}
      branding={{
        // logo: <img src="" alt="MUI logo" />,
        title: 'karimnot',
        homeUrl: '#',
      }}    
    >
      <DashboardLayout
        slots={{
          sidebarFooter: () => <LogoutButton handleLogout={handleLogout} />,
          // toolbarActions: ToolbarActionsSearch,
          // sidebarFooter: SidebarFooter,
        }}
      >
        <PageContainer>
          <UsersTable />
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
}