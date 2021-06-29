import React from "react";

import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Importer from './GeoJsonImporter'
import { __ } from "@wordpress/i18n";

type Props = {
  GeoJsonImporter: Function;
};

const Content = (props: Props) => {
  const [stateImporter, setStateImporter] = React.useState<boolean>(false)

  const closeImporter = () => {
    setStateImporter(false)
  }

  const GeoJsonImporter = (geojson: GeoJSON.FeatureCollection) => {
    props.GeoJsonImporter(geojson)
    setStateImporter(false)
  }

  return (
    <>
      <button className="btn" onClick={() => setStateImporter(true)}><CloudUploadIcon fontSize="small" /><span className="label">{__("Import GeoJSON")}</span></button>
      {stateImporter? <Importer state={stateImporter} onClose={closeImporter} GeoJsonImporter={GeoJsonImporter} uiType={"button"} />: <></>}
    </>
  );
};

export default Content;
