import React from 'react';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
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

import logo from '../custom/logo.svg';

const rows = [
  {id: 1111, icon: logo, name: "Taro Yamada", username: 'taro', isOwner: true},
  {id: 1112, icon: logo, name: "Hanako Yamada", username: 'taro', isOwner: false},
  {id: 1113, icon: logo, name: "Ichiro Suzuki", username: 'taro', isOwner: true},
];

const Content = () => {

  const imgStyle: React.CSSProperties = {
    width: '100%',
  }

  const firstCellStyle: React.CSSProperties = {
    width: '56px',
    padding: '8px 0 3px 8px',
  }

  const iconStyle: React.CSSProperties = {
    fontSize: '16px'
  }

  const handleChangePage = () => {

  }

  const handleChangeRowsPerPage = () => {

  }

  const onMouseOver = (e: any) => {
    e.currentTarget.className = 'mouseover';
  }

  const onMouseOut = (e: any) => {
    e.currentTarget.className = '';
  }

  const onClick = (e: any) => {

  }

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }

  const handleClose = () => {
    setAnchorEl(null);
  }

  return (
    <Paper>
      <Typography component="h2" className="module-title">Team Members</Typography>

      <Table className="geolonia-list-table">
        <TableBody>
          {rows.map((row: any) => (
            <TableRow key={row.id} onMouseOver={onMouseOver} onMouseOut={onMouseOut} onClick={onClick} data-id={row.id}>
              <TableCell style={firstCellStyle} padding="none"><img style={imgStyle} src={row.icon} alt="" /></TableCell>
              <TableCell component="th" scope="row">
                {row.name}<br />@{row.username}
              </TableCell>
              <TableCell align="center">{row.isOwner && 'Owner'}</TableCell>
              <TableCell align="right">
                <Button variant="outlined" color="default" aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}><BrightnessLowIcon style={iconStyle} /></Button>
                <Menu
                  id="simple-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleClose}>Change role</MenuItem>
                  <MenuItem onClick={handleClose}>Remove from team</MenuItem>
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
                inputProps: { 'aria-label': 'rows per page' },
                native: true,
              }}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </Paper>
  );
}

export default Content;
