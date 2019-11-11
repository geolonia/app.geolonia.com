import React from "react";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TextEditor from "./text-editor";
import Upload from "./upload";

import { __, _x, sprintf } from "@wordpress/i18n";
import Interweave from "interweave";

import Save from "../custom/Save";
import Delete from "../custom/Delete";
import Code from "../custom/Code";
import GeoloniaMap from "../custom/GeoloniaMap";
import Title from "../custom/Title";

import jsonStyle from "../custom/drawStyle";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

import "./GIS.scss";
// @ts-ignore
import MapboxDraw from "@mapbox/mapbox-gl-draw";

// types
import { AppState } from "../../types";
import { connect } from "react-redux";

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

type OwnProps = {};
type StateProps = {
  featureCollection?: GeoJSON.FeatureCollection;
};
type RouterProps = { match: { params: { id: string } } };

type Props = OwnProps & StateProps;

const Content = (props: Props) => {
  const [value, setValue] = React.useState(0);

  // GeoJSON props to state
  const [geoJSON, setGeoJSON] = React.useState<
    GeoJSON.FeatureCollection | undefined
  >(void 0);
  React.useEffect(() => {
    setGeoJSON(props.featureCollection);
  }, [props.featureCollection]);

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
  };

  const a11yProps = (index: any) => {
    return {
      id: sprintf("tab-", index),
      "aria-controls": sprintf("tabpanel-", index)
    };
  };

  const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;

    const style: React.CSSProperties = {
      width: "100%",
      height: "400px"
    };

    return (
      <Typography
        className="tab-panel"
        style={style}
        component="div"
        role="tabpanel"
        hidden={value !== index}
        id={sprintf("tabpanel-", index)}
        aria-labelledby={sprintf("tab-", index)}
        {...other}
      >
        {children}
      </Typography>
    );
  };

  const StyleSaveButton: React.CSSProperties = {};

  const saveHandler = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    return Promise.resolve();
  };

  const deleteHandler = () => Promise.resolve();

  const handleOnAfterLoad = (map: mapboxgl.Map) => {
    const draw = new MapboxDraw({
      boxSelect: false,
      controls: {
        point: true,
        line_string: true,
        polygon: true,
        trash: true,
        combine_features: false,
        uncombine_features: false
      },
      styles: jsonStyle,
      userProperties: true
    });

    map.addControl(draw, "top-right");
  };

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
            <div style={mapStyle}>
              <GeoloniaMap
                width="100%"
                height="400px"
                gestureHandling="off"
                lat={parseFloat(_x("0", "Default value of latitude for map"))}
                lng={parseFloat(_x("0", "Default value of longitude for map"))}
                marker={"off"}
                zoom={parseFloat(_x("0", "Default value of zoom level of map"))}
                fullscreenControl={"on"}
                geolocateControl={"on"}
                onAfterLoad={handleOnAfterLoad}
                geoJSON={geoJSON}
                setGeoJSON={setGeoJSON}
              />
            </div>
          </TabPanel>

          <TabPanel value={value} index={1}>
            <TextEditor geoJSON={geoJSON} setGeoJSON={setGeoJSON} />
          </TabPanel>

          <TabPanel value={value} index={2}>
            <Upload geoJSON={geoJSON} setGeoJSON={setGeoJSON} />
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
              onClick={deleteHandler}
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
            <Save onClick={saveHandler} style={StyleSaveButton} />
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

export const mapStateToProps = (
  state: AppState,
  ownProps: OwnProps & RouterProps
): StateProps => {
  const team = state.team.data[state.team.selectedIndex];
  if (team) {
    const featureCollectionId = ownProps.match.params.id;
    const featureCollections = state.geosearch[team.teamId]
      ? state.geosearch[team.teamId].featureCollections
      : {};

    const featureCollection = featureCollections[featureCollectionId]
      ? featureCollections[featureCollectionId].data
      : void 0;
    return {
      featureCollection
    };
  } else {
    return { featureCollection: void 0 };
  }
};

export default connect(mapStateToProps)(Content);
