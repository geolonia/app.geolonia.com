import React from "react";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";

// utils
import moment from "moment";
import { __ } from "@wordpress/i18n";

import "./Table.scss";

type Props = {
  rows: {
    id: string | number;
    name: string;
    isPublic?: boolean;
    updated: string;
  }[];
  rowsPerPage: number;
  permalink: string;
};

const Content = (props: Props) => {
  const handleChangePage = () => {};

  const handleChangeRowsPerPage = () => {};

  const onMouseOver = (e: any) => {
    e.currentTarget.className = "mouseover";
  };

  const onMouseOut = (e: any) => {
    e.currentTarget.className = "";
  };

  const onClick = (e: any) => {
    window.location.hash = props.permalink.replace(
      "%s",
      e.currentTarget.dataset.id
    );
  };

  return (
    <Table className="geolonia-list-table">
      <TableBody>
        {props.rows.map(row => (
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
            <TableCell align="right">
              {row.updated
                ? moment(row.updated).format("YYYY-MM-DD")
                : __("(No date)")}
            </TableCell>
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
              inputProps: { "aria-label": "rows per page" },
              native: true
            }}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </TableRow>
      </TableFooter>
    </Table>
  );
};

Content.defaultProps = {
  rows: [],
  rowsPerPage: 5
};

export default Content;
