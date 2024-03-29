import React, { useCallback, useEffect, useState } from 'react';
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
import classNames from 'classnames';
import { useLocation } from 'react-router-dom';

// types
import { useAppDispatch, useImageFromURL, useSelectedTeam } from '../redux/hooks';
import { useCreateTeamMutation, useGetTeamsQuery, useGetUserQuery } from '../redux/apis/app-api';
import { selectTeam } from '../redux/actions/team';
import { useHistory } from 'react-router';
import { colorPrimary } from '../variables';
import { useSession } from '../hooks/session';

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
    color: colorPrimary,
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

type Props = {
  readonly classes: any;
  readonly PaperProps: any;
  readonly variant?: 'temporary';
  readonly open?: boolean;
  readonly onClose?: () => any;
};

const Navigator: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();
  const { push, location } = useHistory();
  const { userSub } = useSession();
  const { data: owner } = useGetUserQuery({ userSub }, { skip: !userSub });
  const initialValueForNewTeamName = __('My team');

  const [ createTeam ] = useCreateTeamMutation();

  const {
    classes,
    ...other
  } = props;

  const { pathname } = useLocation();

  const [open, setOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState(
    initialValueForNewTeamName,
  );

  const { data: teams, refetch: refetchTeams, isFetching } = useGetTeamsQuery(undefined, {
    skip: !userSub,
  });
  const [selectingTeamId, setSelectingTeamId] = useState<string | null>(null);
  const { selectedTeam, refetch: refetchTeam, isFetching: isTeamFetching } = useSelectedTeam();
  const teamAvatar = useImageFromURL(
    selectedTeam?.teamId,
    selectedTeam?.links.getAvatar || '',
    {
      onError: refetchTeam,
    },
  );

  const teamSettingsChildren = [
    {
      id: __('General'),
      icon: <ViewListIcon />,
      href: '/team/general',
    },
    {
      id: __('Members'),
      icon: <GroupIcon />,
      href: '/team/members',
    },
  ];

  if (selectedTeam?.billingMode === 'STRIPE' || selectedTeam?.billingMode === 'INVOICE') {
    teamSettingsChildren.push({
      id: __('Billing'),
      icon: <PaymentIcon />,
      href: '/team/billing',
    });
  }

  const mapChildren = [
    {
      id: __('Manage API keys'),
      icon: <CodeIcon />,
      href: '/api-keys',
    },
    // {
    //   id: __('Location Data'),
    //   icon: <RoomIcon />,
    //   href: '/data/geojson',
    // },
    // { id: 'Styles', icon: <SatelliteIcon />, href: "/maps/styles" },
    // { id: 'Geolonia Live Locations', icon: <MyLocationIcon />, href: "/data/features" },
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
        },
      ],
    },
  ];

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = useCallback(() => {
    setOpen(false);
    setNewTeamName(initialValueForNewTeamName);
  }, [initialValueForNewTeamName]);

  const saveHandler = useCallback(async () => {
    if (!owner) return;
    const result = await createTeam({ name: newTeamName, billingEmail: owner.email });
    if ('error' in result) {
      throw new Error(JSON.stringify(result.error));
    }

    handleClose();

    refetchTeams();
    setSelectingTeamId(result.data.teamId);
  }, [createTeam, handleClose, newTeamName, owner, refetchTeams]);

  useEffect(() => {
    if (!isFetching && selectingTeamId) {
      dispatch(selectTeam({ teamId: selectingTeamId }));
      if (location.pathname !== '/team/general') {
        push('/team/general');
      }
    }
  }, [dispatch, isFetching, location.pathname, push, selectingTeamId]);

  return (
    <Drawer id="navigator" variant="permanent" {...other}>
      <List disablePadding>
        <ListItem
          className={clsx(classes.firebase, classes.item, classes.itemCategory)}
        >
          <img
            src={ teamAvatar || defaultTeamIcon }
            className={classNames('logo', isTeamFetching ? ' is-team-fetching' : '')}
            alt=""
          />
          { selectedTeam && !isTeamFetching &&
            <Select
              className="team"
              value={selectedTeam.teamId}
              onChange={(e: any) => {
                e.target.value !== '__not_selectable' &&
                  dispatch(selectTeam({ teamId: e.target.value }));
              }}
            >
              {teams?.map(({teamId, name}) => (
                <MenuItem key={teamId} value={teamId}>
                  {name}
                </MenuItem>
              ))}
              <MenuItem className="create-new-team" value="__not_selectable">
                <Link onClick={handleClickOpen}>+ {__('Create a new team')}</Link>
              </MenuItem>
            </Select>
          }
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
            {children.map(({ id: childId, icon, href }) => {
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
              const active = href === pathname;
              return <ListItem
                button
                component="a"
                href={href.indexOf('https://') === 0 ? href : `#${href}`}
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

export default withStyles(styles)(Navigator);
