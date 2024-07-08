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
  Card,
  CardContent,
  CardActions,
  Container,
  Menu,
  MenuItem,
} from "@mui/material";
import { useState } from "react";

import PollIcon from "@mui/icons-material/Poll";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;
  const adminSurveyPages = [
    {title: "Pending", path:"/pending"},
    {title: "Approved", path:"/approve"},
    {title:"Declined", path:"/decline"}
  ];
const AdminMain = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);


  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);


  };

  const handleClose = () => {
    setAnchorEl(null);
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
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            {["DASHBOARD", "ACCOUNTS"].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
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
                onClick={()=>{handleClose();navigate(status.path)}}
                sx={{ width: "20vw", paddingTop: 2, paddingBottom: 2 }}
              >
                {status.title}
              </MenuItem>
            ))}
          </Box>

      </Menu>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Card
          sx={{
            width: "30vw",
            height: "50vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CardContent>
            <Typography
              variant="h5"
              component="div"
              sx={{ marginTop: 2, fontSize: "40px" }}
            >
              Genshin or Wuwa?
            </Typography>
            <Typography variant="body2" sx={{ marginTop: 2 }}>
              "Genshin" - Adventurous, fantastical journey through diverse
              landscapes, filled with mystical creatures and elemental powers.
              "Wuthering Waves" - A turbulent tale of love and loss set against
              the haunting backdrop of the moody Yorkshire moors.
              <br />
              {'"a benevolent smile"'}
            </Typography>
          </CardContent>

          <Box
            sx={{
              marginTop: "auto",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button variant="contained">View</Button>
          </Box>

          <CardActions
            sx={{
              marginTop: "auto",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button sx={{ color: "green" }} size="small">
              Approve
            </Button>
            <Button sx={{ color: "red" }} size="small">
              Decline
            </Button>
          </CardActions>
        </Card>
      </Box>
    </Box>
  );
};

export default AdminMain;
