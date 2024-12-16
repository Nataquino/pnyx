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
} from "@mui/material";

import PollIcon from "@mui/icons-material/Poll";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard"; // Icon for Rewards
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

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    navigate("/");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            ADMIN
          </Typography>
          <Container
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "right",
              marginRight: -3,
            }}
          >
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Container>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            position: "absolute",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            {["DASHBOARD", "ACCOUNTS", "SURVEY CATEGORIES"].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton
                  onClick={
                    text === "DASHBOARD"
                      ? () => navigate("/admin")
                      : text === "SURVEY CATEGORIES"
                      ? () => navigate("/admin-categories")
                      : null
                  }
                >
                  <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
            <Divider />
            <ListItem disablePadding>
              <ListItemButton
                aria-label="show notifications"
                color="inherit"
                onClick={handleClick}
                sx={{ paddingRight: 3 }}
              >
                <ListItemIcon>
                  <PollIcon />
                </ListItemIcon>
                <ListItemText primary="SURVEYS" />
                <ArrowDropDownIcon />
              </ListItemButton>
            </ListItem>
            <Divider />
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
      </Drawer>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        sx={{ height: "70vh" }}
      >
        <Box sx={{ py: 3, overflowY: "auto" }}>
          {adminSurveyPages.map((status, index) => (
            <MenuItem
              key={index}
              onClick={() => {
                handleClose();
                navigate(status.path);
              }}
              sx={{ width: "20vw", paddingTop: 2, paddingBottom: 2 }}
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
