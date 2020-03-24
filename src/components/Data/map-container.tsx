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
  mapHeight: any;
  onClickFeature: Function;
  onAddFeature: Function;
};

const mapStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid #dedede",
  margin: "0 0 1em 0"
};

export const MapContainer = (props: Props) => {
  const { geoJSON, setGeoJSON, mapHeight, onAddFeature, onClickFeature } = props;

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
          const geojson = draw.getAll();
          const nextGeoJSON = {
            ...geojson,
            features: geojson.features.map((feature: any) => {
              delete feature.id;
              return feature;
            })
          };
          setGeoJSON(nextGeoJSON);
        });
      });
    }
  }, [map, draw, setGeoJSON]);

  React.useEffect(() => {
    if (map && draw) {
      map.on('draw.selectionchange', (event: any) => {
        onClickFeature(event.features[0])
      })

      map.on('draw.create', (event: any) => {
        onAddFeature(event.features[0])
      })
    }
  }, [map, draw, onClickFeature])

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
