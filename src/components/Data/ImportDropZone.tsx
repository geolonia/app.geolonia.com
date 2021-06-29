import React from "react";
import Importer from './GeoJsonImporter'

type Props = {
  GeoJsonImporter: Function;
};

const Content = (props: Props) => {

  const GeoJsonImporter = (geojson: GeoJSON.FeatureCollection) => {
    props.GeoJsonImporter(geojson)
  }

  return  <Importer state={true} onClose={()=>{}} GeoJsonImporter={GeoJsonImporter} uiType={"dropZone"} />
};

export default Content;
