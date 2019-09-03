import React from 'react';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import RoomIcon from '@material-ui/icons/Room';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Link from '@material-ui/core/Link';

import Save from '../custom/Save'
import Code from '../custom/Code'

const Content = () => {
  const mapStyle: React.CSSProperties = {
    width: '100%',
    height: '250px',
    border: '1px solid #dedede',
    margin: '1em 0',
  }

  const styleHelpText: React.CSSProperties = {
    fontSize: '0.9rem',
  }

  const cardStyle: React.CSSProperties = {
    marginTop: '1em',
  }

  return (
    <Paper>
      <Grid container spacing={4}>
        <Grid item sm={12} md={8}>
          <Typography component="h2" className="module-title"><RoomIcon /> Geo API</Typography>
          <div style={mapStyle}></div>

          <TextField
            id="standard-name"
            label="Name"
            margin="normal"
            fullWidth={true}
          />
          <TextField
            id="standard-name"
            label="Description"
            margin="normal"
            multiline={true}
            rows={5}
            fullWidth={true}
          />
        </Grid>

        <Grid item sm={12} md={4}>
          <Card style={cardStyle}>
            <CardContent>
              <FormControlLabel
                control={
                  <Checkbox value="1" color="primary" />
                }
                label="Public"
              />

              <Typography style={styleHelpText} component="p" color="textSecondary">Public features will be displayed on <Link href="#">open data directory</Link> and anyone can download this features without API key.</Typography>
            </CardContent>
            <CardActions>
              <Save />
            </CardActions>
          </Card>

          <Card style={cardStyle}>
            <Typography component="h2" className="module-title">API</Typography>
            <Code>https://example.com/...</Code>
            <Typography component="h2" className="module-title">Public URL</Typography>
            <Code>https://example.com/...</Code>
          </Card>
        </Grid>

      </Grid>
    </Paper>
  );
}

export default Content;
