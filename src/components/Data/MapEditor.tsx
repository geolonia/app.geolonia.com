import React, { useCallback, useEffect, useState } from "react";
import GeoloniaMap from "../custom/GeoloniaMap";

import { _x } from "@wordpress/i18n";
import fullscreen from "./fullscreenMap";

import fetch from "../../lib/fetch";

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
  const { geojsonId, bounds, style } = props;

  // mapbox map and draw binding
  const [map, setMap] = useState<mapboxgl.Map | undefined>(undefined);

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

    map.addControl(new fullscreen(".gis-panel .editor"), "top-right");
    // @ts-ignore
    map.addControl(new window.geolonia.NavigationControl());

    setMap(map);

  }, [props, geojsonId]);

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
