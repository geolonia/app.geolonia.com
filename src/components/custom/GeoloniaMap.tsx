import React from 'react';

// To prevent error "tilecloud doesn't exist"
interface Window { tilecloud: any | null }
declare const window: Window;

type Props = {
  id: string,
  width: string,
  height: string,
  gestureHandling: string,
  lat: number,
  lng: number,
  marker: string,
  zoom: number,
  fullscreenControl: string,
  geolocateControl: string,
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
    lat: 0,
    lng: 0,
    marker: 'on',
    zoom: 0,
    fullscreenControl: 'off',
    geolocateControl: 'off',
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
        data-marker={this.props.marker}
        data-zoom={this.props.zoom}
        data-fullscreen-control={this.props.fullscreenControl}
        data-geolocate-control={this.props.geolocateControl}
      />
    );
  }
}

export default Map;
