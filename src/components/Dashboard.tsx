import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withStyles,Theme } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import CodeIcon from '@material-ui/icons/Code';
import SatelliteIcon from '@material-ui/icons/Satellite';
import RoomIcon from '@material-ui/icons/Room';

import './Dashboard.scss'

const styles = (theme:Theme) => ({

});

const rows = [
  {name: "My Map", updated: "2019-08-28"},
  {name: "exmaple.com", updated: "2019-08-28"},
  {name: "exmaple.jp", updated: "2019-08-28"},
];

const handleChangePage = () => {

}

const handleChangeRowsPerPage = () => {

}

type Props= {
  classes: any
}

const Dashboard = (props: Props) => {
  const { classes } = props;

  return (
    <Grid id="dashboard" container className={classes.root} spacing={2}>
      <Grid item sm={12} md={6}>
        <Paper>
          <Typography component="h2" className="category-title">MAPs</Typography>
          <Typography component="h3" className="module-title"><CodeIcon /> API Keys</Typography>
          <Table className="api-keys">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Updated</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(row => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.updated}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5]}
                  colSpan={3}
                  count={rows.length}
                  rowsPerPage={5}
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
          <Typography component="h3" className="module-title"><SatelliteIcon /> Styles</Typography>
          <Table className="api-keys">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Updated</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(row => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.updated}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5]}
                  colSpan={3}
                  count={rows.length}
                  rowsPerPage={5}
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
      </Grid>
      <Grid item sm={12} md={6}>
        <Paper>
          <Typography component="h2">Data</Typography>
          <Typography component="h3"><RoomIcon /> Features</Typography>
          <Table className="api-keys">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Updated</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(row => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    {row.name} <span className="private-or-public">Private</span>
                  </TableCell>
                  <TableCell align="right">{row.updated}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5]}
                  colSpan={3}
                  count={rows.length}
                  rowsPerPage={5}
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
      </Grid>
    </Grid>
  );
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Dashboard);
