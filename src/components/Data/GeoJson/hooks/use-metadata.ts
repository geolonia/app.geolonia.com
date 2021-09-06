import { useEffect, useState } from 'react';
const { REACT_APP_TILE_SERVER } = process.env;

export default function useMetadata(geojsonId: string | void) {
  const [layerNames, setLayerNames] = useState<string[] | null | 'error'>(null);

  useEffect(() => {
    if (geojsonId) {
      const metadataUrl = `${REACT_APP_TILE_SERVER}/customtiles/${geojsonId}/metadata.json?key=YOUR-API-KEY`;

      fetch(metadataUrl)
        .then((res) => {
          if (res.status < 400) {
            return res.json();
          } else {
            throw new Error();
          }
        })
        .then((data) => setLayerNames((data.vector_layers.map((layer: any) => layer.id))))
        .catch(() => setLayerNames('error'));
    }}, [geojsonId]);

  return { layerNames };
}
