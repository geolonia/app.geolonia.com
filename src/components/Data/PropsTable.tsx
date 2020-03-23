import React from "react";
import { __ } from "@wordpress/i18n";
import Save from "../custom/Save";
import SimpleStyle from './SimpleStyle.json'

type Props = {
  currentFeature: object | undefined;
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
    return (
      <div className="props">
        <h3>{__('Title')}</h3>
        <input type="text" id="geojson-title" />
        <h3>{__('Description')}</h3>
        <textarea id="geojson-description"></textarea>
        <h3>{__('Style')}</h3>
        <table className="prop-table">
          <tbody>
            <tr><th>Size:</th><td><input /></td></tr>
            <tr><th>Symbol:</th><td></td></tr>
          </tbody>
        </table>

        <Save
          onClick={onClickHandler}
          onError={onRequestError}
          disabled={status === "requesting"}
        />
      </div>
    );
  } else {
    return <></>
  }
}

export default PropsTable
