import React from "react";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import Button from "@material-ui/core/Button";
import { readFile } from "../../lib/read-file";
import { __ } from "@wordpress/i18n";
import mergeGeoJSON from "../../lib/merge-geojson";

type Props = {
  geoJSON: GeoJSON.FeatureCollection | undefined;
  setGeoJSON: (geojson: Props["geoJSON"]) => void;
};

export const Upload: React.FC<Props> = props => {
  const [error, setError] = React.useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(false);
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const prevGeoJSON = props.geoJSON;

      readFile(file).then(result => {
        let nextGeoJSON;
        try {
          nextGeoJSON = JSON.parse(result);
          if (prevGeoJSON) {
            nextGeoJSON = JSON.parse(result);
            nextGeoJSON = mergeGeoJSON(prevGeoJSON, nextGeoJSON);
          } else {
            nextGeoJSON = JSON.parse(result);
          }
          props.setGeoJSON(nextGeoJSON);
        } catch (err) {
          console.error(err);
          setError(true);
        }
      });
    }
  };

  return (
    <Button className="file-upload" component="label">
      <div>
        GeoJSON ファイルを選択してください。
        <br />
        <CloudUploadIcon />
        <br />
        <input
          type="file"
          className="inputFileBtnHide"
          accept="application/JSON"
          onChange={onChange}
        />
        {error && <p>{__("Invalid JSON.")}</p>}
      </div>
    </Button>
  );
};

export default Upload;
