import React, { useState, useCallback, useRef, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import { CopyToClipboard } from '../custom/copy-to-clipboard';
import { GeoloniaMap } from '@geolonia/embed-react';
import StyleSelector from '../Data/StyleSelector';
import { CloseButton } from './close-button';
import { CenterMarker } from './center-marker';
import { __, sprintf } from '@wordpress/i18n';
import { geocode as geocodeWithCommunityGeocoder, CommunityGeocodeResult } from '../../lib/community-geocoder';
import geojsonExtent from '@mapbox/geojson-extent';
import './get-geolonia.scss';
import mapboxgl from 'mapbox-gl';

type Props = {
  geojsonId?: string;
  defaultXYZ?: [x: number, y: number, z: number];
  marker? : 'on' | 'off',
  mapStyle?: string;
};

type Geolonia__JISX0402Resp = {
  prefecture: string;
  city: string;
  prefecture_kana: string;
  city_kana: string;
  code: string;
  code4: string;
};

const styleSelectorStyle: React.CSSProperties = {
  margin: '8px',
  paddingLeft: '8px',
  paddingRight: '8px',
  fontSize: '18px',
  height: '36px',
  boxSizing: 'border-box',
  border: '1px solid #cccccc',
  borderRadius: '0',
  outline: 'none',
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: 9999,
};

const buildEmbedHtmlSnipet = (options: { [key: string]: string | number | undefined }) => {
  // data-marker depends on data-lat and data-lng. https://docs.geolonia.com
  // The simpler the snipet, the better.
  const extendedOptions = { ...options };
  if (options.marker && (!options.lat || !options.lng)) {
    delete extendedOptions.marker;
  }

  const attributeTexts = Object.keys(extendedOptions)
    .filter((key) => extendedOptions[key])
    .map((key) => {
      if (key === 'class') {
        return `class="${extendedOptions[key]}"`;
      } else {
        const keyInKebab = key.replace(/[A-Z]/g, '-$&').toLowerCase();
        let value = extendedOptions[key];
        if (value === undefined || value === '') {
          return false;
        }

        if (key === 'class') {
          return `class="${value}"`;
        }

        if ((key === 'lat' || key === 'lng' || key === 'zoom') && typeof value === 'number') {
          // 1.666666666e-10 -> 0
          // 35.12300000     -> 35.123
          // 35.00000000     -> 35
          // 0035.12300000   -> 35.123
          value = value.toFixed(8).replaceAll('0', ' ').trimRight().replaceAll(' ', '0');
          if (value === '' || value === '.') {
            value = '0';
          } else if (value[value.length - 1] === '.') {
            value = value.slice(0, value.length - 1);
          }
        } else {
          value = value.toString();
        }
        return `data-${keyInKebab}="${value}"`;
      }
    })
    .filter((x) => !!x)
    .join('\n  ') || '';

  return `<div
  ${attributeTexts}
></div>`;
};

export const GetGeolonia: React.FC<Props> = (props: Props) => {
  const { geojsonId, defaultXYZ, marker, mapStyle } = props;
  const simpleVector = geojsonId ? `geolonia://tiles/custom/${geojsonId}` : undefined;

  const defaultLng = defaultXYZ ? defaultXYZ[0] : 0;
  const defaultLat = defaultXYZ ? defaultXYZ[1] : 0;
  const defaultZoom = defaultXYZ ? defaultXYZ[2] : 0;

  const [open, setOpen] = useState(false);
  const [geocodeText, setGeocodeText] = useState('');
  const [messageVisibility, setMessageVisibilty] = useState<string | false>(false);

  const [lngLatZoom, setLngLatZoom] = useState<[lng: number, lat: number, zoom: number] | null>(
    defaultXYZ || null,
  );
  const [styleIdentifier, setStyleIdentifier] = useState(mapStyle || 'geolonia/basic-v1');
  const [htmlSnippet, setHtmlSnippet] = useState('');

  const handleClickOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);
  const handleGeocodeTextChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => setGeocodeText(event.target.value), []);
  const handleHtmlSnippetChangeByUser = useCallback((event: React.ChangeEvent<HTMLInputElement>) => setHtmlSnippet(event.target.value), []);

  const mapRef = useRef<mapboxgl.Map | null>(null);

  const handleGeocodeSubmit = useCallback(() => {
    if (!geocodeText) return;

    const requestCommunityGeocoder = async () => {
      if (!mapRef.current) {
        return null;
      }
      let latlng: CommunityGeocodeResult;
      try {
        latlng = await geocodeWithCommunityGeocoder(geocodeText);
      } catch (error: any) {
        setMessageVisibilty(error.message || __('Unknown error.'));
        return;
      }
      if (!latlng) {
        return null;
      }

      if (latlng.level === 1) {
        const endpoint = 'https://geolonia.github.io/japanese-prefectural-capitals/index.json';
        const res = await fetch(endpoint);
        const data = await res.json();
        mapRef.current.flyTo({ center: data[latlng.pref], zoom: 9, essential: true });
        setMessageVisibilty(sprintf(__('Location could not be determined, so move to %s.'), latlng.pref));
      } else if (latlng.level === 2) {
        let endpoint = 'https://geolonia.github.io/jisx0402/api/v1/all.json';
        let res = await fetch(endpoint);
        let data = await res.json();

        const keys = Object.keys(data);
        const values = Object.values(data) as Geolonia__JISX0402Resp[];
        const index = values.findIndex((value) => value.prefecture === latlng.pref && value.city === latlng.city);
        const code = keys[index].slice(0, 5);

        endpoint = `https://geolonia.github.io/japanese-admins/${code.slice(0, 2)}/${code}.json`;
        res = await fetch(endpoint);
        data = await res.json();

        mapRef.current.fitBounds(geojsonExtent(data) as mapboxgl.LngLatBoundsLike);
        setMessageVisibilty(sprintf(__('Location could not be determined, so move to %s.'), data.features[0].properties.name));

      } else {
        mapRef.current.flyTo({ center: latlng as { lat: number, lng: number }, zoom: 16, essential: true });
      }
    };
    requestCommunityGeocoder();
  }, [geocodeText, setMessageVisibilty]);

  const handleGeocodeTextInputKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleGeocodeSubmit();
    }
    setMessageVisibilty(false);
  }, [handleGeocodeSubmit, setMessageVisibilty]);

  useEffect(() => {
    if (lngLatZoom) {
      const [lng, lat, zoom] = lngLatZoom;
      setHtmlSnippet(buildEmbedHtmlSnipet({
        class: 'geolonia',
        lng,
        lat,
        zoom,
        marker,
        style: styleIdentifier,
        simpleVector,
      }));
    } else {
      setHtmlSnippet(buildEmbedHtmlSnipet({
        class: 'geolonia',
        style: styleIdentifier,
        simpleVector,
      }));
    }

  }, [lngLatZoom, marker, simpleVector, styleIdentifier]);

  const handleMapOnLoad = useCallback((map: mapboxgl.Map) => {

    const moveendCallback = (map: mapboxgl.Map) => {
      const { lng, lat } = map.getCenter();
      const zoom = map.getZoom();
      setLngLatZoom([lng, lat, zoom]);
    };

    map.once('load', () => {
      map.on('moveend', (ev) => moveendCallback(ev.target));
    });
  }, []);

  return <>
    <Button
      variant="contained"
      color="primary"
      size="large"
      style={{ width: '100%' }}
      onClick={handleClickOpen}
    >
      {__('Get HTML')}
    </Button>

    <Modal open={open} onClose={handleClose} style={{display: 'flex'}}>
      <div className={'get-geolonia-modal-content'}>
        <GeoloniaMap
          // We only set the lat/lng/zoom once, because if we set them every time the map is panned,
          // we'll end up with an infinite loop of re-rendering.
          lat={`${defaultLat}`}
          lng={`${defaultLng}`}
          zoom={`${defaultZoom}`}
          marker={'off'}
          mapRef={mapRef}
          style={{width: '100%', height: 'calc(100% - 150px)'}}
          mapStyle={styleIdentifier}
          simpleVector={simpleVector}
          onLoad={handleMapOnLoad}
        >
          <GeoloniaMap.Control
            position={'bottom-left'}
            containerProps={{ className: 'mapboxgl-ctrl maplibregl-ctrl community-geocoder-ctrl-container' }}
          >
            <input
              className={'mapbox-gl-control-community-geocoder-text-input'}
              type={'text'}
              placeholder={__('Enter your address.')}
              value={geocodeText}
              onChange={handleGeocodeTextChange}
              onKeyDown={handleGeocodeTextInputKeyDown}
            />
            <button
              className={'mapbox-gl-control-community-geocoder-button'}
              type={'button'}
              disabled={!geocodeText}
              onClick={handleGeocodeSubmit}
            >
              {__('Search')}
            </button>
            <p
              className={'mapbox-gl-control-community-geocoder-message'}
              style={{display: messageVisibility ? 'block' : 'none'}}
            >
              {messageVisibility}
            </p>
          </GeoloniaMap.Control>
        </GeoloniaMap>

        <StyleSelector style={styleSelectorStyle} styleIdentifier={styleIdentifier} setStyleIdentifier={setStyleIdentifier} />

        <div className={'get-geolonia-code-container'}>
          <input
            id={'get-geolonia__html-snippet'}
            className={'get-geolonia-html'}
            value={htmlSnippet.replaceAll('\n  ', ' ')}
            onChange={handleHtmlSnippetChangeByUser}
          />
          <CopyToClipboard value={htmlSnippet} target={'get-geolonia__html-snippet'} />
        </div>

        <CloseButton onClick={handleClose} />
        <CenterMarker />
      </div>
    </Modal>
  </>;
};
