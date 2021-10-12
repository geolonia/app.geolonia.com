import React, { useState, useEffect, useCallback } from 'react';

// Components
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import BrightnessLowIcon from '@material-ui/icons/BrightnessLow';
import PersonIcon from '@material-ui/icons/Person';
import Title from '../../custom/Title';
import Invite from './invite';
import ChangeRole from './change-role';
import Suspend from './suspend';
import RemoveMember from './remove-member';
import { Chip, Avatar, CircularProgress, Typography } from '@material-ui/core';
import Alert from '../../custom/Alert';

// utils
import { __ } from '@wordpress/i18n';

import { Roles } from '../../../constants';

// Redux
import { useGetTeamMembersQuery, useGetUserQuery } from '../../../redux/apis/app-api';
import { useSelectedTeam } from '../../../redux/hooks';
import { useSession } from '../../../hooks/session';

type Row = {
  id: number | string;
  avatar: string | void;
  name: string;
  username: string;
  role: Geolonia.Role;
  yourself: boolean;
};

const Members: React.FC = () => {
  const [currentMember, setCurrentMember] = useState<
    false | Geolonia.Member
  >(false);

  // Dialogs open
  const [openChangeRole, setOpenChangeRole] = useState(false);
  const [openSuspend, setOpenSuspend] = useState(false);
  const [openUnsuspend, setOpenUnsuspend] = useState(false);
  const [openRemoveMember, setOpenRemoveMember] = useState(false);
  const [openLeave, setOpenLeave] = useState(false);

  const { selectedTeam } = useSelectedTeam();
  const { userSub } = useSession();
  const { data: currentUser } = useGetUserQuery({ userSub }, { skip: !userSub });
  const { data: members, isFetching } = useGetTeamMembersQuery(selectedTeam?.teamId || '', {
    skip: !selectedTeam,
  });

  const rows: Row[] = (members || []).map((member) => {
    return {
      id: member.userSub,
      avatar: member.avatarImage,
      name: member.name,
      username: member.username,
      role: member.role,
      yourself: !!currentUser && (member.username === currentUser.username),
    };
  });

  let numOwners = 0;
  for (let i = 0; i < rows.length; i++) {
    if (rows[i]['role'] === 'Owner') {
      numOwners = numOwners + 1;
    }
  }

  const firstCellStyle: React.CSSProperties = {
    width: '56px',
    padding: '8px 0 3px 8px',
  };

  const iconStyle: React.CSSProperties = {
    fontSize: '16px',
  };

  const avatarStyle: React.CSSProperties = {
    width: '24px',
    height: '24px',
  };

  const handleChangePage = () => {};

  const handleChangeRowsPerPage = () => {};

  const onMouseOver = (e: any) => {
    e.currentTarget.className = 'mouseover';
  };

  const onMouseOut = (e: any) => {
    e.currentTarget.className = '';
  };

  const onClick = (e: any) => {};

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    if (!members) return;

    const index = parseInt(event.currentTarget.value);
    const member = members[index];
    if (member) {
      setCurrentMember(members[index]);
      setAnchorEl(event.currentTarget);
    }
  }, [members]);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  useEffect(() => {
    handleClose();
  }, [openChangeRole, openSuspend, openUnsuspend, openRemoveMember, openLeave, handleClose]);

  const breadcrumbItems = [
    {
      title: __('Home'),
      href: '#/',
    },
    {
      title: __('Team settings'),
      href: '#/team/general',
    },
  ];

  let isOwner = false;
  if (selectedTeam) {
    isOwner = selectedTeam.role === Roles.Owner;
  }

  const inviteDisabled =
    !isOwner || !( selectedTeam && (selectedTeam.maxMemberLength > (members || []).length));

  if (isFetching || !selectedTeam) {
    return <CircularProgress />;
  }

  return (
    <div>
      <Title title={__('Members')} breadcrumb={breadcrumbItems}>
        {__('You can manage members in your team.')}

        { isOwner && inviteDisabled &&
          <Alert type="danger">
            {__(
              'You currently can not invite any new members.',
            )}
          </Alert>
        }
      </Title>

      { isOwner &&
        <Invite
          team={selectedTeam}
          members={members || []}
          disabled={inviteDisabled}
        />
      }

      {/* each member management */}
      {currentMember && (
        <>
          <ChangeRole
            team={selectedTeam}
            currentMember={currentMember}
            open={openChangeRole}
            toggle={setOpenChangeRole}
          />
          <Suspend
            team={selectedTeam}
            currentMember={currentMember}
            open={openSuspend}
            toggle={setOpenSuspend}
            mode={'suspending'}
          />
          <Suspend
            team={selectedTeam}
            currentMember={currentMember}
            open={openUnsuspend}
            toggle={setOpenUnsuspend}
            mode={'unsuspending'}
          />
          <RemoveMember
            team={selectedTeam}
            currentMember={currentMember}
            open={openRemoveMember}
            toggle={setOpenRemoveMember}
            mode={'remove'}
          />
          <RemoveMember
            team={selectedTeam}
            currentMember={currentMember}
            open={openLeave}
            toggle={setOpenLeave}
            mode={'leave'}
          />
        </>
      )}
      <Table className="geolonia-list-table">
        <TableBody>
          {rows.map((row, index) => (
            <TableRow
              key={row.id}
              onMouseOver={onMouseOver}
              onMouseOut={onMouseOut}
              onClick={onClick}
              data-id={row.id}
            >
              <TableCell style={firstCellStyle} padding="none">
                {row.avatar ? (
                  <Avatar src={row.avatar} style={avatarStyle} />
                ) : (
                  <PersonIcon color={row.yourself ? 'primary' : undefined} />
                )}
              </TableCell>
              <TableCell component="th" scope="row">
                <Typography color={row.yourself ? 'primary' : undefined}>
                  {row.name}
                  <br />@{row.username}
                </Typography>
              </TableCell>
              <TableCell align="center">
                {row.role === Roles.Owner ? (
                  <Chip label={__('Owner')} />
                ) : row.role === Roles.Suspended ? (
                  <Chip label={__('Suspended')} color={'secondary'} />
                ) : null}
              </TableCell>
              <TableCell align="right">
                {(() => {
                  if (
                    (numOwners < 2 && row.role === 'Owner') ||
                    (!isOwner && !row.yourself)
                  ) {
                    // There is only one owner and the row is owner, so nothing to return.
                  } else {
                    return (
                      <Button
                        variant="outlined"
                        color="default"
                        aria-controls="simple-menu"
                        aria-haspopup="true"
                        onClick={handleClick}
                        value={index}
                      >
                        <BrightnessLowIcon style={iconStyle} />
                      </Button>
                    );
                  }
                })()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5]}
              colSpan={4}
              count={rows.length}
              rowsPerPage={20}
              page={0}
              SelectProps={{
                inputProps: { 'aria-label': __('rows per page') },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableRow>
        </TableFooter>
      </Table>

      {(() => {
        if (!currentMember) {
          return null;
        }

        if (currentMember.role === Roles.Owner) {
          return (
            <Menu
              id={'simple-menu'}
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => setOpenChangeRole(true)}>
                {__('Change role')}
              </MenuItem>
            </Menu>
          );
        } else {
          const yourself = currentUser && (currentMember.username === currentUser.username);
          return (
            <Menu
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {
                !yourself && currentMember.role !== Roles.Suspended &&
                  <MenuItem onClick={() => setOpenChangeRole(true)}>
                    {__('Change role')}
                  </MenuItem>
              }
              {!yourself && (currentMember.role === Roles.Suspended ?
                <MenuItem onClick={() => setOpenUnsuspend(true)}>
                  {__('Unsuspend')}
                </MenuItem> : (
                  <MenuItem onClick={() => setOpenSuspend(true)}>
                    {__('Suspend')}
                  </MenuItem>
                ))}
              <MenuItem onClick={() => yourself ? setOpenLeave(true) : setOpenRemoveMember(true)}>
                {yourself ? __('Leave the team') : __('Remove from team')}
              </MenuItem>
            </Menu>
          );
        }
      })()}
    </div>
  );
};

export default Members;
