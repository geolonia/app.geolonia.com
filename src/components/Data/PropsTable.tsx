import React from "react";
import { __ } from "@wordpress/i18n";
import Save from "../custom/Save";
import SimpleStyle from './SimpleStyle'
import { Feature, FeatureProperties } from "../../types";

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
  const [FeatureProperties, setFeatureProperties] = React.useState<FeatureProperties>({});

  const updatePropHandler = (event: React.FormEvent<HTMLInputElement>) => {
    const prop = event.currentTarget.name
    const value = event.currentTarget.value
    const props = {} as FeatureProperties
    props[prop] = value
    return updateFeatureProps(props)
  }

  if ('undefined' !== typeof currentFeature && Object.keys(currentFeature).length) {
    const type = currentFeature.geometry.type
    const styleSpec = SimpleStyle[type]

    const rows = []
    for (const key in styleSpec) {
      let input = <input className={styleSpec[key].type} type="text" name={key} />
      if ('number' === styleSpec[key].type) {
        const num = currentFeature.properties[key] || 0
        input = <input className={styleSpec[key].type} type="number" name={key} defaultValue={num} onChange={updatePropHandler} />
      } else if ('color' === styleSpec[key].type) {
        const color = currentFeature.properties[key] || '#000000'
        input = <input className={styleSpec[key].type} type="text" name={key} defaultValue={color} onChange={updatePropHandler} />
      }
      rows.push(<tr key={key}><th>{styleSpec[key].label}:</th><td>{input}</td></tr>)
    }

    return (
      <div className="props">
        <div className="props-inner">
          <h3>{__('Title')}</h3>
          <input type="text" name="title" defaultValue={currentFeature.properties.title} onChange={updatePropHandler} />
          <h3>{__('Description')}</h3>
          <input type="text" name="description" defaultValue={currentFeature.properties.description} onChange={updatePropHandler} />
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
      <div className="color-picker-container" style={style}>
        {__('Click a feature to edit properties.')}
      </div>
    );
  }
}

export default PropsTable
