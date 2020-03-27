import React from "react";
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

const blackOrWhite = (hexcolor: string) => {
  if (! hexcolor.startsWith('#')) {
    return '#FFFFFF'
  }

	var r = parseInt(hexcolor.substr( 1, 2 ), 16)
	var g = parseInt(hexcolor.substr( 3, 2 ), 16)
	var b = parseInt(hexcolor.substr( 5, 2 ), 16)

	return ( ( ( (r * 299) + (g * 587) + (b * 114) ) / 1000 ) < 128 ) ? "#FFFFFF" : "#000000" ;
}

const coverStyle: React.CSSProperties = {
  position: 'fixed',
  top: '0px',
  right: '0px',
  bottom: '0px',
  left: '0px',
  zIndex: 9999,
}

type Props = {
  color: string;
  className: string;
  name: string;
  updateFeatureProperties: Function;
};

const defaultStyle: React.CSSProperties = {
  backgroundColor: '#7e7e7e',
  fontSize: "80%",
  padding: "4px",
  textAlign: "center",
  color: "#ffffff",
  border: "none",
}

const InputColor = (props: Props) => {
  const { color, className, name, updateFeatureProperties } = props;
  const [stateColorPicker, setStateColorPicker] = React.useState<boolean>(false)
  const [styleColorPickerContainer, setStyleColorPickerContainer] = React.useState<React.CSSProperties>({})
  const [pickerColor, setPickerColor] = React.useState<string>('')
  const [styleInput, setStyleInput] = React.useState<React.CSSProperties>(defaultStyle)

  const onFocusHandler = (event: React.FocusEvent<HTMLInputElement>) => {
    // Note: Size of color picker is 225x247.75.
    const outer = document.querySelector('.gis-panel .props')
    if (outer) {
      const {top, left} = event.currentTarget.getBoundingClientRect()
      const {top: _top, left: _left} = outer.getBoundingClientRect()

      setStyleColorPickerContainer({
        top: top - _top- 260,
        left: left - _left,
        display: 'block',
      })

      setStateColorPicker(true)
      setPickerColor(color)
    }
  }

  const changeColorCompleteHanlder = (object: object) => {
    const colorObject = object as ColorObject
    let color
    if (1 > colorObject.rgb.a) {
      color = `rgba(${colorObject.rgb.r}, ${colorObject.rgb.g}, ${colorObject.rgb.b}, ${colorObject.rgb.a})`
    } else {
      color = colorObject.hex
    }

    setPickerColor(color)
    updateFeatureProperties(name, color)
  }

  const closePicker = () => {
    setStateColorPicker(false)
  }

  const onChangeHandler = () => {
    // Nothing to do. It is needed to prevent warning.
  }

  React.useEffect(() => {
    if (color) {
      const style = {...defaultStyle}
      style.backgroundColor = color
      style.color = blackOrWhite(color)
      setStyleInput(style)
    }
  }, [color])

  React.useEffect(() => {
    if (pickerColor) {
      const style = {...defaultStyle}
      style.backgroundColor = pickerColor
      style.color = blackOrWhite(pickerColor)
      setStyleInput(style)
    }
  }, [pickerColor])

  return (
    <>
      <input className={className} type="text" value={color} name={name} onFocus={onFocusHandler} onChange={onChangeHandler} style={styleInput} />
      { stateColorPicker? <div><div style={coverStyle} onClick={closePicker}></div>
          <div className="color-picker-container" style={styleColorPickerContainer}>
            <ColorPicker color={pickerColor} onChangeComplete={changeColorCompleteHanlder} /></div></div>: null}
    </>
  );
};

export default InputColor;
