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
import DescriptionIcon from "@material-ui/icons/Description";
import RoomIcon from "@material-ui/icons/Room";
import GroupIcon from "@material-ui/icons/Group";
import PaymentIcon from "@material-ui/icons/Payment";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Cancel from "./custom/Cancel";
import Save from "./custom/Save";

import "./Navigator.scss";
import defaultTeamIcon from "./custom/team.svg";
import { Link } from "@material-ui/core";

import { __ } from "@wordpress/i18n";
import { connect } from "react-redux";
import {
  createActions as createTeamActions,
  Team
} from "../redux/actions/team";

import createTeam from "../api/teams/create";

// types
import { AppState, Session } from "../types";
import Redux from "redux";

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

type OwnProps = {
  readonly classes: any;
  readonly PaperProps: any;
  readonly variant?: "temporary";
  readonly open?: boolean;
  readonly onClose?: () => any;
};

type StateProps = {
  session: Session;
  teams: Team[];
  selectedTeamIndex: number;
  ownerEmail: string;
};

type DispatchProps = {
  selectTeam: (index: number) => void;
  addTeam: (team: Team) => void;
};

type Props = OwnProps & StateProps & DispatchProps;

const Navigator: React.FC<Props> = (props: Props) => {
  const initialValueForNewTeamName = __("My team");

  const {
    classes,
    teams,
    selectedTeamIndex,
    selectTeam,
    addTeam,
    ownerEmail,
    ...other
  } = props;
  const [open, setOpen] = React.useState(false);
  const [newTeamName, setNewTeamName] = React.useState(
    initialValueForNewTeamName
  );

  const categories = [
    {
      id: __("API keys"),
      children: [
        {
          id: __("Manage API keys"),
          icon: <CodeIcon />,
          href: "#/api-keys",
          active: false
        }
        // { id: 'Styles', icon: <SatelliteIcon />, href: "#/maps/styles", active: false },
      ]
    },
    {
      id: __("API Services"),
      children: [
        {
          id: __("GeoJSON API"),
          icon: <RoomIcon />,
          href: "#/data/geojson",
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
        // {
        //   id: __("Billing"),
        //   icon: <PaymentIcon />,
        //   href: "#/team/billing",
        //   active: false
        // }
      ]
    },
    {
      id: __("Documentation"),
      children: [
        {
          id: __("Official Documents"),
          icon: <DescriptionIcon />,
          href: "https://docs.geolonia.com/",
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
    setNewTeamName(initialValueForNewTeamName);
  };

  const saveHandler = () => {
    const { session } = props;
    return createTeam(session, newTeamName, ownerEmail).then(result => {
      if (result.error) {
        throw new Error(result.code);
      } else {
        handleClose();
        addTeam(result.data);
        const nextTeamIndex = teams.length;
        selectTeam(nextTeamIndex);
        window.location.hash = "#/team/general";
        window.location.reload();
      }
    });
  };

  return (
    <Drawer id="navigator" variant="permanent" {...other}>
      <List disablePadding>
        <ListItem
          className={clsx(classes.firebase, classes.item, classes.itemCategory)}
        >
          <img
            src={
              (teams[selectedTeamIndex] &&
                teams[selectedTeamIndex].avatarImage) ||
              defaultTeamIcon
            }
            className="logo"
            alt=""
          />
          <Select
            className="team"
            value={selectedTeamIndex}
            onChange={(e: any) => {
              "__not_selectable" !== e.target.value &&
                props.selectTeam(e.target.value);
            }}
          >
            {teams.map((team, index) => (
              <MenuItem key={team.teamId} value={index}>
                {team.name}
              </MenuItem>
            ))}
            <MenuItem className="create-new-team" value="__not_selectable">
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
            <DialogContentText>
              {__("Please enter the name of new team.")}
            </DialogContentText>
            <TextField
              autoFocus
              margin="normal"
              name="team-name"
              label={__("Name")}
              value={newTeamName}
              onChange={e => setNewTeamName(e.target.value)}
              fullWidth
            />

            <TextField
              id="team-billing-email"
              label={__("Billing email")}
              margin="normal"
              fullWidth={true}
              value={ownerEmail}
              disabled={true}
            />

            <p className="mute">{__("We'll send you an email receipt.")}</p>
          </DialogContent>
          <DialogActions>
            <Cancel handler={handleClose}></Cancel>
            <Save onClick={saveHandler} disabled={!newTeamName}></Save>
          </DialogActions>
        </Dialog>
      </form>
    </Drawer>
  );
};

const mapStateToProps = (state: AppState): StateProps => ({
  teams: state.team.data,
  selectedTeamIndex: state.team.selectedIndex,
  session: state.authSupport.session,
  ownerEmail: state.userMeta.email
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): DispatchProps => ({
  selectTeam: (index: number) => dispatch(createTeamActions.select(index)),
  addTeam: (team: Team) => dispatch(createTeamActions.add(team))
});

const ConnectedNavigator = connect(
  mapStateToProps,
  mapDispatchToProps
)(Navigator);

export default withStyles(styles)(ConnectedNavigator);
