import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl'
import ReactMapGL from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// typeguard
const isMapboxStyle = (obj: any): obj is mapboxgl.Style => !!obj

class App extends Component {
  state = {
    viewport: {
      width: '100%',
      height: 400,
      latitude: 37.7577,
      longitude: -122.4376,
      zoom: 8
    },
    style: false,
  };

  componentDidMount() {
    fetch('https://api.geolonia.com/dev/styles/geolonia-basic?key=YOUR-API-KEY')
        .then(res => res.json())
        .then(style => this.setState({ style }))
  }

  render() {

    const {style} = this.state

    return (
      <div className="App">
        {isMapboxStyle(style) && <ReactMapGL
          {...this.state.viewport}
          onViewportChange={(viewport) => this.setState({ viewport })}
          mapStyle={ style }
        />}
      </div>
    );
  }
}

export default App;
