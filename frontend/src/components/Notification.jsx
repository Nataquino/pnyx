import React, { useState } from 'react';
import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Divider
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import EmailIcon from '@mui/icons-material/Email';
import EventIcon from '@mui/icons-material/Event';

const styles = {
  menu: {
    minWidth: '20rem', // Adjust width as needed
  },
  menuItem: {
    padding: '12px 24px',
    '&:hover': {
      backgroundColor: 'skyblue',
    },
  },
  header: {
    backgroundColor: '#1976d2',
    color: 'white',
    padding: '16px',
  },
  emptyState: {
    padding: '16px',
    textAlign: 'center',
  },
  divider: {
    margin: '8px 0',
  },
};

const Notification = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const notifications = [
    {
      id: 1,
      icon: <EmailIcon style={{ color: '#1976d2' }} />,
      text: 'New message from John Doe',
    },
    {
      id: 2,
      icon: <EventIcon style={{ color: '#1976d2' }} />,
      text: 'Upcoming event: Team meeting at 10:00 AM',
    },
  ];

  return (
    <>
      <IconButton
        aria-label="show notifications"
        color="inherit"
        onClick={handleClick}
      >
        <Badge badgeContent={notifications.length} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          style: styles.menu,
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <div style={styles.header}>
          <Typography variant="h6">Notifications</Typography>
        </div>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <MenuItem
              key={notification.id}
              onClick={handleClose}
              style={styles.menuItem}
            >
              <div style={{ marginRight: '16px' }}>
                {notification.icon}
              </div>
              <Typography>{notification.text}</Typography>
            </MenuItem>
          ))
        ) : (
          <Typography style={styles.emptyState}>No new notifications</Typography>
        )}
        <Divider style={styles.divider} />
        <MenuItem onClick={handleClose} style={styles.menuItem}>
          <Typography>View all notifications</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default Notification;