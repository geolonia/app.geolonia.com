import React from "react";

import { __ } from "@wordpress/i18n";
import SimpleStyle from './SimpleStyle'
import InputColor from '../custom/InputColor'
import { Feature, FeatureProperties } from "../../types";

type Props = {
  currentFeature: Feature;
  updateFeatureProperties: Function;
};

export const PropsTable = (props: Props) => {
  const { currentFeature, updateFeatureProperties } = props;

  const updateProps = (key: keyof FeatureProperties, value: string | number) => {
    updateFeatureProperties(key, value)
  }

  const updatePropHandler = (event: React.FormEvent<HTMLInputElement>) => {
    const property = event.currentTarget.name
    const value = ('stroke-width' === property) ? Number(event.currentTarget.value) : event.currentTarget.value
    updateFeatureProperties(property, value)
  }

  const updatePropSelectHandler = (event: any) => {
    if (event.target.name) {
      const prop = event.target.name.split(/--/)[1]
      const value = ('stroke-width' === prop) ? Number(event.target.value) : event.target.value
      updateProps(prop, value)
    }
  }

  const type = currentFeature.geometry.type
  const styleSpec = SimpleStyle[type]

  const tableRows = []
  for (const key in styleSpec) {
    const name = key
    const value = currentFeature.properties[key]
    let input = <input className={styleSpec[key].type} type="text" name={name} />
    if ('number' === styleSpec[key].type) {
      input = <input className={styleSpec[key].type} type="number" name={name} value={value} onChange={updatePropHandler} />
    } else if ('color' === styleSpec[key].type) {
      input = <InputColor className={styleSpec[key].type} color={value.toString()} updateFeatureProperties={updateFeatureProperties} name={name} />
    } else if ('option' === styleSpec[key].type) {
      input = <select className="select-menu" name={name} value={value.toString()} onChange={updatePropSelectHandler}><option value="small">{__("Small")}</option>
          <option value="medium">{__("Medium")}</option><option value="large">{__("Large")}</option></select>
    }
    tableRows.push(<tr key={key}><th>{styleSpec[key].label}</th><td>{input}</td></tr>)
  }

  return (
    <div className="props">
      <div className="props-inner">
        <h3>{__('Title')} debug:{currentFeature.properties.title}</h3>
        <input type="text" name="title" value={currentFeature.properties.title} onChange={updatePropHandler} />
        <h3>{__('Description')}</h3>
        <input type="text" name="description" value={currentFeature.properties.description} onChange={updatePropHandler} />
        <h3>{__('Style')}</h3>
        <table className="prop-table">
          <tbody>
            {tableRows}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PropsTable