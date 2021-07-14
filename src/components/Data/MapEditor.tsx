import React, { useCallback, useEffect, useRef, useState } from "react";
import GeoloniaMap from "../custom/GeoloniaMap";

import jsonStyle from "../custom/drawStyle";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { _x } from "@wordpress/i18n";
import fullscreen from "./fullscreenMap";

import centroid from "@turf/centroid";
// @ts-ignore
import MapboxDraw from "@mapbox/mapbox-gl-draw";

import fetch from "../../lib/fetch";
import { refreshSession } from "../../auth";

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
  const {
    geojsonId, geoJSON, drawCallback, getNumberFeatures, bounds, style,
    session,
  } = props;

  // mapbox map and draw binding
  const [map, setMap] = useState<mapboxgl.Map | undefined>(undefined);
  const [draw, setDraw] = useState<MapboxDraw | undefined>(undefined);
  const [events, setEvents] = useState<any>(null);
  const [sessionIsValid, setSessionIsValid] = useState<boolean>(!!session?.isValid());
  const sessionRef = useRef<Geolonia.Session>(session);

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
    map.on('sourcedata', (ev) => {
      if (ev.isSourceLoaded !== true) { return; }
      if (!('tile' in ev) && ev.sourceId === "vt-geolonia-simple-style") {
        const source = map.getSource(ev.sourceId) as mapboxgl.VectorSourceImpl;
        map.fitBounds(source.bounds as [number, number], {
          padding: 20,
          maxZoom: 16,
        });
      }
    });

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
  }, [props]);

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
    if (sessionRef.current && url.indexOf('customtiles') >= 0) {
      const idToken = sessionRef.current.getIdToken().getJwtToken();
      return {
        url,
        headers: {
          Authorization: idToken
        }
      }
    }
    return { url };
  }, [])

  useEffect(() => {
    let updateTimer: number | undefined;
    const updater = (async () => {
      if (!session || session.isValid()) {
        return;
      }
      const newSession = await refreshSession(session);
      sessionRef.current = newSession;
      setSessionIsValid(newSession.isValid());
      updateTimer = setTimeout(updater, 30_000) as unknown as number;
    });
    updater();

    return () => {
      if (updateTimer) {
        clearTimeout(updateTimer);
      }
    }
  }, [ session ]);

  if (!sessionIsValid) {
    return null;
  }

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
