import React from 'react';
import {_x} from '@wordpress/i18n';

// typeguard
const isMapboxStyle = (obj: any): obj is mapboxgl.Style => !!obj

interface Window { tilecloud: any | null }
declare const window: Window;

type Props = {
  id: string,
  width: string,
  height: string,
  gestureHandling: 'on' | 'off',
  lat: number,
  lng: number,
  marker:  'on' | 'off',
  zoom: number,
  afterLoad: Function,
}

class Map extends React.Component<Props> {
  style: React.CSSProperties = {}
  container = React.createRef<HTMLDivElement>()

  constructor(props: Props) {
    super(props)

    this.style.width = props.width
    this.style.height = props.height
  }

  static defaultProps = {
    width: '100%',
    height: '200px',
    gestureHandling: 'off',
    lat: _x('0', 'Default value of latitude for map'), // TODO: The value is always '0'. Why?
    lng: _x('0', 'Default value of longitude for map'), // TODO: The value is always '0'. Why?
    marker: 'off',
    zoom: 8,
    afterLoad: () => {}
  }

  componentDidMount() {
    const map = new window.tilecloud.Map(this.container.current);
    this.props.afterLoad(map)
  }

  render() {
    // TODO: It couldn't be loaded on `defaultProps`.
    const defaults = {
      lat: _x('0', 'Default value of latitude for map'),
      lng: _x('0', 'Default value of longitude for map'),
    }

    const props = {
      ...this.props,
      ...defaults
    }

    return (
      <div
        id={props.id}
        ref={this.container}
        style={this.style}
        data-gesture-handling={this.props.gestureHandling}
        data-lat={props.lat.toString()}
        data-lng={props.lng.toString()}
        data-marker={props.marker}
        data-zoom={props.zoom}
      />
    );
  }
}

export default Map;
