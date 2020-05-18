import React from "react";
import GeoloniaMap from "../custom/GeoloniaMap";

import jsonStyle from "../custom/drawStyle";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { _x } from "@wordpress/i18n";
import fullscreen from "./fullscreenMap";

// @ts-ignore
import centroid from "@turf/centroid";
// @ts-ignore
import MapboxDraw from "@mapbox/mapbox-gl-draw";

type OwnProps = {
  geoJSON: GeoJSON.FeatureCollection | undefined;
  onClickFeature: Function;
  drawCallback: Function;
  saveCallback: Function;
  getNumberFeatures: Function;
  bounds: mapboxgl.LngLatBoundsLike | undefined;
  style: string;
};

type Props = OwnProps;

const mapStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  border: "1px solid #dedede",
  margin: "0 0 1em 0"
};

const createMapEvents = (props: Props, map: mapboxgl.Map) => {
  return {
    selectionChange: (event: any) => {
      if (event.features.length) {
        const center = centroid(event.features[0]);
        map.setCenter(center.geometry.coordinates);
      }
      props.onClickFeature(event);
    },
    drawUpdate: (event: any) => {
      props.getNumberFeatures();
      props.saveCallback(event);
    }
  };
};

export const MapEditor = (props: Props) => {
  const { geoJSON, drawCallback, getNumberFeatures, bounds, style } = props;

  // mapbox map and draw binding
  const [map, setMap] = React.useState<mapboxgl.Map | undefined>(undefined);
  const [draw, setDraw] = React.useState<MapboxDraw | undefined>(undefined);
  const [events, setEvents] = React.useState<any>(null);

  // import geoJSON
  React.useEffect(() => {
    if (draw && geoJSON) {
      draw.set(geoJSON);
    }
  }, [draw, geoJSON]);

  React.useEffect(() => {
    if (geoJSON) {
      getNumberFeatures();
    }
  }, [geoJSON, getNumberFeatures]);

  React.useEffect(() => {
    if (draw) {
      drawCallback(draw);
    }
  }, [draw, drawCallback]);

  React.useEffect(() => {
    if (map && style) {
      map.setStyle(style);
    }
  }, [map, style]);

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

    map.addControl(new fullscreen(".gis-panel .editor"), "top-right");
    // @ts-ignore
    map.addControl(new window.geolonia.NavigationControl());
    map.addControl(draw, "top-right");

    setDraw(draw);
    setMap(map);

    const mapEvents = createMapEvents(props, map);
    map.on("draw.selectionchange", mapEvents.selectionChange);
    map.on("draw.create", mapEvents.drawUpdate);
    map.on("draw.delete", mapEvents.drawUpdate);
    map.on("draw.update", mapEvents.drawUpdate);
    setEvents(mapEvents);
  };

  React.useEffect(() => {
    if (map && events) {
      map.off("draw.selectionchange", events.selectionChange);
      map.off("draw.create", events.drawUpdate);
      map.off("draw.delete", events.drawUpdate);
      map.off("draw.update", events.drawUpdate);
      const nextEvents = createMapEvents(props, map);
      map.on("draw.selectionchange", nextEvents.selectionChange);
      map.on("draw.create", nextEvents.drawUpdate);
      map.on("draw.delete", nextEvents.drawUpdate);
      map.on("draw.update", nextEvents.drawUpdate);
      setEvents(nextEvents);
    }
    // eslint-disable-next-line
  }, [props]);

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
