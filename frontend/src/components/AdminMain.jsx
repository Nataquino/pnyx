import * as React from "react";
import axios from "axios";
import { useLocation } from 'react-router-dom';
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
  Container,
  Menu,
  MenuItem,
  IconButton,
  useTheme,
  useMediaQuery,
  Badge,
} from "@mui/material";
import PollIcon from "@mui/icons-material/Poll";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard"; // Icon for Rewards
import MenuIcon from "@mui/icons-material/Menu"; // Drawer toggle icon
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

const adminSurveyPages = [
  { title: "Pending", path: "/pending", icon: <PollIcon color="action" /> },
  { title: "Approved", path: "/approve", icon: <InboxIcon color="action" /> },
  { title: "Declined", path: "/decline", icon: <MailIcon color="action" /> },
];

const AdminMain = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current path
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [activeItem, setActiveItem] = React.useState("/admin");
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [pendingCount, setPendingCount] = React.useState(0); // State for pending count
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Fetch the count of pending surveys
  const fetchPendingCount = async () => {
    try {
      const response = await axios.get("http://localhost/survey-app/get-pending.php");
      if (Array.isArray(response.data)) {
        setPendingCount(response.data.length); // Set count from the fetched data
      }
    } catch (error) {
      console.error("Error fetching pending count:", error);
    }
  };

  // Use an effect to start polling every 5 seconds for real-time updates
  React.useEffect(() => {
    fetchPendingCount(); // Initial fetch of pending surveys
    const interval = setInterval(fetchPendingCount, 5000); // Poll every 5 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  // Handle "Pending" page click
  const handleClickPending = () => {
    setPendingCount(0); // Clear the pending notification
    navigate("/pending"); // Navigate to the Pending page
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    navigate("/");
  };

  const handleNavigation = (path) => {
    setActiveItem(path);
    navigate(path);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerContent = (
    <Box sx={{ overflow: "auto", height: "100%" }}>
      <List sx={{ pt: 2 }}>
        {["DASHBOARD", "SURVEY CATEGORIES"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              onClick={() =>
                text === "DASHBOARD"
                  ? handleNavigation("/admin")
                  : text === "SURVEY CATEGORIES"
                  ? handleNavigation("/admin-categories")
                  : null
              }
              selected={activeItem === (text === "DASHBOARD" ? "/admin" : "/admin-categories")}
              sx={{
                "&:hover": { backgroundColor: "#f0f0f0" },
                borderRadius: 2,
                transition: "all 0.3s ease",
              }}
            >
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
        <Divider sx={{ mt: 2 }} />
        <ListItem disablePadding>
          <ListItemButton
            aria-label="show surveys"
            color="inherit"
            onClick={handleClick}
            sx={{
              paddingRight: 3,
              display: "flex",
              justifyContent: "space-between",
              "&:hover": { backgroundColor: "#f0f0f0" },
              borderRadius: 2,
            }}
          >
            <ListItemIcon>
              {/* Only show badge if not on "/pending" page */}
              {location.pathname !== "/pending" && (
                <Badge badgeContent={pendingCount} color="error" overlap="circular">
                  <PollIcon />
                </Badge>
              )}
              {location.pathname === "/pending" && <PollIcon />}
            </ListItemIcon>
            <ListItemText primary="SURVEYS" />
            <ArrowDropDownIcon />
          </ListItemButton>
        </ListItem>
        <Divider sx={{ mt: 2 }} />
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleNavigation("/add-rewards")}
            sx={{
              "&:hover": { backgroundColor: "#f0f0f0" },
              borderRadius: 2,
              transition: "all 0.3s ease",
            }}
          >
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
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: "#2196f3" }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            ADMIN
          </Typography>
          <Container sx={{ display: { xs: "flex", md: "flex" }, justifyContent: "right" }}>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Container>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : true}
        onClose={isMobile ? handleDrawerToggle : null}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            position: isMobile ? "absolute" : "relative",
            transition: "all 0.3s ease",
            backgroundColor: "#ffffff",
            boxShadow: 3,
            borderRadius: 1,
          },
        }}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <Toolbar />
        {drawerContent}
      </Drawer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            borderRadius: 2,
            boxShadow: 3,
            minWidth: 200,
            padding: 1,
          },
        }}
      >
        {adminSurveyPages.map((status) => (
          <MenuItem
            key={status.path}
            onClick={() => {
              if (status.path === "/pending") {
                // Immediately clear the pending count
                setPendingCount(0);
              }
              handleNavigation(status.path);
              handleClose();
            }}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              paddingY: 1,
              paddingX: 2,
              borderRadius: 1,
              backgroundColor: activeItem === status.path ? "primary.light" : "inherit",
              color: activeItem === status.path ? "primary.contrastText" : "inherit",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: activeItem === status.path ? "primary.main" : "#f5f5f5",
              },
            }}
          >
            {status.path === "/pending" ? (
              <Badge badgeContent={pendingCount} color="error" overlap="circular">
                {status.icon}
              </Badge>
            ) : (
              status.icon
            )}
            {status.title}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default AdminMain;
