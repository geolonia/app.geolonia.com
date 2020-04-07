import React, { useEffect } from "react";

import { __ } from "@wordpress/i18n";
import SimpleStyle from './SimpleStyle'
import InputColor from './InputColor'
import { Feature } from "../../types";
import InfoIcon from '@material-ui/icons/Info';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import PropsTable from './PropsTable'
import IconSelector from './IconSelector'

type Props = {
  currentFeature: Feature;
  updateFeatureProperties: Function;
};

export const PropsEditor = (props: Props) => {
  const { currentFeature, updateFeatureProperties } = props;
  const [ mode, setMode ] = React.useState<boolean>(true)
  const [ title, setTitle ] = React.useState<string>(currentFeature.properties.title.toString())
  const [ description, setDescription ] = React.useState<string>(currentFeature.properties.description.toString())

  const updatePropHandler = (event: React.FormEvent<HTMLInputElement>) => {
    const property = event.currentTarget.name
    const value = ('stroke-width' === property) ? Number(event.currentTarget.value) : event.currentTarget.value
    updateFeatureProperties(property, value)
  }

  // For title and description, so it should be fired after keyboard input.
  const onBlurHandler = (event: React.FormEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement>) => {
    const property = event.currentTarget.name
    const value = event.currentTarget.value
    updateFeatureProperties(property, value)
  }

  const updatePropSelectHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.target.name) {
      updateFeatureProperties(event.target.name, event.target.value)
    }
  }

  const updateTitleHandler = (event: React.FormEvent<HTMLInputElement>) => {
    setTitle(event.currentTarget.value)
  }

  const updateDescriptionHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.currentTarget.value)
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
    } else if ('symbol' === styleSpec[key].type) {
      input = <IconSelector name={name} Icon={value.toString()} updatePropSelectHandler={updatePropSelectHandler} />
    }

    // Note: @wordpress/i18n doesn't translate at the time of import, so it should be translated again.
    tableRows.push(<tr key={key}><th>{__(styleSpec[key].label)}</th><td>{input}</td></tr>)
  }

  return (
    <div className="props">
    {mode?
      <>
        <div className="goto-info"><button onClick={() => {setMode(false)}}><InfoIcon fontSize="small" /></button></div>
        <h3>{__('Title')}</h3>
        <input type="text" name="title" value={title} onChange={updateTitleHandler} onBlur={onBlurHandler} />
        <h3>{__('Description')}</h3>
        <textarea name="description" value={description} onChange={updateDescriptionHandler} onBlur={onBlurHandler} />
        <h3>{__('Style')}</h3>
        <table className="prop-table">
          <tbody>
            {tableRows}
          </tbody>
        </table>
      </>
      :
      <>
        <div className="backto"><button onClick={() => {setMode(true)}}><KeyboardBackspaceIcon fontSize="small" /></button></div>
        <PropsTable currentFeature={currentFeature} />
      </>
    }
    </div>
  );
}

export default PropsEditor
