import React from "react";
import GeoloniaMap from "../custom/GeoloniaMap";

import jsonStyle from "../custom/drawStyle";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
// @ts-ignore
import MapboxDraw from "@mapbox/mapbox-gl-draw";

// utils
import { _x } from "@wordpress/i18n";

type Props = {
  geoJSON: GeoJSON.FeatureCollection | undefined;
  setGeoJSON: (geojson: Props["geoJSON"]) => void;
};

const mapStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid #dedede",
  margin: "0 0 1em 0"
};

export const MapContainer: React.FC<Props> = props => {
  const { geoJSON, setGeoJSON } = props;

  // mapbox map and draw binding
  const [map, setMap] = React.useState<mapboxgl.Map | null>(null);
  const [draw, setDraw] = React.useState<any>(null);

  // import geoJSON
  React.useEffect(() => {
    if (map && draw && geoJSON) {
      draw.deleteAll().set(geoJSON);
    }
  }, [map, draw, geoJSON]);

  // export geoJSON
  React.useEffect(() => {
    if (map && draw) {
      ["draw.create", "draw.update", "draw.delete"].forEach(eventType => {
        map.on(eventType, () => {
          const nextGeoJSON = draw.getAll();
          setGeoJSON(nextGeoJSON);
        });
      });
    }
  }, [map, draw, setGeoJSON]);

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
    setDraw(draw);
    setMap(map);
  };

  return (
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
      />
    </div>
  );
};

export default MapContainer;
