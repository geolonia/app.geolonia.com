import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import RoomIcon from '@material-ui/icons/Room';

import Table from '../custom/Table';
import AddNew from '../custom/AddNew'

const rows = [
  {id: 1111, name: "My Map", updated: "2019-08-28", isPublic: true},
  {id: 1112, name: "exmaple.com", updated: "2019-08-28", isPublic: false},
  {id: 1113, name: "exmaple.jp", updated: "2019-08-28", isPublic: true},
];

function Content() {
  const handler = (event: React.MouseEvent) => {

  }

  return (
    <Paper>
      <AddNew
        label="Create a new Locations API"
        description="Please enter the name of new Locations API."
        default="My Locations"
        handler={handler}
      />
      <Typography component="h3" className="module-title"><RoomIcon /> Locations API</Typography>
      <Table rows={rows} rowsPerPage={10} permalink="/data/features/%s" />
    </Paper>
  );
}

export default Content;
