import React from "react";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import Button from "@material-ui/core/Button";
import { readFile } from "../../lib/read-file";
import { sprintf, __, _n } from "@wordpress/i18n";
import mergeGeoJSON from "../../lib/merge-geojson";

type Props = {
  geoJSON: GeoJSON.FeatureCollection | undefined;
  setGeoJSON: (geojson: Props["geoJSON"]) => void;
  prevGeoJSON: GeoJSON.FeatureCollection | undefined;
  setPrevGeoJSON: (prev: Props["prevGeoJSON"]) => void;
};

export const Upload: React.FC<Props> = props => {
  const [error, setError] = React.useState(false);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(false);
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      readFile(file).then(result => {
        let nextGeoJSON;
        try {
          const prevGeoJSON = JSON.parse(result);
          nextGeoJSON = prevGeoJSON;
          if (props.geoJSON) {
            nextGeoJSON = JSON.parse(result);
            nextGeoJSON = mergeGeoJSON(props.geoJSON, nextGeoJSON);
          } else {
            nextGeoJSON = JSON.parse(result) as GeoJSON.FeatureCollection;
          }
          props.setPrevGeoJSON(prevGeoJSON);
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
        {props.prevGeoJSON && props.prevGeoJSON.features && (
          <p>
            {sprintf(
              _n(
                "%s feature has been added.",
                "%s features have been added.",
                props.prevGeoJSON.features.length
              ),
              props.prevGeoJSON.features.length
            )}
          </p>
        )}
      </div>
    </Button>
  );
};

export default Upload;
