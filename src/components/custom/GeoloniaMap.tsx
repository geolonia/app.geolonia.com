import React from "react";
import { LngLatBounds } from "mapbox-gl";

type Toggle = "on" | "off";

type Props = {
  width: string;
  height: string;
  gestureHandling: Toggle;
  lat: number;
  lng: number;
  marker: Toggle;
  zoom: number;
  fullscreenControl: Toggle;
  geolocateControl: Toggle;
  style: string;
  bounds: mapboxgl.LngLatBoundsLike | undefined;
  onAfterLoad: (map: mapboxgl.Map) => void;
};

type State = {
  map: mapboxgl.Map
}

class Map extends React.Component<Props, State> {
  style: React.CSSProperties = {};
  container = React.createRef<HTMLDivElement>();

  constructor(props: Props) {
    super(props);

    this.style.width = props.width;
    this.style.height = props.height;
  }

  static defaultProps = {
    width: "100%",
    height: "200px",
    gestureHandling: "on",
    lat: 0,
    lng: 0,
    marker: "on",
    zoom: 0,
    fullscreenControl: "off",
    geolocateControl: "off",
    style: null,
    onAfterLoad: () => {}
  };

  componentDidMount() {
    // @ts-ignore
    const { geolonia } = window;
    const map = new geolonia.Map(this.container.current);
    this.props.onAfterLoad(map);

    this.setState({map: map})
  }

  componentDidUpdate() {
    if (this.props.bounds) {
      this.state.map.fitBounds(this.props.bounds, {
        padding: 20,
        maxZoom: 16,
      })
    }
  }

  render() {
    return (
      <div
        ref={this.container}
        style={this.style}
        data-gesture-handling={this.props.gestureHandling}
        data-lat={this.props.lat.toString()}
        data-lng={this.props.lng.toString()}
        data-marker={this.props.marker}
        data-zoom={this.props.zoom}
        data-fullscreen-control={this.props.fullscreenControl}
        data-geolocate-control={this.props.geolocateControl}
        data-style={this.props.style}
      />
    );
  }
}

export default Map;
