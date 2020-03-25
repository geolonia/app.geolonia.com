import React from "react";
import GeoloniaMap from "../custom/GeoloniaMap";

import jsonStyle from "../custom/drawStyle";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { _x } from "@wordpress/i18n";

// @ts-ignore
import centroid from "@turf/centroid"
// @ts-ignore
import MapboxDraw from "@mapbox/mapbox-gl-draw";

type Props = {
  geoJSON: GeoJSON.FeatureCollection | undefined;
  mapHeight: any;
  onClickFeature: Function;
  drawCallback: Function;
};

const mapStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid #dedede",
  margin: "0 0 1em 0"
};

export const MapContainer = (props: Props) => {
  const { geoJSON, mapHeight, onClickFeature, drawCallback } = props;

  // mapbox map and draw binding
  const [map, setMap] = React.useState<mapboxgl.Map | null>(null);
  const [draw, setDraw] = React.useState<any>(null);

  // import geoJSON
  React.useEffect(() => {
    if (map && draw && geoJSON) {
      draw.set(geoJSON);
    }

    drawCallback(draw)
  }, [map, draw, geoJSON]);

  React.useEffect(() => {
    drawCallback(draw)
  }, [draw, drawCallback]);

  const handleOnAfterLoad = (map: mapboxgl.Map) => {
    const draw: MapboxDraw = new MapboxDraw({
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
    setDraw(draw);
    setMap(map);

    map.on('draw.selectionchange', (event: any) => {
      if (event.features.length) {
        const center = centroid(event.features[0]);
        map.setCenter(center.geometry.coordinates)
      }

      onClickFeature(event.features[0])
    })
  };

  return (
    <div style={mapStyle}>
      <GeoloniaMap
        width="100%"
        height={mapHeight}
        gestureHandling="off"
        lat={parseFloat(_x("0", "Default value of latitude for map"))}
        lng={parseFloat(_x("0", "Default value of longitude for map"))}
        marker={"off"}
        zoom={parseFloat(_x("0", "Default value of zoom level of map"))}
        geolocateControl={"off"}
        onAfterLoad={handleOnAfterLoad}
      />
    </div>
  );
};

export default MapContainer;
