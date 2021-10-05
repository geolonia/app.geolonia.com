import React, { useCallback, useEffect, useRef, useState } from 'react';
import { GeoloniaMap } from '@geolonia/embed-react';

import { _x } from '@wordpress/i18n';
import fullscreen from './fullscreenMap';
import { refreshSession } from '../../auth';
import { useSession } from '../../hooks/session';
import mapboxgl from 'mapbox-gl';

const { REACT_APP_STAGE } = process.env;
const STAGE = REACT_APP_STAGE === 'v1' ? 'v1': 'dev';
const embedSrc = `https://cdn.geolonia.com/${STAGE}/embed?geolonia-api-key=YOUR-API-KEY`;

type OwnProps = {
  geojsonId: string;
  style?: string;
};

type Props = OwnProps;

const mapStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  border: '1px solid #dedede',
  margin: '0 0 1em 0',
};

export const MapEditor = (props: Props) => {
  const { geojsonId, style } = props;
  const { session } = useSession();

  // mapbox map binding
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [sessionIsValid, setSessionIsValid] = useState<boolean>(!!session?.isValid());
  const sessionRef = useRef<Geolonia.Session>(session);

  useEffect(() => {
    if (mapRef.current && style) {
      mapRef.current.setStyle(style);
    }
  }, [style]);

  const handleOnAfterLoad = useCallback(async (map: mapboxgl.Map) => {
    map.addControl(new fullscreen('.gis-panel .editor'), 'top-right');
    // @ts-ignore
    map.addControl(new window.geolonia.NavigationControl());

    mapRef.current = map;
  }, []);

  const transformRequest = useCallback((url: string, resourceType) => {
    if (sessionRef.current && url.indexOf('customtiles') >= 0) {
      const idToken = sessionRef.current.getIdToken().getJwtToken();
      return {
        url: `${url}&key=YOUR-API-KEY`,
        headers: {
          Authorization: idToken,
        },
      };
    }
    return { url };
  }, []);

  useEffect(() => {
    let updateTimer: number | undefined;
    const updater = (async () => {
      if (!session || !session.isValid()) {
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
    };
  }, [session]);

  if (!sessionIsValid || !geojsonId) {
    return null;
  }

  return (
    <div style={mapStyle}>
      <GeoloniaMap
        embedSrc={embedSrc}
        mapRef={mapRef}
        style={{width: '100%', height: '100%'}}
        gestureHandling={'off'}
        marker={'off'}
        zoom={_x('0', 'Default value of zoom level of map')}
        geolocateControl={'off'}
        fullscreenControl={'off'}
        navigationControl={'off'}
        simpleVector={`geolonia://tiles/custom/${geojsonId}`}
        onLoad={handleOnAfterLoad}
        initOptions={{ transformRequest }}
      />
    </div>
  );
};

export default MapEditor;
