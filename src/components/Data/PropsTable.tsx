import React from "react";

import { __ } from "@wordpress/i18n";
import SimpleStyle from './SimpleStyle'
import InputColor from '../custom/InputColor'
import { Feature, FeatureProperties } from "../../types";

import { ChromePicker as ColorPicker } from 'react-color';

interface rgbObject {
  r: number;
  g: number;
  b: number;
  a: number;
}

interface ColorObject {
  hex: string;
  rgb: rgbObject;
  [key: string]: number | string | object;
}

type Props = {
  currentFeature: Feature;
  updateFeatureProperties: Function;
};

const coverStyle: React.CSSProperties = {
  position: 'fixed',
  top: '0px',
  right: '0px',
  bottom: '0px',
  left: '0px',
  zIndex: 9999,
}

const getDefaultProperties = (currentFeature: Feature) => {
  const type = currentFeature.geometry.type
  const styleSpec = SimpleStyle[type]

  const feature = {...currentFeature} as Feature
  for (const key in styleSpec) {
    feature.properties[key] = styleSpec[key].default
  }
  feature.properties = {...feature.properties, ...currentFeature.properties}

  return feature.properties
}

export const PropsTable = (props: Props) => {
  const { currentFeature, updateFeatureProperties } = props;
  const [stateColorPicker, setStateColorPicker] = React.useState<boolean>(false)
  const [styleColorPickerContainer, setStyleColorPickerContainer] = React.useState<React.CSSProperties>({})
  const [pickerTarget, setPickerTarget] = React.useState<HTMLInputElement>()
  const [pickerColor, setPickerColor] = React.useState<string>('')
  const [tableRows, setTableRows] = React.useState<JSX.Element[]>()
  const [featureId, setFeatureId] = React.useState<string>(currentFeature.id)
  const [featureProperties, setFeatureProperties] = React.useState<FeatureProperties>(getDefaultProperties(currentFeature))

  const colorOnFocusHandler = (event: React.FocusEvent<HTMLInputElement>) => {
    const target = event.currentTarget
    const { top: y, left: x } = target.getBoundingClientRect()
    const top = y + window.pageYOffset - 255 // 255 is the height of color picker
    const left = x + window.pageXOffset
    setStyleColorPickerContainer({
      top: top,
      left: left,
      display: 'block',
    })

    setStateColorPicker(true)
    setPickerColor(target.value)
    setPickerTarget(target)
  }

  const changeColorCompleteHanlder = (object: object) => {
    const colorObject = object as ColorObject
    let color
    if (1 > colorObject.rgb.a) {
      color = `rgba(${colorObject.rgb.r}, ${colorObject.rgb.g}, ${colorObject.rgb.b}, ${colorObject.rgb.a})`
    } else {
      color = colorObject.hex
    }

    if (pickerTarget) {
      pickerTarget.value = color
      updatePropSelectHandler({target: pickerTarget}) // Fires the event `onChange`.
    }
  }

  const closePicker = () => {
    setStateColorPicker(false)
  }

  const updateProps = (key: string, value: string | number) => {
    const prop = {} as FeatureProperties
    prop[key] = value
    setFeatureProperties({...featureProperties, ...prop})
    updateFeatureProperties(prop)
  }

  const updatePropHandler = (event: React.FormEvent<HTMLInputElement>) => {
    const prop = event.currentTarget.name.split(/--/)[1]
    const value = ('stroke-width' === prop) ? Number(event.currentTarget.value) : event.currentTarget.value
    updateProps(prop, value)
  }

  const updatePropSelectHandler = (event: any) => {
    if (event.target.name) {
      const prop = event.target.name.split(/--/)[1]
      const value = ('stroke-width' === prop) ? Number(event.target.value) : event.target.value
      updateProps(prop, value)
    }
  }

  const __updatePropHandler = React.useCallback(updatePropHandler, [updateFeatureProperties])
  const __updatePropSelectHandler = React.useCallback(updatePropSelectHandler, [updateFeatureProperties])
  const __colorOnFocusHandler = React.useCallback(colorOnFocusHandler, [])

  React.useEffect(() => {
    setFeatureId(currentFeature.id)
    setFeatureProperties(getDefaultProperties(currentFeature))
  }, [currentFeature])

  React.useEffect(() => {
    const id = currentFeature.id
    const type = currentFeature.geometry.type
    const styleSpec = SimpleStyle[type]
    const properties = getDefaultProperties(currentFeature)

    const tableRows = []
    for (const key in styleSpec) {
      const name = `${id}--${key}`
      let input = <input className={styleSpec[key].type} type="text" name={name} />
      if ('number' === styleSpec[key].type) {
        input = <input className={styleSpec[key].type} type="number" name={name} value={properties[key]} onChange={__updatePropHandler} />
      } else if ('color' === styleSpec[key].type) {
        input = <InputColor className={styleSpec[key].type} color={properties[key].toString()} name={name} onFocus={__colorOnFocusHandler} />
      } else if ('option' === styleSpec[key].type) {
        const size = currentFeature.properties[key] || 'medium'
        input = <select className="select-menu" name={name} value={properties[key]} onChange={__updatePropSelectHandler}><option value="small">{__("Small")}</option>
            <option value="medium">{__("Medium")}</option><option value="large">{__("Large")}</option></select>
      }
      rows.push(<tr key={key}><th>{styleSpec[key].label}</th><td>{input}</td></tr>)
    }
    setTableRows(rows)
  }, [currentFeature, __updatePropHandler, __updatePropSelectHandler, __colorOnFocusHandler]);

  return (
    <div className="props">
      <div className="props-inner">
        <h3>{__('Title')} debug:{featureProperties.title}</h3>
        <input type="text" name={`${featureId}--title`} value={featureProperties.title} onChange={updatePropHandler} />
        <h3>{__('Description')}</h3>
        <input type="text" name={`${featureId}--description`} value={featureProperties.description} onChange={updatePropHandler} />
        <h3>{__('Style')}</h3>
        <table className="prop-table">
          <tbody>
            {tableRows}
          </tbody>
        </table>
      </div>
      { stateColorPicker? <div><div style={coverStyle} onClick={closePicker}></div>
          <div className="color-picker-container" style={styleColorPickerContainer}>
            <ColorPicker color={pickerColor} onChangeComplete={changeColorCompleteHanlder} /></div></div>: null}
    </div>
  );
}

export default PropsTable
