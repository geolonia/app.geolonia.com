import React from "react";

import { __ } from "@wordpress/i18n";
import SimpleStyle from './SimpleStyle'
import InputColor from '../custom/InputColor'
import { Feature, FeatureProperties } from "../../types";

type Props = {
  currentFeature: Feature;
  updateFeatureProperties: Function;
};

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
  const [featureId, setFeatureId] = React.useState<string>(currentFeature.id)
  const [featureProperties, setFeatureProperties] = React.useState<FeatureProperties>(getDefaultProperties(currentFeature))

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

  React.useEffect(() => {
    setFeatureId(currentFeature.id)
    setFeatureProperties(getDefaultProperties(currentFeature))
  }, [currentFeature])

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
      input = <InputColor className={styleSpec[key].type} color={properties[key].toString()} name={name} />
    } else if ('option' === styleSpec[key].type) {
      const size = currentFeature.properties[key] || 'medium'
      input = <select className="select-menu" name={name} value={properties[key]} onChange={__updatePropSelectHandler}><option value="small">{__("Small")}</option>
          <option value="medium">{__("Medium")}</option><option value="large">{__("Large")}</option></select>
    }
    tableRows.push(<tr key={key}><th>{styleSpec[key].label}</th><td>{input}</td></tr>)
  }

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
    </div>
  );
}

export default PropsTable
