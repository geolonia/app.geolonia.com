import React, { useCallback, useEffect, useRef, useState } from "react";
import GeoloniaMap from "../custom/GeoloniaMap";

import { _x } from "@wordpress/i18n";
import fullscreen from "./fullscreenMap";

import fetch from "../../lib/fetch";
import { refreshSession } from "../../auth";

const {REACT_APP_TILE_SERVER} = process.env

type OwnProps = {
  geojsonId: string | undefined;
  session: Geolonia.Session;
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

export const MapEditor = (props: Props) => {
  const { geojsonId, bounds, style, session } = props;

  // mapbox map and draw binding
  const [map, setMap] = useState<mapboxgl.Map | undefined>(undefined);
  const [sessionIsValid, setSessionIsValid] = useState<boolean>(!!session?.isValid());
  const sessionRef = useRef<Geolonia.Session>(session);

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

    map.addControl(new fullscreen(".gis-panel .editor"), "top-right");
    // @ts-ignore
    map.addControl(new window.geolonia.NavigationControl());

    setMap(map);

  }, []);

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
