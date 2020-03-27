import React from "react";

import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { __ } from "@wordpress/i18n";

// @ts-ignore
import MapboxDraw from "@mapbox/mapbox-gl-draw";

type Props = {
  GeoJsonID: string | undefined;
  drawObject: MapboxDraw;
};

const Content = (props: Props) => {
  const { GeoJsonID, drawObject } = props;

  const downloadGeoJson = () => {
    if (GeoJsonID && drawObject) {
      const geojson = JSON.stringify(drawObject.getAll())
      const element = document.createElement('a')
      const file = new Blob([geojson], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `${GeoJsonID}.geojson`;
      document.body.appendChild(element); // Required for this to work in FireFox
      element.click()
      document.body.removeChild(element);
    }
  }

  return (
    <>
      <button className="btn" onClick={downloadGeoJson}><CloudDownloadIcon fontSize="small" /><span className="label">{__("Download GeoJSON")}</span></button>
    </>
  );
};

export default Content;
