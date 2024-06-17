import { styled, useTheme } from "@mui/material/styles";
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
} from "@mui/material";

import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";

const drawerWidth = 240;

const AdminMain = () => {
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
                        {["DASHBOARD", "ACCOUNTS", "SURVEYS"].map((text, index) => (
                            <ListItem key={text} disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                                    </ListItemIcon>
                                    <ListItemText primary={text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                </Box>
            </Drawer>
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