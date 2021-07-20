import React, { useEffect, useState } from "react";

// @ts-ignore
import geojsonExtent from "@mapbox/geojson-extent";
import fetch from "../../../../lib/fetch";

const { REACT_APP_STAGE } = process.env;

type GeoJSONMeta = {
  name: string;
  isPublic: boolean;
  allowedOrigins: string[];
  status: string;
  gvp_status?: undefined | "progress" | "created" | "failure",
  teamId: string;
};

export type GeoJsonMetaSetter = React.Dispatch<React.SetStateAction<GeoJSONMeta | null>>;

export default function useGeoJSON(
  session: Geolonia.Session,
  geojsonId: string | void
) {
  const [geoJsonMeta, setGeoJsonMeta] = useState<GeoJSONMeta | null>(
    null
  );
  const [geoJSON, setGeoJSON] = useState<
    GeoJSON.FeatureCollection | undefined
  >(void 0);
  const [bounds, setBounds] = useState<
    mapboxgl.LngLatBoundsLike | undefined
  >(undefined);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (session && geojsonId) {
      // get GeoJSON meta
      fetch(
        session,
        `https://api.geolonia.com/${REACT_APP_STAGE}/geojsons/${geojsonId}`
      )
        .then(res => {
          if (res.status < 400) {
            return res.json();
          } else {
            throw new Error();
          }
        })
        .then(json => {
          console.log(json)
          const allowedOrigins =
            typeof json.allowedOrigins !== "undefined" ? json.allowedOrigins : [];
          setGeoJsonMeta({ ...json, allowedOrigins });
        })
        .catch(() => setError(true));

      // get Features
      fetch(
        session,
        `https://api.geolonia.com/${REACT_APP_STAGE}/geojsons/${geojsonId}/features`
      )
        .then(res => {
          if (res.status < 400) {
            return res.json();
          } else {
            throw new Error();
          }
        })
        .then(json => {
          const geojson = {
            type: "FeatureCollection",
            features: json.features
          } as GeoJSON.FeatureCollection;
          setGeoJSON(geojson);
          setBounds(geojsonExtent(geojson));
        })
        .catch(() => setError(true));
    }
  }, [session, geojsonId]);

  return {
    geoJsonMeta,
    bounds,
    geoJSON,
    setGeoJSON,
    setBounds,
    setGeoJsonMeta,
    error
  };
}
