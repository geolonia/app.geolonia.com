import React from "react";

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

import { __ } from "@wordpress/i18n";

import AddNew from "../custom/AddNew";
import Title from "../custom/Title";

const rows = [
  {
    id: 1111,
    avatar: "https://avatars2.githubusercontent.com/u/309946?s=400&v=4",
    name: "Taro Yamada",
    username: "taro",
    isOwner: true
  },
  {
    id: 1112,
    avatar: "https://avatars2.githubusercontent.com/u/309946?s=400&v=4",
    name: "Hanako Yamada",
    username: "taro",
    isOwner: false
  },
  {
    id: 1113,
    avatar: "https://avatars2.githubusercontent.com/u/309946?s=400&v=4",
    name: "Ichiro Suzuki",
    username: "taro",
    isOwner: true
  }
];

const Content = () => {
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
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const inviteHandler = (value: string) => {
    console.log(value);
    return Promise.resolve();
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

      <Table className="geolonia-list-table">
        <TableBody>
          {rows.map((row: any) => (
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
                >
                  <BrightnessLowIcon style={iconStyle} />
                </Button>
                <Menu
                  id="simple-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleClose}>{__("Change role")}</MenuItem>
                  <MenuItem onClick={handleClose}>{__("Deactivate")}</MenuItem>
                  <MenuItem onClick={handleClose}>
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

export default Content;
