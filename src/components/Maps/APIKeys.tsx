import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CodeIcon from '@material-ui/icons/Code';
import Button from '@material-ui/core/Button';

import Table from '../custom/Table';

const rows = [
  {id: 1111, name: "My Map", updated: "2019-08-28"},
  {id: 1112, name: "exmaple.com", updated: "2019-08-28"},
  {id: 1113, name: "exmaple.jp", updated: "2019-08-28"},
];

function Content() {
  return (
    <Paper>
      <Typography component="p" paragraph={true} align="right"><Button variant="contained" color="primary"><CodeIcon />&nbsp;New</Button></Typography>
      <Typography component="h3" className="module-title"><CodeIcon /> API Keys</Typography>
      <Table rows={rows} rowsPerPage={10} permalink="/maps/api-keys/%s" />
    </Paper>
  );
}

export default Content;
