import React from "react";

import SimpleStyle from "./SimpleStyle";
import { __ } from "@wordpress/i18n";

type exclude = ["__featureId", ""];

type Props = {
  currentFeature: Geolonia.Feature;
};

const Content = (props: Props) => {
  const [properties, setProperties] = React.useState<
    Geolonia.FeatureProperties
  >({});

  React.useEffect(() => {
    const spec = SimpleStyle[props.currentFeature.geometry.type];
    const properties = { ...props.currentFeature.properties };
    const exclude = [
      "__featureId",
      "__geojsonId",
      "title",
      "description",
      ...Object.keys(spec)
    ];
    for (const key in properties) {
      if (exclude.includes(key)) {
        delete properties[key];
      }
    }
    setProperties(properties);
  }, [props.currentFeature]);

  const updateHandler = (event: React.ChangeEvent<HTMLInputElement>) => {};

  const tableRows = [];
  for (let i = 0; i < Object.keys(properties).length; i++) {
    const key = Object.keys(properties)[i];
    const value = properties[key];
    tableRows.push(
      <tr key={i}>
        <th>
          <input value={key} onChange={updateHandler} data-index={i} />
        </th>
        <td>
          <input value={value} onChange={updateHandler} data-index={i} />
        </td>
      </tr>
    );
  }

  return (
    <div className="props-table">
      {tableRows.length ? (
        <table>
          <thead>
            <tr>
              <th>{__("Key")}</th>
              <th>{__("Value")}</th>
            </tr>
          </thead>
          <tbody>{tableRows}</tbody>
        </table>
      ) : (
        <p>{__("Nothing found.")}</p>
      )}
    </div>
  );
};

export default Content;
