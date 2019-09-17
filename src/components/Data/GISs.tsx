import React from 'react';
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
    <div>
      <AddNew
        label="Create a new dataset"
        description="Please enter the name of the new dataset."
        default="My dataset"
        handler={handler}
      />
      <Typography component="h3" className="module-title"><RoomIcon /> Geolonia GIS</Typography>

      <p className="description">Geolonia GIS is an API service to display points, lines, polygons for your map application.</p>

      <Table rows={rows} rowsPerPage={10} permalink="/data/gis/%s" />
    </div>
  );
}

export default Content;
