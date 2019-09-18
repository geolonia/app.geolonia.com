import React from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import RoomIcon from '@material-ui/icons/Room';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';

import Save from '../custom/Save'
import Delete from '../custom/Delete'
import Code from '../custom/Code'
import MapEditor from '../custom/MapEditor'
import Title from '../custom/Title'
import Help from '../custom/Help'

const Content = () => {
  const mapStyle: React.CSSProperties = {
    width: '100%',
    border: '1px solid #dedede',
    margin: '0 0 1em 0',
  }

  const styleDangerZone: React.CSSProperties = {
    border: '1px solid #ff0000',
    marginTop: '10em',
    padding: '16px 24px',
  }

  const styleHelpText: React.CSSProperties = {
    fontSize: '0.9rem',
  }

  const cardStyle: React.CSSProperties = {
    marginBottom: '2em',
  }

  const StyleSaveButton: React.CSSProperties = {

  }

  const saveHandler = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {

  }

  const deleteHandler = (event: React.MouseEvent) => {

  }

  return (
    <div>
      <Title title="データセットの管理">
        データセットの管理や設定を行ったり、データセット API にアクセスするためのアクセスポイントの URL を取得することができます。
      </Title>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <div style={mapStyle}><MapEditor /></div>

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

          <div style={styleDangerZone}>
            <Typography component="h3" color="secondary">Danger Zone</Typography>
            <p>Once you delete a API key, there is no going back. Please be certain. </p>
            <Delete
              handler={deleteHandler}
              text1="Are you sure you want to delete this dataset?"
              text2="Please type in the name of the dataset to confirm."
            />
          </div>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper style={cardStyle}>
            <FormControlLabel
              control={
                <Checkbox value="1" color="primary" />
              }
              label="Public"
            />

            <Typography style={styleHelpText} component="p" color="textSecondary">Public features will be displayed on <Link href="#">open data directory</Link> and anyone can download this features without API key.</Typography>
            <Save handler={saveHandler} style={StyleSaveButton} />
          </Paper>

          <Paper style={cardStyle}>
            <Typography component="h2" className="module-title">Private URL</Typography>
            <Code>https://example.com/...</Code>
            <Typography component="h2" className="module-title">Public URL</Typography>
            <Code>https://example.com/...</Code>
          </Paper>
        </Grid>

      </Grid>
    </div>
  );
}

export default Content;
