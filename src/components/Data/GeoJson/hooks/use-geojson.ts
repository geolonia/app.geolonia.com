import React from "react";

// @ts-ignore
import geojsonExtent from "@mapbox/geojson-extent";
import fetch from "../../../../lib/fetch";

// types
import { Session } from "../../../../types";

const { REACT_APP_STAGE } = process.env;

type GeoJSONMeta = {
  name: string;
  isPublic: boolean;
};

export default function useGeoJSON(session: Session, geojsonId: string | void) {
  const [geoJsonMeta, setGeoJsonMeta] = React.useState<GeoJSONMeta | null>(
    null
  );
  const [geoJSON, setGeoJSON] = React.useState<
    GeoJSON.FeatureCollection | undefined
  >(void 0);
  const [bounds, setBounds] = React.useState<
    mapboxgl.LngLatBoundsLike | undefined
  >(undefined);

  React.useEffect(() => {
    if (session && geojsonId) {
      // get GeoJSON meta
      fetch(
        session,
        `https://api.geolonia.com/${REACT_APP_STAGE}/geojsons/${geojsonId}`
      )
        .then(res => res.json())
        .then(json => {
          const allowedOrigins =
            typeof json.allowedOrigins === "string" ? json.allowedOrigins : "";
          setGeoJsonMeta({ ...json, allowedOrigins });
        });

      // get Features
      fetch(
        session,
        `https://api.geolonia.com/${REACT_APP_STAGE}/geojsons/${geojsonId}/features`
      )
        .then(res => res.json())
        .then(json => {
          const geojson = {
            type: "FeatureCollection",
            features: json.features
          } as GeoJSON.FeatureCollection;
          setGeoJSON(geojson);
          setBounds(geojsonExtent(geojson));
        });
    }
  }, [session, geojsonId]);

  return {
    geoJsonMeta,
    bounds,
    geoJSON,
    setGeoJSON,
    setBounds,
    setGeoJsonMeta
  };
}
