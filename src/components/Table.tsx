import React from 'react';
import PropTypes, { number } from 'prop-types';

import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

const handleChangePage = () => {

}

const handleChangeRowsPerPage = () => {

}

type Props= {
  rows: object,
  rowsPerPage: number,
}

const Content = (props: any) => {
  return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Updated</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.rows.map((row: any) => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row">
                {row.name}
                {row.isPublic && (<span className="private-or-public">Public</span>)}
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
              count={props.rows.length}
              rowsPerPage={props.rowsPerPage}
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
  );
}

Content.propTypes = {
  rows: PropTypes.object.isRequired,
  rowsPerPage: PropTypes.number,
};

Content.defaultProps = {
  rows: [],
  rowsPerPage: 5,
};

export default Content;
