import React from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';

import {sprintf, __} from '@wordpress/i18n'
import Interweave from 'interweave'

import Code from '../custom/Code'
import Save from '../custom/Save'
import Delete from '../custom/Delete'
import Help from '../custom/Help'
import Title from '../custom/Title'

const Content = () => {
  const apiKey = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
  const embedHtml = '<div\n  class="geolonia"\n  data-lat="35.65810422222222"\n  data-lng="139.74135747222223"\n  data-zoom="9"\n  data-gesture-handling="off"\n  data-geolocate-control="on"\n></div>'
  const embedCode = sprintf('<script type="text/javascript" src="https://api.tilecloud.io/v1/embed?tilecloud-api-key=%s"></script>', apiKey)

  const breadcrumbItems = [
    {
      title: "Home",
      href: "#/",
    },
    {
      title: "Maps",
      href: "#/maps",
    },
    {
      title: __("API keys"),
      href: "#/maps/api-keys",
    },
    {
      title: __("API key settings"),
      href: null,
    },
  ]

  const styleDangerZone: React.CSSProperties = {
    border: '1px solid #ff0000',
    marginTop: '10em',
    padding: '16px 24px',
  }

  const styleH3: React.CSSProperties = {
    marginTop: '1em',
  }

  const sidebarStyle: React.CSSProperties = {
    marginBottom: "2em",
  }

  const saveHandler = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {

  }

  const deleteHandler = (event: React.MouseEvent) => {

  }

  return (
    <div>
      <Title breadcrumb={breadcrumbItems} title={__('API key settings')}>{__('Get the HTML code for the map on the web page, and configure access control for your API key.')}</Title>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>

          <TextField
            id="standard-name"
            label={__("Name")}
            margin="normal"
            fullWidth={true}
          />

          <TextField
            id="standard-name"
            label={__("URLs")}
            margin="normal"
            multiline={true}
            rows={5}
            placeholder="https://example.com"
            fullWidth={true}
          />

          <Help>
            <Interweave content={__('Each URLs will be used as a value of <code>Access-Control-Allow-Origin</code> header for CORS. Please enter a URL on a new line.')} ></Interweave>
          </Help>

          <Save handler={saveHandler} />

          <div style={styleDangerZone}>
            <Typography component="h3" color="secondary">{__('Danger Zone')}</Typography>
            <p>{__('Once you delete an API, there is no going back. Please be certain.')}</p>
            <Delete
              handler={deleteHandler}
            />
          </div>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper style={sidebarStyle}>
            <Typography component="h2" className="module-title">{__('Your API Key')}</Typography>
            <Code>{apiKey}</Code>
          </Paper>
          <Paper style={sidebarStyle}>
            <Typography component="h2" className="module-title">{__('Add the map to your site')}</Typography>
            <Typography component="h3" style={styleH3}>{__('Step 1')}</Typography>
            <p><Interweave content={__('Include the following code before closing tag of the <code>&lt;body /&gt;</code> in your HTML file.')} /></p>
            <Code>{embedCode}</Code>
            <Typography component="h3" style={styleH3}>{__('Step 2')}</Typography>
            <p>{__('Add the following code into the body of your HTML file.')}</p>
            <Code>{embedHtml}</Code>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default Content;
