import React from "react";

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
  onAfterLoad: (map: mapboxgl.Map) => void;
};

class Map extends React.Component<Props> {
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
    const { tilecloud } = window;
    const map = new tilecloud.Map(this.container.current);
    this.props.onAfterLoad(map);
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
