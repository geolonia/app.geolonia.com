const isGeoJSON = (json: any): json is GeoJSON.FeatureCollection => {
  return (
    json && json.type === 'FeatureCollection' && Array.isArray(json.features)
  );
};

export const mergeGeoJSON = (
  prev: any,
  next: any,
): GeoJSON.FeatureCollection => {
  if (isGeoJSON(prev) && isGeoJSON(next)) {
    return {
      type: 'FeatureCollection',
      features: [...prev.features, ...next.features],
    };
  } else {
    return {
      type: 'FeatureCollection',
      features: [],
    };
  }
};

export default mergeGeoJSON;
