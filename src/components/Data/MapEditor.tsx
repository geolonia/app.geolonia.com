import React, { useCallback, useEffect, useRef } from 'react';
import GeoloniaMap from '../custom/GeoloniaMap';

import { _x } from '@wordpress/i18n';
import fullscreen from './fullscreenMap';

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

  // mapbox map and draw binding
  const mapRef = useRef<mapboxgl.Map | null>(null);
  // const [sessionIsValid, setSessionIsValid] = useState<boolean>(!!session?.isValid());
  // const sessionRef = useRef<Geolonia.Session>(session);

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
    // if (sessionRef.current && url.indexOf('customtiles') >= 0) {
    //   const idToken = sessionRef.current.getIdToken().getJwtToken();
    //   return {
    //     url,
    //     headers: {
    //       Authorization: idToken,
    //     },
    //   };
    // }
    return { url };
  }, []);

  useEffect(() => {
    let updateTimer: number | undefined;
    const updater = (async () => {
      // if (!session || session.isValid()) {
      //   return;
      // }
      // const newSession = await refreshSession(session);
      // sessionRef.current = newSession;
      // setSessionIsValid(newSession.isValid());
      updateTimer = setTimeout(updater, 30_000) as unknown as number;
    });
    updater();

    return () => {
      if (updateTimer) {
        clearTimeout(updateTimer);
      }
    };
  }, []);

  // if (!sessionIsValid || !geojsonId) {
  //   return null;
  // }

  return (
    <div style={mapStyle}>
      <GeoloniaMap
        width="100%"
        height="100%"
        gestureHandling="off"
        marker={'off'}
        zoom={parseFloat(_x('0', 'Default value of zoom level of map'))}
        geolocateControl={'off'}
        fullscreenControl={'off'}
        navigationControl={'off'}
        onAfterLoad={handleOnAfterLoad}
        geojsonId={geojsonId}
        initialMapOptions={{
          transformRequest,
        }}
      />
    </div>
  );
};

export default MapEditor;
