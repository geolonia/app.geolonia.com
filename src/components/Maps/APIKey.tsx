import React from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import Code from '../custom/Code'
import Save from '../custom/Save'
import Delete from '../custom/Delete'

const Content = () => {
  const styleDangerZone = {
    border: '1px solid #ff0000',
    marginTop: '10em',
    padding: '16px 24px',
  } as React.CSSProperties

  const styleH3 = {
    marginTop: '1em',
  } as React.CSSProperties

  const styleHelpText = {
    fontSize: '0.9rem',
  } as React.CSSProperties

  const saveHandler = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {

  }

  const deleteHandler = (event: React.MouseEvent) => {

  }

  const apiKey = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
  const embedCode = `<script type="text/javascript" src="https://api.tilecloud.io/v1/embed?tilecloud-api-key=${apiKey}"></script>`
  const embedHtml = '<div\n  class="geolonia"\n  data-lat="35.65810422222222"\n  data-lng="139.74135747222223"\n  data-zoom="9"\n  data-gesture-handling="off"\n  data-geolocate-control="on"\n>日本経緯度原点</div>'

  return (
    <div>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Typography component="h2" className="module-title">API Key</Typography>
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
            placeholder="https://example.com"
            fullWidth={true}
          />

          <Typography style={styleHelpText} component="p" color="textSecondary">Each URLs will be used as a value of <code>Access-Control-Allow-Origin</code> header for CORS.<br />
          Please enter a value of URLs on a new line.</Typography>

          <Save handler={saveHandler} />

          <div style={styleDangerZone}>
            <Typography component="h3" color="secondary">Danger Zone</Typography>
            <p>Once you delete an API, there is no going back. Please be certain. </p>
            <Delete
              handler={deleteHandler}
            />
          </div>
        </Grid>

        <Grid item xs={12} md={4}>
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
    </div>
  );
}

export default Content;
