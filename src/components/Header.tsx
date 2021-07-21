import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
// import NotificationsIcon from '@material-ui/icons/Notifications';
import Toolbar from "@material-ui/core/Toolbar";
// import Tooltip from '@material-ui/core/Tooltip';
import { withStyles, Theme } from "@material-ui/core/styles";

import PersonIcon from "@material-ui/icons/Person";
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import MenuIcon from "@material-ui/icons/Menu";
import { signout } from "../auth";

import { __ } from "@wordpress/i18n";
import { connect } from "react-redux";
import Avatar from "@material-ui/core/Avatar";
import "./Header.scss";
import Logo from "./custom/logo.svg";

const lightColor = "rgba(255, 255, 255, 0.7)";

const styles = (theme: Theme) => ({
  secondaryBar: {
    zIndex: 0
  },
  menuButton: {
    marginLeft: -theme.spacing(1)
  },
  iconButtonAvatar: {
    padding: 4
  },
  link: {
    textDecoration: "none",
    color: lightColor,
    "&:hover": {
      color: theme.palette.common.white
    }
  },
  button: {
    borderColor: lightColor
  }
});

type OwnProps = {
  classes: any;
  onDrawerToggle: () => void;
};

type StateProps = {
  userAvatar: string | void;
};

type Props = OwnProps & StateProps;

const Header = (props: Props) => {
  const { classes, onDrawerToggle } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const headerStyle: React.CSSProperties = {
    backgroundColor: "#EE5F28"
  };

  const avatarStyle: React.CSSProperties = {
    width: "24px",
    height: "24px"
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    window.location.hash = "/user";
    handleClose();
  };

  const handleSignout = () => {
    handleClose();
    signout().then(() => {
      window.location.href = "/";
    });
  };
  return (
    <React.Fragment>
      <AppBar
        color="primary"
        style={headerStyle}
        position="sticky"
        elevation={0}
      >
        <Toolbar>
          <Grid container spacing={1} alignItems="center">
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
                {props.userAvatar ? (
                  <Avatar src={props.userAvatar} style={avatarStyle} />
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
                <MenuItem onClick={handleProfileClick}>
                  {__("Profile")}
                </MenuItem>
                <MenuItem onClick={handleSignout}>{__("Logout")}</MenuItem>
              </Menu>
            </Grid>



            <Grid item>
              <IconButton
                className="iconButtonlogo"
                href="https://geolonia.com/"
                target="_blank"
              >
                <img src={Logo} alt="" className="logo" />
              </IconButton>
            </Grid>



          </Grid>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

const mapStateToProps = (state: Geolonia.Redux.AppState): StateProps => {
  return {
    userAvatar: state.userMeta.avatarImage
  };
};
const ConnectedHeader = connect(mapStateToProps)(Header);

export default withStyles(styles)(ConnectedHeader);
