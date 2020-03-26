import React from "react";

import { __ } from "@wordpress/i18n";
import SimpleStyle from './SimpleStyle'
import InputColor from '../custom/InputColor'
import { Feature } from "../../types";

type Props = {
  currentFeature: Feature;
  updateFeatureProperties: Function;
};

export const PropsTable = (props: Props) => {
  const { currentFeature, updateFeatureProperties } = props;

  const updatePropHandler = (event: React.FormEvent<HTMLInputElement>) => {
    const property = event.currentTarget.name
    const value = ('stroke-width' === property) ? Number(event.currentTarget.value) : event.currentTarget.value
    updateFeatureProperties(property, value)
  }

  const updatePropSelectHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.target.name) {
      updateFeatureProperties(event.target.name, event.target.value)
    }
  }

  const type = currentFeature.geometry.type
  const styleSpec = SimpleStyle[type]

  const tableRows = []
  for (const key in styleSpec) {
    const name = key
    const value = currentFeature.properties[key]
    let input = <input className={styleSpec[key].type} type="text" name={name} value={value} onChange={updatePropHandler} />
    if ('number' === styleSpec[key].type) {
      input = <input className={styleSpec[key].type} type="number" name={name} value={value} onChange={updatePropHandler} min="0" />
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
        <h3>{__('Title')}</h3>
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
