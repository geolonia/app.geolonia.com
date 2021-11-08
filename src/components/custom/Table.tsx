import React, { useState } from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import Chip from '@material-ui/core/Chip';

// utils
import { __ } from '@wordpress/i18n';
import styled from 'styled-components';

// styles
import './Table.scss';

type Props = {
  rows: {
    id: string | number;
    name: string;
    isPublic?: boolean;
    updated: string;
  }[];
  rowsPerPage?: number;
  permalink: string;
};

type TablePaginationActionsProps = {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
};

const PagenationWrap = styled.div`
  flex-shrink: 0;
  margin-left: 2.5em;
`;

const TablePaginationActions = (props: TablePaginationActionsProps) => {
  const { count, page, rowsPerPage, onPageChange } = props;
  const lastPage = Math.ceil(count / rowsPerPage) - 1;

  return (
    <PagenationWrap>
      <IconButton
        onClick={(e) => onPageChange(e, 0)}
        disabled={page === 0}
        aria-label={__('first page')}
      >
        <FirstPageIcon />
      </IconButton>
      <IconButton
        onClick={(e) => onPageChange(e, page - 1)}
        disabled={page === 0}
        aria-label={__('previous page')}
      >
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={(e) => onPageChange(e, page + 1)}
        disabled={page >= lastPage}
        aria-label={__('next page')}
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={(e) => onPageChange(e, lastPage)}
        disabled={page >= lastPage}
        aria-label={__('last page')}
      >
        <LastPageIcon />
      </IconButton>
    </PagenationWrap>
  );
};

export const CustomTable = (props: Props) => {
  const { rows, rowsPerPage: rowsPerPageDefault = 5, permalink } = props;

  const [offset, setOffset] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageDefault);

  const currentRows = rows.slice(offset, offset + rowsPerPage);
  const page = Math.floor(offset / rowsPerPage);

  const onMouseOver = (e: any) => {
    e.currentTarget.className = 'mouseover';
  };

  const onMouseOut = (e: any) => {
    e.currentTarget.className = '';
  };

  const onClick = (e: any) => {
    // TODO: useHistory
    // see https://github.com/geolonia/app.geolonia.com/issues/618
    window.location.hash = permalink.replace('%s', e.currentTarget.dataset.id);
  };

  return (
    <Table className="geolonia-list-table">
      <TableBody>
        {currentRows.map((row) => {
          const chips = [];
          row.isPublic && chips.push(__('Public'));
          return (
            <TableRow
              key={row.id}
              onMouseOver={onMouseOver}
              onMouseOut={onMouseOut}
              onClick={onClick}
              data-id={row.id}
            >
              <TableCell component="th" scope="row">
                {row.name}
                { chips.length > 0 && <span style={{ marginLeft: '1em' }}>
                  {chips.map((label) => <Chip key={label} label={label} />)}
                </span>}
              </TableCell>
              <TableCell align="right">{row.updated}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
      {currentRows.length > 0 && (
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 50, 100]}
              colSpan={3}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: { 'aria-label': __('rows per page') },
                native: true,
              }}
              labelRowsPerPage={ __('rows per page') }
              onPageChange={(e, newPage) => setOffset(rowsPerPage * newPage)}
              onRowsPerPageChange={(e) =>
                setRowsPerPage(parseInt(e.target.value, 10))
              }
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      )}
    </Table>
  );
};

export default CustomTable;
