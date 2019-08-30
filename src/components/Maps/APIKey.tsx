import React from 'react';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import Code from '../custom/Code'

const Content = () => {
  const styleDangerZone = {
    border: '1px solid #ff0000',
    marginTop: '10em',
    padding: '16px 24px',
  } as React.CSSProperties

  const styleH3 = {
    marginTop: '1em',
  } as React.CSSProperties

  const apiKey = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
  const embedCode = `<script type="text/javascript" src="https://api.tilecloud.io/v1/embed?tilecloud-api-key=${apiKey}"></script>`
  const embedHtml = '<div\n  class="geolonia"\n  data-lat="35.65810422222222"\n  data-lng="139.74135747222223"\n  data-zoom="9"\n  data-gesture-handling="off"\n  data-geolocate-control="on"\n>日本経緯度原点</div>'

  return (
    <Paper>
      <Grid container spacing={4}>
        <Grid item sm={12} md={8}>
          <Typography component="h2" className="module-title">Settings</Typography>
          <TextField
            id="standard-name"
            label="Name"
            margin="normal"
            fullWidth={true}
          />
          <TextField
            id="standard-name"
            label="URLs"
            margin="normal"
            multiline={true}
            rows={5}
            fullWidth={true}
          />

          <Typography component="p"><Button variant="contained" color="primary">Save</Button></Typography>

          <div style={styleDangerZone}>
            <Typography component="h3" color="secondary">Danger Zone</Typography>
            <p>Once you delete a API key, there is no going back. Please be certain. </p>
            <Button variant="contained" color="secondary">Delete</Button>
          </div>
        </Grid>

        <Grid item sm={12} md={4}>
          <Typography component="h2" className="module-title">Your API Key</Typography>
          <Code>{apiKey}</Code>
          <Typography component="h2" className="module-title">Add the map to your site</Typography>
          <Typography component="h3" style={styleH3}>Step 1</Typography>
          <p>Include the following code before closing tag of the <code>body</code> in your HTML file.</p>
          <Code>{embedCode}</Code>
          <Typography component="h3" style={styleH3}>Step 2</Typography>
          <p>Add the following code into the body of your HTML file.</p>
          <Code>{embedHtml}</Code>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default Content;
