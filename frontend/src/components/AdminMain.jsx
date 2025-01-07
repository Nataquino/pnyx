import React from "react";
import {
  Box,
  Drawer,
  CssBaseline,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemButton,
  ListItemText,
  Button,
  IconButton,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import CategoryIcon from "@mui/icons-material/Category";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import PollIcon from "@mui/icons-material/Poll";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

const AdminMain = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    navigate("/");
  };

  const drawer = (
    <Box sx={{ overflow: "auto", marginTop: 7 }}>
      <List>
        {/* Dashboard */}
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/admin")}>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="DASHBOARD" />
          </ListItemButton>
        </ListItem>

        {/* Survey Categories */}
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/admin-categories")}>
            <ListItemIcon>
              <CategoryIcon />
            </ListItemIcon>
            <ListItemText primary="SURVEY CATEGORIES" />
          </ListItemButton>
        </ListItem>

        <Divider />

        {/* Surveys */}
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/pending")}>
            <ListItemIcon>
              <PollIcon />
            </ListItemIcon>
            <ListItemText primary="SURVEYS" />
          </ListItemButton>
        </ListItem>

        <Divider />

        {/* Rewards */}
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/add-rewards")}>
            <ListItemIcon>
              <CardGiftcardIcon />
            </ListItemIcon>
            <ListItemText primary="REWARDS" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { sm: "none" }, marginRight: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            ADMIN
          </Typography>
          <Button
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 }}}
        aria-label="admin navigation"
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {/* Content for each route will render here */}
      </Box>
    </Box>
  );
};

export default AdminMain;
