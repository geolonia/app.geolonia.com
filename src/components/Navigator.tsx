import React from "react";
import clsx from "clsx";
import { withStyles, Theme } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import HomeIcon from "@material-ui/icons/Home";
import CodeIcon from "@material-ui/icons/Code";
import ViewListIcon from "@material-ui/icons/ViewList";
import RoomIcon from "@material-ui/icons/Room";
import GroupIcon from "@material-ui/icons/Group";
import PaymentIcon from "@material-ui/icons/Payment";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Save from "./custom/Save";

import "./Navigator.scss";
import defaultGroupIcon from "./custom/group.svg";
import { Link } from "@material-ui/core";

import { __ } from "@wordpress/i18n";

const styles = (theme: Theme) => ({
  categoryHeader: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  },
  categoryHeaderPrimary: {
    color: theme.palette.common.white
  },
  item: {
    paddingTop: 1,
    paddingBottom: 1,
    color: "rgba(255, 255, 255, 0.7)",
    "&:hover,&:focus": {
      backgroundColor: "rgba(255, 255, 255, 0.08)"
    }
  },
  itemCategory: {
    backgroundColor: "#232f3e",
    boxShadow: "0 -1px 0 #404854 inset",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  },
  firebase: {
    fontSize: 24,
    color: theme.palette.common.white
  },
  itemActiveItem: {
    color: "#4fc3f7"
  },
  itemPrimary: {
    fontSize: "inherit"
  },
  itemIcon: {
    minWidth: "auto",
    marginRight: theme.spacing(2)
  },
  divider: {
    marginTop: theme.spacing(2)
  }
});

const handleClickHome = () => {
  window.location.hash = "";
};

type Props = {
  readonly classes: any;
  readonly PaperProps: any;
  readonly variant?: "temporary";
  readonly open?: boolean;
  readonly onClose?: () => any;
};

const Navigator: React.FC<Props> = (props: Props) => {
  const { classes, ...other } = props;
  const [open, setOpen] = React.useState(false);

  const categories = [
    {
      id: __("Maps"),
      children: [
        {
          id: __("API keys"),
          icon: <CodeIcon />,
          href: "#/maps/api-keys",
          active: false
        }
        // { id: 'Styles', icon: <SatelliteIcon />, href: "#/maps/styles", active: false },
      ]
    },
    {
      id: __("GIS Services"),
      children: [
        {
          id: __("Gcloud"),
          icon: <RoomIcon />,
          href: "#/data/gis",
          active: false
        }
        // { id: 'Geolonia Live Locations', icon: <MyLocationIcon />, href: "#/data/features", active: false },
      ]
    },
    {
      id: __("Team Settings"),
      children: [
        {
          id: __("General"),
          icon: <ViewListIcon />,
          href: "#/team/general",
          active: false
        },
        {
          id: __("Members"),
          icon: <GroupIcon />,
          href: "#/team/members",
          active: false
        },
        {
          id: __("Billing"),
          icon: <PaymentIcon />,
          href: "#/team/billing",
          active: false
        }
      ]
    }
  ];

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onCreateTeam = () => {};

  return (
    <Drawer id="navigator" variant="permanent" {...other}>
      <List disablePadding>
        <ListItem
          className={clsx(classes.firebase, classes.item, classes.itemCategory)}
        >
          <img src={defaultGroupIcon} className="logo" alt="" />
          <Select className="team" value="default-team">
            <MenuItem value="default-team">miya0001</MenuItem>
            <MenuItem className="create-new-team">
              <Link onClick={handleClickOpen}>+ {__("Create a new team")}</Link>
            </MenuItem>
          </Select>
        </ListItem>
        <ListItem
          button
          component="a"
          onClick={handleClickHome}
          className={clsx(classes.item, classes.itemCategory)}
        >
          <ListItemIcon className={classes.itemIcon}>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText
            classes={{
              primary: classes.itemPrimary
            }}
          >
            {__("Dashboard")}
          </ListItemText>
        </ListItem>
        {categories.map(({ id, children }) => (
          <React.Fragment key={id}>
            <ListItem className={classes.categoryHeader}>
              <ListItemText
                classes={{
                  primary: classes.categoryHeaderPrimary
                }}
              >
                {id}
              </ListItemText>
            </ListItem>
            {children.map(({ id: childId, icon, active, href }) => (
              <ListItem
                button
                component="a"
                href={href}
                key={childId}
                className={clsx(classes.item, active && classes.itemActiveItem)}
              >
                <ListItemIcon className={classes.itemIcon}>{icon}</ListItemIcon>
                <ListItemText
                  classes={{
                    primary: classes.itemPrimary
                  }}
                >
                  {childId}
                </ListItemText>
              </ListItem>
            ))}
            <Divider className={classes.divider} />
          </React.Fragment>
        ))}
      </List>

      <form>
        <Dialog
          open={open}
          onClose={handleClose}
          fullWidth={true}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            {__("Create a new team")}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              name="team-name"
              label={__("Name")}
              value={__("My team")}
              fullWidth={true}
            />
            <TextField
              label={__("Billing email")}
              value=""
              fullWidth={true}
            />
            <p className="mute">We’ll send receipts to this inbox.</p>
          </DialogContent>
          <DialogActions>
            <Save handler={onCreateTeam} />
          </DialogActions>
        </Dialog>
      </form>
    </Drawer>
  );
};

export default withStyles(styles)(Navigator);
