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

type FeatureMeta = {
  title: string;
  description: string;
}

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
  const [pickerColor, setPickerColor] = React.useState<string>('')
  const [tableRows, setTableRows] = React.useState<JSX.Element[]>()
  const [featureId, setFeatureId] = React.useState<string>()
  const [featureMeta, setFeatureMeta] = React.useState<FeatureMeta>({title: '', description: ''})

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

  const updatePropHandler = (event: React.FormEvent<HTMLInputElement>) => {
    const prop = event.currentTarget.name.split(/--/)[1]
    const value = ('stroke-width' === prop) ? Number(event.currentTarget.value) : event.currentTarget.value
    const properties = {} as FeatureProperties
    properties[prop] = value
    return updateFeatureProps(properties)
  }

  const updatePropSelectHandler = (event: any) => {
    if (event.target.name) {
      const prop = event.target.name.split(/--/)[1]
      const value = ('stroke-width' === prop) ? Number(event.target.value) : event.target.value
      const properties = {} as FeatureProperties
      properties[prop] = value
      return updateFeatureProps(properties)
    }
  }

  const __updatePropHandler = React.useCallback(updatePropHandler, [updateFeatureProps])
  const __updatePropSelectHandler = React.useCallback(updatePropSelectHandler, [updateFeatureProps])
  const __colorOnFocusHandler = React.useCallback(colorOnFocusHandler, [])

  React.useEffect(() => {
    if ('undefined' !== typeof currentFeature && Object.keys(currentFeature).length) {
      const id = currentFeature.id
      const type = currentFeature.geometry.type
      const styleSpec = SimpleStyle[type]

      const rows = []
      for (const key in styleSpec) {
        const name = `${id}--${key}`
        let input = <input className={styleSpec[key].type} type="text" name={name} />
        if ('number' === styleSpec[key].type) {
          const num = currentFeature.properties[key] || 1
          input = <input className={styleSpec[key].type} type="number" name={name} defaultValue={num} onChange={__updatePropHandler} />
        } else if ('color' === styleSpec[key].type) {
          let color = (currentFeature.properties[key] || '#7e7e7e').toString()
          if ('stroke' === key) {
            color = (currentFeature.properties[key] || '#555555').toString()
          }
          input = <InputColor className={styleSpec[key].type} color={color} name={name} onFocus={__colorOnFocusHandler} />
        } else if ('option' === styleSpec[key].type) {
          const size = currentFeature.properties[key] || 'medium'
          input = <Select className="select-menu" name={key} value={size} onChange={__updatePropSelectHandler}><MenuItem value="small">{__("Small")}</MenuItem><MenuItem value="medium">{__("Medium")}</MenuItem><MenuItem value="large">{__("Large")}</MenuItem></Select>
        }
        rows.push(<tr key={key}><th>{styleSpec[key].label}</th><td>{input}</td></tr>)
      }
      setTableRows(rows)
      setFeatureId(id)
      setFeatureMeta({
        title: (currentFeature.properties.title || '').toString(),
        description: (currentFeature.properties.description || '').toString(),
      })
    }
  }, [currentFeature, __updatePropHandler, __updatePropSelectHandler, __colorOnFocusHandler]);

  return (currentFeature?
    <div className="props">
      <div className="props-inner">
        <h3>{__('Title')}</h3>
        <input type="text" name={`${featureId}--title`} defaultValue={featureMeta.title} onChange={updatePropHandler} />
        <h3>{__('Description')}</h3>
        <input type="text" name={`${featureId}--description`} defaultValue={featureMeta.description} onChange={updatePropHandler} />
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
      </div>: <div className="color-picker-container" style={style}>
      {__('Click a feature to edit properties.')}
    </div>
  );
}

export default PropsTable
