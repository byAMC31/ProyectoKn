import * as React from "react";
import { extendTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import UsersTable from "../UsersTable/UsersTable";
import CreateUsersForm from "../CreateUsersForm/CreateUsersForm"; // Importa el formulario
import { IconButton, Tooltip, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import { useDemoRouter } from '@toolpad/core/internal';

const demoTheme = extendTheme({
  colorSchemes: { light: true, dark: true },
  colorSchemeSelector: "class",
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

function DemoPageContent({ pathname }) {
  return (
    <Box
      sx={{
        py: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      {pathname === "/dashboard" ? <UsersTable /> : <CreateUsersForm />}
    </Box>
  );
}



DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};




export default function DashboardLayoutBasic(props) {
  const { window } = props;
  const navigate = useNavigate();

  const router = useDemoRouter('/dashboard');

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };


  const NAVIGATION = [
    {
      segment: "dashboard",
      title: "Dashboard",
      icon: <DashboardIcon />,
    },
    {
      segment: "createUsersForm",
      title: "Create Users",
      icon: <PersonAddIcon />,
    },
  ];



  function LogoutButton() {
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
      navigation={NAVIGATION.map((navItem) => ({
        ...navItem,
        onClick: () => {
          setCurrentPage(navItem.segment);
        },
      }))}
      theme={demoTheme}
      router={router}
      branding={{
        title: "karimnot",
        homeUrl: "#",
      }}
    >
      <DashboardLayout
        slots={{
          sidebarFooter: () => <LogoutButton />,
        }}
      >
         {/* <PageContainer>
         <DemoPageContent pathname={router.pathname} />  
        </PageContainer> */}
        
      <DemoPageContent pathname={router.pathname} />  


      </DashboardLayout>
    </AppProvider>
  );
}
