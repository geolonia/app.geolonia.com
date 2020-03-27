import React, { useEffect } from "react";

import { Feature, FeatureProperties } from '../../types';
import SimpleStyle from './SimpleStyle';
import { __ } from "@wordpress/i18n";

type exclude = [
  "__featureId",
  ""
]

type Props = {
  currentFeature: Feature;
};

const Content = (props: Props) => {
  const [properties, setProperties] = React.useState<FeatureProperties>({})

  useEffect(() => {
    const spec = SimpleStyle[props.currentFeature.geometry.type]
    const properties = {...props.currentFeature.properties}
    const exclude = ['__featureId', '__geojsonId', 'title', 'description', ...Object.keys(spec)]
    for (const key in properties) {
      if (exclude.includes(key)) {
        delete properties[key]
      }
    }
    setProperties(properties)
  }, [props.currentFeature])

  const tableRows = []
  for (const key in properties) {
    tableRows.push(<tr key={key}><th>{key}</th><td>{properties[key]}</td></tr>)
  }

  return (
    <div className="props-table">
    {tableRows.length?
      <table>
        <tbody>{tableRows}</tbody>
      </table>
      :
      <p>{__("Nothing found.")}</p>
    }
    </div>
  );
};

export default Content;
