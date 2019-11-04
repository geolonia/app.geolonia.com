import React from "react";

// Components
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import BrightnessLowIcon from "@material-ui/icons/BrightnessLow";
import PersonIcon from "@material-ui/icons/Person";
import Title from "../../custom/Title";
import { AppState } from "../../../redux/store";
import { connect } from "react-redux";
import Invite from "./invite";
import ChangeRole from "./change-role";
import RemoveMember from "./remove-member";
import { Chip } from "@material-ui/core";

// utils
import { __ } from "@wordpress/i18n";

// Types
import { Team } from "../../../redux/actions/team";
import { Member, Roles } from "../../../redux/actions/team-member";

type Row = {
  id: number | string;
  avatar: string | void;
  name: string;
  username: string;
  role: Member["role"];
};

type OwnProps = {};
type StateProps = {
  team: Team | void;
  members: Member[];
};

type Props = OwnProps & StateProps;

const Content = (props: Props) => {
  const { members } = props;
  const [currentMember, setCurrentMember] = React.useState<false | Member>(
    false
  );
  const [openChangeRole, setOpenChangeRole] = React.useState(false);
  const [openSuspend, setOpenSuspend] = React.useState(false);
  const [openRemoveMember, setOpenRemoveMember] = React.useState(false);

  React.useEffect(() => {
    handleClose();
  }, [openChangeRole, openRemoveMember]);

  const rows: Row[] = members.map(member => {
    return {
      id: member.userSub,
      avatar: member.avatarImage,
      name: member.name,
      username: member.username,
      role: member.role
    };
  });

  let numOwners = 0;
  for (let i = 0; i < rows.length; i++) {
    if ('Owner' === rows[i]['role']) {
      numOwners = numOwners + 1;
    }
  }

  const firstCellStyle: React.CSSProperties = {
    width: "56px",
    padding: "8px 0 3px 8px"
  };

  const iconStyle: React.CSSProperties = {
    fontSize: "16px"
  };

  const handleChangePage = () => {};

  const handleChangeRowsPerPage = () => {};

  const onMouseOver = (e: any) => {
    e.currentTarget.className = "mouseover";
  };

  const onMouseOut = (e: any) => {
    e.currentTarget.className = "";
  };

  const onClick = (e: any) => {};

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const index = parseInt(event.currentTarget.value);
    const member = members[index];
    if (member) {
      setCurrentMember(members[index]);
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const breadcrumbItems = [
    {
      title: "Home",
      href: "#/"
    },
    {
      title: __("Team settings"),
      href: "#/team"
    },
    {
      title: __("Members"),
      href: null
    }
  ];

  return (
    <div>
      <Title title="Members" breadcrumb={breadcrumbItems}>
        {__("You can manage members in your team.")}
      </Title>
      <Invite />

      {/* each member management */}
      {currentMember && (
        <>
          <ChangeRole
            currentMember={currentMember}
            open={openChangeRole}
            toggle={setOpenChangeRole}
          />
          <RemoveMember
            currentMember={currentMember}
            open={openRemoveMember}
            toggle={setOpenRemoveMember}
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
                <PersonIcon />
              </TableCell>
              <TableCell component="th" scope="row">
                {row.name}
                <br />@{row.username}
              </TableCell>
              <TableCell align="center">
                {row.role === Roles.Owner ? (
                  <Chip label={__("Owner")} />
                ) : row.role === Roles.Deactivated ? (
                  <Chip label={__("Deactivated")} color={"secondary"} />
                ) : null}
              </TableCell>
              <TableCell align="right">
                {(() => {
                  if (2 > numOwners && 'Owner' === row.role) {
                    // There is only one owner and the row is owner, so nothing to return.
                  } else {
                    return (<Button
                      variant="outlined"
                      color="default"
                      aria-controls="simple-menu"
                      aria-haspopup="true"
                      onClick={handleClick}
                      value={index}
                    >
                      <BrightnessLowIcon style={iconStyle} />
                    </Button>)
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
                inputProps: { "aria-label": "rows per page" },
                native: true
              }}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
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
              id={"simple-menu"}
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => setOpenChangeRole(true)}>
                {__("Change role")}
              </MenuItem>
            </Menu>
          );
        } else {
          return (
            <Menu
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => setOpenChangeRole(true)}>
                {__("Change role")}
              </MenuItem>
              <MenuItem onClick={() => setOpenSuspend(true)}>
                {__("Suspend")}
              </MenuItem>
              <MenuItem onClick={() => setOpenRemoveMember(true)}>
                {__("Remove from team")}
              </MenuItem>
            </Menu>
          );
        }
      })()}
    </div>
  );
};

export const mapStateToProps = (state: AppState): StateProps => {
  const selectedTeamIndex = state.team.selectedIndex;
  const team = state.team.data[selectedTeamIndex] as Team | void;
  let members: Member[] = [];
  if (team) {
    const memberObject = state.teamMember[team.teamId];
    if (memberObject) {
      members = memberObject.data;
    }
  }
  return { team, members };
};

export default connect(mapStateToProps)(Content);
