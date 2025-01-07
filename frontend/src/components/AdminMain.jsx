import * as React from "react";
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
  Tooltip,
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
  { title: "Pending", path: "/pending" },
  { title: "Approved", path: "/approve" },
  { title: "Declined", path: "/decline" },
];

const AdminMain = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [activeItem, setActiveItem] = React.useState("/admin");
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
              <PollIcon />
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
          <Container sx={{ display: { xs: "none", md: "flex" }, justifyContent: "right" }}>
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
        sx={{ height: "70vh", overflowY: "auto" }}
      >
        <Box sx={{ py: 2 }}>
          {adminSurveyPages.map((status) => (
            <MenuItem
              key={status.path}
              onClick={() => {
                handleNavigation(status.path);
                handleClose();
              }}
              sx={{
                width: "100%",
                paddingY: 1,
                display: "flex",
                justifyContent: "space-between",
                borderRadius: 1,
                transition: "all 0.3s ease",
                "&:hover": { backgroundColor: "#f0f0f0" },
              }}
            >
              {status.title}
            </MenuItem>
          ))}
        </Box>
      </Menu>
    </Box>
  );
};

export default AdminMain;
