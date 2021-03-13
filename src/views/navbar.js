import React, {useState} from 'react';
import {AppBar, Tabs, Tab} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AccountCircle from '@material-ui/icons/AccountCircle';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import DashboardIcon from '@material-ui/icons/Dashboard';
import AssessmentIcon from '@material-ui/icons/Assessment';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: "rgba(45, 52, 54,1.0)"
  },
  rightAlign: {
    marginLeft: "auto"
  },
  accountCircle: {
    color: "white",
  }
}));


function NavBar(props) {

    let classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleMenu = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };

    return (
      <div>
      <AppBar position="static" className={classes.root}>
        <Toolbar>
        <Tabs value={false}>
            <Tab icon={<DashboardIcon />} href="/" />
            <Tab icon={<AssessmentIcon />} />
        </Tabs>
        <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            className={classes.rightAlign}
        >
          <AccountCircle className={classes.accountCircle}/>
        </IconButton>
        <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={open}
            onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>Account Settings</MenuItem>
          <MenuItem onClick={(e) => props.logout(e)}>Log out</MenuItem>
        </Menu>
        </Toolbar>
   
      </AppBar>
      </div>

    )
  
}

export default NavBar