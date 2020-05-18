import React from "react";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";

// utils
import { __, sprintf } from "@wordpress/i18n";
import styled from "styled-components";

// styles
import "./Table.scss";

type Props = {
  page: number;
  rows: {
    id: string | number;
    name: string;
    isPublic?: boolean;
    updated: string;
  }[];
  rowsPerPage: number;
  setPerPage: (perPage: number) => void;
  totalCount: number;
  permalink: string;
  onChangePage: (page: number) => void;
};

type TablePaginationActionsProps = {
  count: number;
  page: number;
  rowsPerPage: number;
  onChangePage: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
};

const PagenationWrap = styled.div`
  flex-shrink: 0;
  margin-left: 2.5em;
`;

const TablePaginationActions = (props: TablePaginationActionsProps) => {
  const { count, page, rowsPerPage, onChangePage } = props;
  const lastPage = Math.ceil(count / rowsPerPage) - 1;

  return (
    <PagenationWrap>
      <IconButton
        onClick={e => onChangePage(e, 0)}
        disabled={page === 0}
        aria-label={__("first page")}
      >
        <FirstPageIcon />
      </IconButton>
      <IconButton
        onClick={e => onChangePage(e, page - 1)}
        disabled={page === 0}
        aria-label={__("previous page")}
      >
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={e => onChangePage(e, page + 1)}
        disabled={page >= lastPage}
        aria-label={__("next page")}
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={e => onChangePage(e, lastPage)}
        disabled={page >= lastPage}
        aria-label={__("last page")}
      >
        <LastPageIcon />
      </IconButton>
    </PagenationWrap>
  );
};

export const CustomTable = (props: Props) => {
  const { rows, rowsPerPage, page, totalCount, permalink } = props;

  const onMouseOver = (e: any) => {
    e.currentTarget.className = "mouseover";
  };

  const onMouseOut = (e: any) => {
    e.currentTarget.className = "";
  };

  const onClick = (e: any) => {
    window.location.hash = permalink.replace("%s", e.currentTarget.dataset.id);
  };

  return (
    <Table className="geolonia-list-table">
      <TableBody>
        {rows.map(row => (
          <TableRow
            key={row.id}
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
            onClick={onClick}
            data-id={row.id}
          >
            <TableCell component="th" scope="row">
              {row.name}
              {row.isPublic && (
                <span className="private-or-public">{__("Public")}</span>
              )}
            </TableCell>
            <TableCell align="right">{row.updated}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      {rows.length > 0 && (
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 50, 100]}
              colSpan={3}
              count={totalCount}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: { "aria-label": __("rows per page") },
                native: true
              }}
              labelRowsPerPage={ __("rows per page") }
              labelDisplayedRows={({from, to, count}) => {
                if(from > count) {
                  return ''
                } else {
                  return sprintf(__('%s - %s of %s'), from, to, count)
                }
              }}
              onChangePage={(e, newPage) => props.onChangePage(newPage)}
              onChangeRowsPerPage={e =>
                props.setPerPage(parseInt(e.target.value, 10))
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
