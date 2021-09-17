import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
// import NotificationsIcon from '@material-ui/icons/Notifications';
import Toolbar from '@material-ui/core/Toolbar';
// import Tooltip from '@material-ui/core/Tooltip';
import { withStyles, Theme } from '@material-ui/core/styles';

import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import MenuIcon from '@material-ui/icons/Menu';
import { signout } from '../auth';

import { sprintf, __ } from '@wordpress/i18n';
import Avatar from '@material-ui/core/Avatar';
import './Header.scss';
import { useAppSelector } from '../redux/hooks';

const lightColor = 'rgba(255, 255, 255, 0.7)';

const styles = (theme: Theme) => ({
  secondaryBar: {
    zIndex: 0,
  },
  menuButton: {
    marginLeft: -theme.spacing(1),
  },
  iconButtonAvatar: {
    padding: 4,
  },
  link: {
    textDecoration: 'none',
    color: lightColor,
    '&:hover': {
      color: theme.palette.common.white,
    },
  },
  button: {
    borderColor: lightColor,
  },
});

type Props = {
  classes: any;
  onDrawerToggle: () => void;
};

const Header: React.FC<Props> = (props: Props) => {
  const { classes, onDrawerToggle } = props;
  const { username, avatarImage } = useAppSelector((state) => state.userMeta);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const headerStyle: React.CSSProperties = {
    backgroundColor: '#EE5F28',
  };

  const avatarStyle: React.CSSProperties = {
    width: '24px',
    height: '24px',
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    window.location.hash = '/user';
    handleClose();
  };

  const handleSignout = () => {
    handleClose();
    signout().then(() => {
      window.location.href = '/';
    });
  };

  return (
    <React.Fragment>
      <AppBar
        color="default"
        style={headerStyle}
        position="sticky"
        elevation={0}
      >
        <Toolbar>
          <Grid container spacing={2} alignItems="center">
            <Hidden smUp>
              <Grid item>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={onDrawerToggle}
                  className={classes.menuButton}
                >
                  <MenuIcon />
                </IconButton>
              </Grid>
            </Hidden>
            <Grid item xs />
            {/* <Grid item>
              <Tooltip title="Alerts • No alters">
                <IconButton color="inherit">
                  <NotificationsIcon />
                </IconButton>
              </Tooltip>
            </Grid> */}
            <Grid item>
              <IconButton
                onClick={handleClick}
                color="inherit"
                className={`iconButtonAvatar ${(classes.iconButtonAvatar)}`}
              >
                {avatarImage ? (
                  <Avatar src={avatarImage} style={avatarStyle} />
                ) : (
                  <PersonOutlineIcon style={avatarStyle} />
                )}
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                className={'headerProfilemenu'}
              >
                <MenuItem
                  disabled={true}
                >
                  {sprintf(__('Logged in as %s'), username)}
                </MenuItem>
                <MenuItem onClick={handleProfileClick}>
                  {__('Profile')}
                </MenuItem>
                <MenuItem onClick={handleSignout}>{__('Logout')}</MenuItem>
              </Menu>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

export default withStyles(styles)(Header);
