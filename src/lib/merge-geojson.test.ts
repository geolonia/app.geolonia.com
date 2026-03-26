import { mergeGeoJSON } from './merge-geojson';

describe('mergeGeoJSON', () => {
  const pointFeature: GeoJSON.Feature = {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [139.7, 35.7] },
    properties: { name: 'Tokyo' },
  };

  const lineFeature: GeoJSON.Feature = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [
        [139.7, 35.7],
        [135.5, 34.7],
      ],
    },
    properties: { name: 'Route' },
  };

  it('should merge two valid FeatureCollections', () => {
    const prev: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: [pointFeature],
    };
    const next: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: [lineFeature],
    };
    const result = mergeGeoJSON(prev, next);
    expect(result.type).toBe('FeatureCollection');
    expect(result.features).toHaveLength(2);
    expect(result.features[0]).toEqual(pointFeature);
    expect(result.features[1]).toEqual(lineFeature);
  });

  it('should merge empty FeatureCollections', () => {
    const empty: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    };
    const result = mergeGeoJSON(empty, empty);
    expect(result.features).toHaveLength(0);
  });

  it('should return empty FeatureCollection if prev is not valid GeoJSON', () => {
    const valid: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: [pointFeature],
    };
    const result = mergeGeoJSON(null, valid);
    expect(result).toEqual({ type: 'FeatureCollection', features: [] });
  });

  it('should return empty FeatureCollection if next is not valid GeoJSON', () => {
    const valid: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: [pointFeature],
    };
    const result = mergeGeoJSON(valid, { type: 'Feature' });
    expect(result).toEqual({ type: 'FeatureCollection', features: [] });
  });

  it('should return empty FeatureCollection if both are invalid', () => {
    const result = mergeGeoJSON(undefined, 'not geojson');
    expect(result).toEqual({ type: 'FeatureCollection', features: [] });
  });

  it('should not mutate original collections', () => {
    const prev: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: [pointFeature],
    };
    const next: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: [lineFeature],
    };
    mergeGeoJSON(prev, next);
    expect(prev.features).toHaveLength(1);
    expect(next.features).toHaveLength(1);
  });
});
