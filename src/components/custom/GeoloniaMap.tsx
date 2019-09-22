import React from 'react';
import {__, _x} from '@wordpress/i18n';

// typeguard
const isMapboxStyle = (obj: any): obj is mapboxgl.Style => !!obj

interface Window { tilecloud: any | null }
declare const window: Window;

type Props = {
  id: string,
  width: string,
  height: string,
  gestureHandling: 'on' | 'off'
  lat: number,
  lng: number,
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
    lat: __('0', 'lat'),
    lng: __('0', 'lng'),
    afterLoad: () => {}
  }

  componentDidMount() {
    const map = new window.tilecloud.Map(this.container.current);
    this.props.afterLoad(map)
  }

  render() {
    return (
      <div
        id={this.props.id}
        ref={this.container}
        style={this.style}
        data-gesture-handling={this.props.gestureHandling}
        data-lat={this.props.lat.toString()}
        data-lng={this.props.lng.toString()}
      />
    );
  }
}

export default Map;
