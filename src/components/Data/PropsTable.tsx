import React from "react";
import { __ } from "@wordpress/i18n";
import Save from "../custom/Save";
import SimpleStyle from './SimpleStyle'

import { Feature } from "../../types";

type Props = {
  currentFeature: Feature | undefined;
  updateFeatureProps: Function;
};

export const PropsTable = (props: Props) => {
  const { currentFeature, updateFeatureProps } = props;
  const [status, setStatus] = React.useState<
    false | "requesting" | "success" | "failure"
  >(false);

  const onClickHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    return updateFeatureProps()
  }

  const onRequestError = () => {

  }

  if ('undefined' !== typeof currentFeature && Object.keys(currentFeature).length) {
    const type = currentFeature.geometry.type
    const styleSpec = SimpleStyle[type]

    const rows = []
    for (const key in styleSpec) {
      rows.push(<tr key={key}><th>{styleSpec[key].label}:</th><td><input /></td></tr>)
    }

    return (
      <div className="props">
        <div className="props-button">
          <Save
            onClick={onClickHandler}
            onError={onRequestError}
            disabled={status === "requesting"}
          />
        </div>
        <div className="props-inner">
          <h3>{__('Title')}</h3>
          <input type="text" name="geojson-title" />
          <h3>{__('Description')}</h3>
          <input type="text" name="geojson-title" />
          <h3>{__('Style')}</h3>
          <table className="prop-table">
            <tbody>
              {rows}
            </tbody>
          </table>
        </div>
      </div>
    );
  } else {
    return <p>{__('Click a feature to edit properties.')}</p>
  }
}

export default PropsTable
