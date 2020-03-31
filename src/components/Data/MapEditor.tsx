import React from "react";
import GeoloniaMap from "../custom/GeoloniaMap";

import jsonStyle from "../custom/drawStyle";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { _x } from "@wordpress/i18n";
import fullscreen from './fullscreenMap'

// @ts-ignore
import centroid from "@turf/centroid"
// @ts-ignore
import MapboxDraw from "@mapbox/mapbox-gl-draw";

type Props = {
  geoJSON: GeoJSON.FeatureCollection | undefined;
  onClickFeature: Function;
  drawCallback: Function;
  saveCallback: Function;
  getNumberFeatures: Function;
  bounds:mapboxgl.LngLatBoundsLike | undefined;
  style: string;
};

const mapStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  border: "1px solid #dedede",
  margin: "0 0 1em 0"
};

export const MapEditor = (props: Props) => {
  const { geoJSON, onClickFeature, drawCallback, saveCallback, getNumberFeatures, bounds, style } = props;

  // mapbox map and draw binding
  const [map, setMap] = React.useState<mapboxgl.Map | undefined>(undefined);
  const [draw, setDraw] = React.useState<MapboxDraw | undefined>(undefined);

  // import geoJSON
  React.useEffect(() => {
    if (draw && geoJSON) {
      draw.set(geoJSON);
    }
  }, [draw, geoJSON]);

  React.useEffect(() => {
    if (geoJSON) {
      getNumberFeatures()
    }
  }, [geoJSON, getNumberFeatures]);

  React.useEffect(() => {
    if (draw) {
      drawCallback(draw)
    }
  }, [draw, drawCallback])

  React.useEffect(() => {
    if (map && style) {
      map.setStyle(style)
    }
  }, [map, style])

  const handleOnAfterLoad = (map: mapboxgl.Map) => {
    const draw: MapboxDraw = new MapboxDraw({
      boxSelect: true,
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

    map.addControl(new fullscreen('.gis-panel .editor'), "top-right");
    // @ts-ignore
    map.addControl(new window.geolonia.NavigationControl());
    map.addControl(draw, "top-right");

    setDraw(draw);
    setMap(map)

    map.on('draw.selectionchange', (event: any) => {
      if (event.features.length) {
        const center = centroid(event.features[0]);
        map.setCenter(center.geometry.coordinates)
      }

      onClickFeature(event)
    })

    map.on('draw.create', (event: any) => {
      getNumberFeatures()
      saveCallback(event)
    })

    map.on('draw.delete', (event: any) => {
      getNumberFeatures()
      saveCallback(event)
    })
  };

  return (
    <div style={mapStyle}>
      <GeoloniaMap
        width="100%"
        height="100%"
        gestureHandling="off"
        lat={parseFloat(_x("0", "Default value of latitude for map"))}
        lng={parseFloat(_x("0", "Default value of longitude for map"))}
        marker={"off"}
        zoom={parseFloat(_x("0", "Default value of zoom level of map"))}
        geolocateControl={"off"}
        fullscreenControl={"off"}
        navigationControl={"off"}
        onAfterLoad={handleOnAfterLoad}
        bounds={bounds}
      />
    </div>
  );
};

export default MapEditor;
