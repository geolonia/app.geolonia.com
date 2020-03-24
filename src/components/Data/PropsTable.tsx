import React from "react";

import { __ } from "@wordpress/i18n";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
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

const coverStyle: React.CSSProperties = {
  position: 'fixed',
  top: '0px',
  right: '0px',
  bottom: '0px',
  left: '0px',
  zIndex: 9999,
}

export const PropsTable = (props: Props) => {
  const { currentFeature, updateFeatureProps } = props;
  const [stateColorPicker, setStateColorPicker] = React.useState<boolean>(false)
  const [styleColorPickerContainer, setStyleColorPickerContainer] = React.useState<React.CSSProperties>({})
  const [pickerTarget, setPickerTarget] = React.useState<HTMLInputElement>()
  const [pickerColor, setPickerColor] = React.useState<string>('#000000')

  const updatePropHandler = (event: React.FormEvent<HTMLInputElement>) => {
    const prop = event.currentTarget.name
    const value = ('stroke-width' === prop) ? Number(event.currentTarget.value) : event.currentTarget.value
    const properties = {} as FeatureProperties
    properties[prop] = value
    return updateFeatureProps(properties)
  }

  const updatePropSelectHandler = (event: any) => {
    if (event.target.name) {
      const prop = event.target.name
      const value = ('stroke-width' === prop) ? Number(event.target.value) : event.target.value
      const properties = {} as FeatureProperties
      properties[prop] = value
      return updateFeatureProps(properties)
    }
  }

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

  if ('undefined' !== typeof currentFeature && Object.keys(currentFeature).length) {
    const type = currentFeature.geometry.type
    const styleSpec = SimpleStyle[type]

    const rows = []
    for (const key in styleSpec) {
      let input = <input className={styleSpec[key].type} type="text" name={key} />
      if ('number' === styleSpec[key].type) {
        const num = currentFeature.properties[key] || 1
        input = <input className={styleSpec[key].type} type="number" name={key} defaultValue={num} onChange={updatePropHandler} />
      } else if ('color' === styleSpec[key].type) {
        const color = (currentFeature.properties[key] || '#000000').toString()
        //input = <input className={styleSpec[key].type} type="text" name={key} defaultValue={color} onChange={updatePropHandler} onFocus={colorOnFocusHandler} />
        input = <InputColor className={styleSpec[key].type} color={color} name={key} onChange={updatePropHandler} onFocus={colorOnFocusHandler} />
      } else if ('option' === styleSpec[key].type) {
        const size = currentFeature.properties[key] || 'medium'
        input = <Select className="select-menu" name={key} value={size} onChange={updatePropSelectHandler}><MenuItem value="small">{__("Small")}</MenuItem><MenuItem value="medium">{__("Medium")}</MenuItem><MenuItem value="large">{__("Large")}</MenuItem></Select>
      }
      rows.push(<tr key={key}><th>{styleSpec[key].label}</th><td>{input}</td></tr>)
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
        { stateColorPicker? <div><div style={coverStyle} onClick={closePicker}></div>
            <div className="color-picker-container" style={styleColorPickerContainer}>
              <ColorPicker color={pickerColor} onChangeComplete={changeColorCompleteHanlder} /></div></div>: null}
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
