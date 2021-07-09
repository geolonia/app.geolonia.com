import React from "react";
const { REACT_APP_STAGE } = process.env;

type Toggle = "on" | "off";

type Props = {
  geojsonId: string | undefined;
  width: string;
  height: string;
  gestureHandling: Toggle;
  lat: number;
  lng: number;
  marker: Toggle;
  zoom: number;
  navigationControl: Toggle;
  fullscreenControl: Toggle;
  geolocateControl: Toggle;
  bounds: mapboxgl.LngLatBoundsLike | undefined;
  onAfterLoad: (map: mapboxgl.Map) => void;
};

type State = {
  map: mapboxgl.Map
}

class Map extends React.Component<Props, State> {
  style: React.CSSProperties = {};
  container = React.createRef<HTMLDivElement>();
  tileserverHost: string = REACT_APP_STAGE === "v1" ? "tileserver.geolonia.com" : "tileserver-dev.geolonia.com"

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
    navigationControl: "off",
    style: null,
    simpleVector: null,
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
        data-navigation-control={this.props.navigationControl}
        data-fullscreen-control={this.props.fullscreenControl}
        data-geolocate-control={this.props.geolocateControl}
        data-simple-vector={`https://${this.tileserverHost}/customtiles/${this.props.geojsonId}/tiles.json?key=YOUR-API-KEY`}
      />
    );
  }
}

export default Map;
