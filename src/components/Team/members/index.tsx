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
import AddNew from "../../custom/AddNew";
import Title from "../../custom/Title";
import { AppState } from "../../../redux/store";
import { connect } from "react-redux";
import { Member } from "../../../redux/actions/team-member";
import ChangeRole from "./change-role";
import DeactivateMember from "./deactivate-member";
import RemoveMember from "./remove-member";

// utils
import { __ } from "@wordpress/i18n";

// types
import AmazonCognitoIdentity from "amazon-cognito-identity-js";

// redux
import Redux from "redux";
import { createActions as createTeamMemberActions } from "../../../redux/actions/team-member";

// API
import addMember from "../../../api/members/add";

type Row = {
  id: number | string;
  avatar: string | void;
  name: string;
  username: string;
  deactivated: boolean;
  isOwner: boolean;
};

type OwnProps = {};
type StateProps = {
  session?: AmazonCognitoIdentity.CognitoUserSession;
  teamId: string;
  teamName: string;
  members: Member[];
};
type DispatchProps = {
  addMemberState: (teamId: string, member: Member) => void;
};
type Props = OwnProps & StateProps & DispatchProps;

const Content = (props: Props) => {
  const { members, teamName } = props;
  const [currentMember, setCurrentMember] = React.useState<false | Member>(
    false
  );
  const [openChangeRole, setOpenChangeRole] = React.useState(false);
  const [openDeactivateMember, setOpenDeactivateMember] = React.useState(false);
  const [openRemoveMember, setOpenRemoveMember] = React.useState(false);

  React.useEffect(() => {
    handleClose();
  }, [openChangeRole, openDeactivateMember, openRemoveMember]);

  const rows: Row[] = members.map(member => {
    return {
      id: member.userSub,
      avatar: member.avatarImage,
      name: member.name,
      username: member.username,
      deactivated: !!member.deactivated,
      isOwner: member.role === "Owner"
    };
  });

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

  const inviteHandler = (email: string) => {
    const { session, teamId, addMemberState } = props;
    // TODO: loading
    return addMember(session, teamId, email).then(member => {
      addMemberState(teamId, member);
    });
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
      <AddNew
        buttonLabel={__("Invite")}
        label={__("Invite a member")}
        description={__(
          "We automatically update your billing as you add and remove team members."
        )}
        default=""
        fieldName="email"
        fieldLabel={__("Email")}
        fieldType="email"
        handler={inviteHandler}
      />

      {/* each member management */}
      {currentMember && (
        <>
          <ChangeRole
            currentMember={currentMember}
            open={openChangeRole}
            toggle={setOpenChangeRole}
          />
          <DeactivateMember
            currentMember={currentMember}
            open={openDeactivateMember}
            toggle={setOpenDeactivateMember}
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
              <TableCell align="center">{row.isOwner && __("Owner")}</TableCell>
              <TableCell align="right">
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
                <Menu
                  id={`simple-menu-${row.id}`}
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={() => setOpenChangeRole(true)}>
                    {__("Change role")}
                  </MenuItem>
                  <MenuItem onClick={() => setOpenDeactivateMember(true)}>
                    {__("Deactivate")}
                  </MenuItem>
                  <MenuItem onClick={() => setOpenRemoveMember(true)}>
                    {__("Remove from team")}
                  </MenuItem>
                </Menu>
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
    </div>
  );
};

export const mapStateToProps = (state: AppState) => {
  const { session } = state.authSupport;
  const selectedTeamIndex = state.team.selectedIndex;
  const { teamId, name: teamName } = state.team.data[selectedTeamIndex];
  const memberObject = state.teamMember[teamId];
  if (memberObject) {
    return { session, teamId, teamName, members: memberObject.data };
  } else {
    return { session, teamId, teamName, members: [] };
  }
};

export const mapDispatchToProps = (dispatch: Redux.Dispatch) => ({
  addMemberState: (teamId: string, member: Member) =>
    dispatch(createTeamMemberActions.add(teamId, member))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Content);
