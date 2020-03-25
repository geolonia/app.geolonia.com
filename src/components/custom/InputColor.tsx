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

const InputColor = (props: Props) => {
  const { color, className, name, updateFeatureProperties } = props;
  const [stateColorPicker, setStateColorPicker] = React.useState<boolean>(false)
  const [styleColorPickerContainer, setStyleColorPickerContainer] = React.useState<React.CSSProperties>({})
  const [pickerTarget, setPickerTarget] = React.useState<HTMLInputElement>()
  const [pickerColor, setPickerColor] = React.useState<string>('')
  const [backgroundColor, setBackgroundColor] = React.useState<string>('#7e7e7e')
  const [textColor, setTextColor] = React.useState<string>('#FFFFFF')

  const onFocusHandler = (event: React.FocusEvent<HTMLInputElement>) => {
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

  return (
    <>
      <input className={className} type="text" value={color} name={name} onFocus={onFocusHandler} onChange={onChangeHandler} />
      { stateColorPicker? <div><div style={coverStyle} onClick={closePicker}></div>
          <div className="color-picker-container" style={styleColorPickerContainer}>
            <ColorPicker color={pickerColor} onChangeComplete={changeColorCompleteHanlder} /></div></div>: null}
    </>
  );
};

export default InputColor;