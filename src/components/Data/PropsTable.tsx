import React from "react";
import { __ } from "@wordpress/i18n";
import { SketchPicker } from 'react-color';

import Save from "../custom/Save";
import SimpleStyle from './SimpleStyle'

import { Feature } from "../../types";

type Props = {
  currentFeature: Feature | undefined;
  updateFeatureProps: Function;
};

const style: React.CSSProperties = {
  backgroundColor: "#EEEEEE",
  padding: "16px",
  textAlign: "center",
  color: "#555555",
  fontWeight: "bold",
}

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
      rows.push(<tr key={key}><th>{styleSpec[key].label}:</th><td><input className={styleSpec[key].type} type="text" name={key} /></td></tr>)
    }

    return (
      <div className="props">
        <div className="props-button">
          <Save
            onClick={onClickHandler}
            onError={onRequestError}
            disabled={status === "requesting"}
            label={__("Save Properties")}
          />
        </div>
        <div className="props-inner">
          <h3>{__('Title')}</h3>
          <input type="text" name="title" />
          <h3>{__('Description')}</h3>
          <input type="text" name="description" />
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
    return (
      <div style={style}>
        {__('Click a feature to edit properties.')}
      </div>
    );
  }
}

export default PropsTable
