import React, { useState } from 'react';
import clsx from 'clsx';
import { withStyles, Theme } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import CodeIcon from '@material-ui/icons/Code';
import ViewListIcon from '@material-ui/icons/ViewList';
import DescriptionIcon from '@material-ui/icons/Description';
// import RoomIcon from '@material-ui/icons/Room';
import GroupIcon from '@material-ui/icons/Group';
import PaymentIcon from '@material-ui/icons/Payment';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Cancel from './custom/Cancel';
import Save from './custom/Save';
import Alert from './custom/Alert';

import './Navigator.scss';
import defaultTeamIcon from './custom/team.svg';
import { Link } from '@material-ui/core';

import { __ } from '@wordpress/i18n';
import { connect } from 'react-redux';
import { createActions as createTeamActions } from '../redux/actions/team';

import createTeam from '../api/teams/create';

// types
import Redux from 'redux';

const styles = (theme: Theme) => ({
  categoryHeader: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  categoryHeaderPrimary: {
    color: theme.palette.common.white,
  },
  item: {
    paddingTop: 1,
    paddingBottom: 1,
    color: 'rgba(255, 255, 255, 0.7)',
    '&:hover,&:focus': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
  },
  itemCategory: {
    backgroundColor: '#232f3e',
    boxShadow: '0 -1px 0 #404854 inset',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  firebase: {
    fontSize: 24,
    color: theme.palette.common.white,
  },
  itemActiveItem: {
    color: '#4fc3f7',
  },
  itemPrimary: {
    fontSize: 'inherit',
  },
  itemIcon: {
    minWidth: 'auto',
    marginRight: theme.spacing(2),
  },
  divider: {
    marginTop: theme.spacing(2),
  },
});

const handleClickHome = () => {
  window.location.hash = '';
};

type OwnProps = {
  readonly classes: any;
  readonly PaperProps: any;
  readonly variant?: 'temporary';
  readonly open?: boolean;
  readonly onClose?: () => any;
};

type StateProps = {
  session: Geolonia.Session;
  teams: Geolonia.Team[];
  selectedTeamIndex: number;
  ownerEmail: string;
};

type DispatchProps = {
  selectTeam: (index: number) => void;
  addTeam: (team: Geolonia.Team) => void;
};

type Props = OwnProps & StateProps & DispatchProps;

const Navigator: React.FC<Props> = (props: Props) => {
  const initialValueForNewTeamName = __('My team');

  const {
    classes,
    teams,
    selectedTeamIndex,
    selectTeam,
    addTeam,
    ownerEmail,
    ...other
  } = props;
  const [open, setOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState(
    initialValueForNewTeamName,
  );

  const selectedTeam: Geolonia.Team | undefined = teams[selectedTeamIndex];

  const teamSettingsChildren = [
    {
      id: __('General'),
      icon: <ViewListIcon />,
      href: '#/team/general',
      active: false,
    },
    {
      id: __('Members'),
      icon: <GroupIcon />,
      href: '#/team/members',
      active: false,
    },
  ];

  if (selectedTeam?.billingMode === 'STRIPE') {
    teamSettingsChildren.push({
      id: __('Billing'),
      icon: <PaymentIcon />,
      href: '#/team/billing',
      active: false,
    });
  }

  const mapChildren = [
    {
      id: __('Manage API keys'),
      icon: <CodeIcon />,
      href: '#/api-keys',
      active: false,
    },
    // {
    //   id: __('Location Data'),
    //   icon: <RoomIcon />,
    //   href: '#/data/geojson',
    //   active: false,
    // },
    // { id: 'Styles', icon: <SatelliteIcon />, href: "#/maps/styles", active: false },
    // { id: 'Geolonia Live Locations', icon: <MyLocationIcon />, href: "#/data/features", active: false },
  ];

  const categories = [
    {
      id: __('Map'),
      children: mapChildren,
    },
    {
      id: __('Team Settings'),
      children: teamSettingsChildren,
    },
    {
      id: __('Documentation'),
      children: [
        {
          id: __('Official Documents'),
          icon: <DescriptionIcon />,
          href: 'https://docs.geolonia.com/',
          active: false,
        },
      ],
    },
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
    return createTeam(session, newTeamName, ownerEmail).then((result) => {
      if (result.error) {
        throw new Error(result.code);
      } else {
        handleClose();
        addTeam(result.data);
        const nextTeamIndex = teams.length;
        selectTeam(nextTeamIndex);
        window.location.hash = '#/team/general';
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
              e.target.value !== '__not_selectable' &&
                props.selectTeam(e.target.value);
            }}
          >
            {teams.map((team, index) => (
              <MenuItem key={team.teamId} value={index}>
                {team.name}
              </MenuItem>
            ))}
            <MenuItem className="create-new-team" value="__not_selectable">
              <Link onClick={handleClickOpen}>+ {__('Create a new team')}</Link>
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
              primary: classes.itemPrimary,
            }}
          >
            {__('Home')}
          </ListItemText>
        </ListItem>
        {categories.map(({ id, children }) => (
          children.length > 0 && <React.Fragment key={id}>
            <ListItem className={classes.categoryHeader}>
              <ListItemText
                classes={{
                  primary: classes.categoryHeaderPrimary,
                }}
              >
                {id}
              </ListItemText>
            </ListItem>
            {children.map(({ id: childId, icon, active, href }) => {
              let target = undefined;
              let rel = undefined;
              try {
                const targetHost = new URL(href).host;
                const currentHost = new URL(window.location.href).host;
                if (targetHost && targetHost !== currentHost) {
                  target = '_blank';
                  rel = 'noopener noreferrer';
                }
              } catch (error) {
                // nothing to do
              }
              return <ListItem
                button
                component="a"
                href={href}
                target={target}
                rel={rel}
                key={childId}
                className={clsx(classes.item, active && classes.itemActiveItem)}
              >
                <ListItemIcon className={classes.itemIcon}>{icon}</ListItemIcon>
                <ListItemText
                  classes={{
                    primary: classes.itemPrimary,
                  }}
                >
                  {childId}
                </ListItemText>
              </ListItem>;
            })}
            <Divider className={classes.divider} />
          </React.Fragment>
        ))}
      </List>

      <Alert type={'custom-outlined'}>
        {__(
          'The dashboard has been renewed. The GeoJSON API that we used to provide is currently not accessible due to functional modifications. If you need to download the data, please <a href="https://geolonia.com/contact/" target="_blank">contact us</a>.',
        )}
      </Alert>

      <form>
        <Dialog
          open={open}
          onClose={handleClose}
          fullWidth={true}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            {__('Create a new team')}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {__('Please enter the name of new team.')}
            </DialogContentText>
            <TextField
              autoFocus
              margin="normal"
              name="team-name"
              label={__('Name')}
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              fullWidth
            />
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

const mapStateToProps = (state: Geolonia.Redux.AppState): StateProps => ({
  teams: state.team.data,
  selectedTeamIndex: state.team.selectedIndex,
  session: state.authSupport.session,
  ownerEmail: state.userMeta.email,
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): DispatchProps => ({
  selectTeam: (index: number) => dispatch(createTeamActions.select(index)),
  addTeam: (team: Geolonia.Team) => dispatch(createTeamActions.add(team)),
});

const ConnectedNavigator = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Navigator);

export default withStyles(styles)(ConnectedNavigator);
