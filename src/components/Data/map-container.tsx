import React from "react";
import GeoloniaMap from "../custom/GeoloniaMap";

import jsonStyle from "../custom/drawStyle";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
// @ts-ignore
import MapboxDraw from "@mapbox/mapbox-gl-draw";

// utils
import { _x } from "@wordpress/i18n";

import {
  Feature,
} from "../../types";

type Props = {
  geoJSON: GeoJSON.FeatureCollection | undefined;
  setGeoJSON: (geojson: Props["geoJSON"]) => void;
  mapHeight: any;
  onClickFeature: Function;
  onAddFeature: Function;
  currentFeature: Feature | undefined;
};

type State = {
  draw: MapboxDraw;
  map: mapboxgl.Map;
};

const mapStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid #dedede",
  margin: "0 0 1em 0"
};

export default class MapContainer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
  }

  handleOnAfterLoad = (map: mapboxgl.Map) => {
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

    map.on('draw.create', (event: any) => {
      this.props.onAddFeature(event.features[0])
    })

    map.on('draw.selectionchange', (event: any) => {
      this.props.onClickFeature(event.features[0])
    })

    this.setState({map: map})
    this.setState({draw: draw})
  }

  componentDidUpdate() {
    if (this.props.geoJSON) {
      this.state.draw.deleteAll().set(this.props.geoJSON);
    }

    if (this.state.map && this.state.draw) {
      ["draw.create", "draw.update", "draw.delete"].forEach(eventType => {
        this.state.map.on(eventType, () => {
          const geojson = this.state.draw.getAll();
          const nextGeoJSON = {
            ...geojson,
            features: geojson.features.map((feature: any) => {
              delete feature.id;
              return feature;
            })
          };
          this.props.setGeoJSON(nextGeoJSON);
        });
      });
    }
  }

  render() {
    return (
      <div style={mapStyle}>
        <GeoloniaMap
          width="100%"
          height={this.props.mapHeight}
          gestureHandling="off"
          lat={parseFloat(_x("0", "Default value of latitude for map"))}
          lng={parseFloat(_x("0", "Default value of longitude for map"))}
          marker={"off"}
          zoom={parseFloat(_x("0", "Default value of zoom level of map"))}
          geolocateControl={"off"}
          onAfterLoad={this.handleOnAfterLoad}
        />
      </div>
    )
  }
}
