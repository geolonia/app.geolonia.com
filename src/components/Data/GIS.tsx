import React from "react";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import {__, _x, sprintf} from '@wordpress/i18n';
import Interweave from "interweave";

import Save from "../custom/Save";
import Delete from "../custom/Delete";
import Code from "../custom/Code";
import GeoloniaMap from "../custom/GeoloniaMap";
import Title from "../custom/Title";

import jsonStyle from '../custom/drawStyle'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'

import './GIS.scss'

const MapboxDraw = require('@mapbox/mapbox-gl-draw') // `@types/mapbox__mapbox-gl-draw` doesn't exist.

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

const Content = () => {
  const [value, setValue] = React.useState(0)

  const breadcrumbItems = [
    {
      title: "Home",
      href: "#/"
    },
    {
      title: __("GIS services"),
      href: "#/data"
    },
    {
      title: "Gcloud",
      href: "#/data/gis"
    },
    {
      title: __("Dataset settings"),
      href: null
    }
  ];

  const mapStyle: React.CSSProperties = {
    width: "100%",
    border: "1px solid #dedede",
    margin: "0 0 1em 0"
  };

  const styleDangerZone: React.CSSProperties = {
    border: "1px solid #ff0000",
    marginTop: "10em",
    padding: "16px 24px"
  };

  const styleHelpText: React.CSSProperties = {
    fontSize: "0.9rem"
  };

  const cardStyle: React.CSSProperties = {
    marginBottom: "2em"
  };

  const handleChangeTab = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  }

  const a11yProps = (index: any) => {
    return {
      id: sprintf('tab-', index),
      'aria-controls': sprintf('tabpanel-', index),
    };
  }

  const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;

    const style: React.CSSProperties = {
      width: '100%',
      height: '400px',
    }

    return (
      <Typography
        className="tab-panel"
        style={style}
        component="div"
        role="tabpanel"
        hidden={value !== index}
        id={sprintf('tabpanel-', index)}
        aria-labelledby={sprintf('tab-', index)}
        {...other}
      >{children}</Typography>
    );
  }

  const StyleSaveButton: React.CSSProperties = {};

  const styleTextarea: React.CSSProperties = {
    width: '100%',
    height: '100%',
  }

  const saveHandler = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {};

  const deleteHandler = (event: React.MouseEvent) => {};

  const handleOnAfterLoad = (map: mapboxgl.Map) => {
    const draw = new MapboxDraw({
      boxSelect: false,
      controls: {
        point: true,
        line_string: true,
        polygon: true,
        trash: true,
        combine_features: false,
        uncombine_features: false,
      },
      styles: jsonStyle,
      userProperties: true,
    })

    map.addControl(draw, 'top-right')
  }

  return (
    <div className="gis-panel">
      <Title breadcrumb={breadcrumbItems} title={__("Dataset settings")}>
        {__(
          "You can manage and set the dataset, and get the the access point URL of dataset API."
        )}
      </Title>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>

          <Tabs
            className="gis-editor-tab"
            textColor="primary"
            value={value}
            onChange={handleChangeTab}
            aria-label="simple tabs example"
          >
            <Tab label="Map" {...a11yProps(0)} />
            <Tab label="GeoJSON" {...a11yProps(1)} />
            <Tab label="Upload" {...a11yProps(2)} />
          </Tabs>

          <TabPanel value={value} index={0}>
            <div style={mapStyle}><GeoloniaMap
              width="100%"
              height="400px"
              gestureHandling='off'
              lat={parseFloat(_x('0', 'Default value of latitude for map'))}
              lng={parseFloat(_x('0', 'Default value of longitude for map'))}
              marker={'off'}
              zoom={6}
              fullscreenControl={'on'}
              geolocateControl={'on'}
              onAfterLoad={handleOnAfterLoad}
            /></div>
          </TabPanel>

          <TabPanel value={value} index={1}>
            <textarea style={styleTextarea}></textarea>
          </TabPanel>

          <TabPanel value={value} index={2}>
            <Button
              className="file-upload"
              component="label"
            >
              <div>GeoJSON ファイルを選択してください。<br /><CloudUploadIcon /><br />
              <input
                type="file"
                className="inputFileBtnHide"
              /></div>
            </Button>
          </TabPanel>

          <TextField
            id="standard-name"
            label={__("Name")}
            margin="normal"
            fullWidth={true}
          />
          <TextField
            id="standard-name"
            label={__("Description")}
            margin="normal"
            multiline={true}
            rows={5}
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

          <Typography style={styleHelpText} component="p" color="textSecondary">
            <Interweave
              content={__(
                "Each URLs will be used as a value of <code>Access-Control-Allow-Origin</code> header for CORS. Please enter a URL on a new line."
              )}
            />
          </Typography>

          <div style={styleDangerZone}>
            <Typography component="h3" color="secondary">
              {__("Danger Zone")}
            </Typography>
            <p>
              {__(
                "Once you delete a API key, there is no going back. Please be certain."
              )}
            </p>
            <Delete
              handler={deleteHandler}
              text1={__("Are you sure you want to delete this dataset?")}
              text2={__("Please type in the name of the dataset to confirm.")}
            />
          </div>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper style={cardStyle}>
            <FormControlLabel
              control={<Checkbox value="1" color="primary" />}
              label={__("Public")}
            />

            <Typography
              style={styleHelpText}
              component="p"
              color="textSecondary"
            >
              <Interweave
                content={__(
                  'Public features will be displayed on <a class="MuiTypography-colorPrimary" href="#">open data directory</a> and anyone can download this features without API key.'
                )}
              />
            </Typography>
            <Save handler={saveHandler} style={StyleSaveButton} />
          </Paper>

          <Paper style={cardStyle}>
            <Typography component="h2" className="module-title">
              {__("Private URL")}
            </Typography>
            <Code>https://example.com/...</Code>
            <Typography component="h2" className="module-title">
              {__("Public URL")}
            </Typography>
            <Code>https://example.com/...</Code>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Content;
