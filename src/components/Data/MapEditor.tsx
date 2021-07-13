import React, { useCallback, useEffect, useState } from "react";
import GeoloniaMap from "../custom/GeoloniaMap";

import jsonStyle from "../custom/drawStyle";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { _x } from "@wordpress/i18n";
import fullscreen from "./fullscreenMap";

import centroid from "@turf/centroid";
// @ts-ignore
import MapboxDraw from "@mapbox/mapbox-gl-draw";

import fetch from "../../lib/fetch";

const {REACT_APP_TILE_SERVER} = process.env

type OwnProps = {
  geojsonId: string | undefined;
  session: Geolonia.Session;
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
        map.setCenter(center.geometry.coordinates as [number, number]);
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
  const { geojsonId, geoJSON, drawCallback, getNumberFeatures, bounds, style } = props;

  // mapbox map and draw binding
  const [map, setMap] = useState<mapboxgl.Map | undefined>(undefined);
  const [draw, setDraw] = useState<MapboxDraw | undefined>(undefined);
  const [events, setEvents] = useState<any>(null);

  // import geoJSON
  // WebSocket incomming
  useEffect(() => {
    if (draw && geoJSON) {
      draw.deleteAll();
      draw.set(geoJSON);
    }
  }, [draw, geoJSON]);

  useEffect(() => {
    if (geoJSON) {
      getNumberFeatures();
    }
  }, [geoJSON, getNumberFeatures]);

  useEffect(() => {
    if (draw) {
      drawCallback(draw);
    }
  }, [draw, drawCallback]);

  useEffect(() => {
    if (map && style) {
      map.setStyle(style);
    }
  }, [map, style]);

  const handleOnAfterLoad = useCallback(async (map: mapboxgl.Map) => {
    const res = await fetch(props.session, `${REACT_APP_TILE_SERVER}/customtiles/${geojsonId}/tiles.json?key=YOUR-API-KEY`, { method: "GET" })
    const tileJson = await res.json()
    map.fitBounds(tileJson.bounds, {
      padding: 20,
      maxZoom: 16,
    })

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
  }, [props, geojsonId]);

  useEffect(() => {
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

  const transformRequest = useCallback((url: string, resourceType) => {
    if (props.session && url.indexOf('customtiles') >= 0) {
      const idToken = props.session.getIdToken().getJwtToken();
      return {
        url,
        headers: {
          Authorization: idToken
        }
      }
    }
    return { url };
  }, [props.session])

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
        geojsonId={geojsonId}
        initialMapOptions={{
          transformRequest
        }}
      />
    </div>
  );
};

export default MapEditor;
