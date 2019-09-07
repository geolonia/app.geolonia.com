import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CodeIcon from '@material-ui/icons/Code';

import Table from '../custom/Table';
import AddNew from '../custom/AddNew'

const rows = [
  {id: 1111, name: "My Map", updated: "2019-08-28"},
  {id: 1112, name: "exmaple.com", updated: "2019-08-28"},
  {id: 1113, name: "exmaple.jp", updated: "2019-08-28"},
];

function Content() {
  return (
    <Paper>
      <AddNew
        label="Create a new API key"
        description="Please enter the name of new API key."
        default="My API"
      />
      <Typography component="h3" className="module-title"><CodeIcon /> API Keys</Typography>
      <Table rows={rows} rowsPerPage={10} permalink="/maps/api-keys/%s" />
    </Paper>
  );
}

export default Content;
