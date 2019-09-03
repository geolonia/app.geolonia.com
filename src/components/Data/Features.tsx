import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import RoomIcon from '@material-ui/icons/Room';
import Button from '@material-ui/core/Button';

import Table from '../custom/Table';

const rows = [
  {id: 1111, name: "My Map", updated: "2019-08-28", isPublic: true},
  {id: 1112, name: "exmaple.com", updated: "2019-08-28", isPublic: false},
  {id: 1113, name: "exmaple.jp", updated: "2019-08-28", isPublic: true},
];

function Content() {
  return (
    <Paper>
      <Typography component="p" paragraph={true} align="right"><Button variant="contained" color="primary"><RoomIcon />&nbsp;New</Button></Typography>
      <Typography component="h3" className="module-title"><RoomIcon /> Geo APIs</Typography>
      <Table rows={rows} rowsPerPage={10} permalink="/data/features/%s" />
    </Paper>
  );
}

export default Content;
